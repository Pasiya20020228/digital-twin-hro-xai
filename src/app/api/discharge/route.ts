import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const data = await req.json();

    const {
      patientId, // Can be UUID or string PT-XXXX
      disposition,
      destinationWard,
      dischargeNotes,
      dischargeDate,
      dischargeTime,
      medicationReconciliation,
      bedTurnoverInitiated,
    } = data;

    if (!patientId || !disposition || !dischargeNotes) {
      return NextResponse.json(
        { error: 'Patient ID, disposition, and clinical discharge notes are required.' },
        { status: 400 }
      );
    }

    // Find the patient
    const patient = await prisma.patientRecord.findFirst({
      where: {
        OR: [{ id: patientId }, { patientId: patientId }],
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient record not found.' }, { status: 404 });
    }

    if (patient.status === 'Discharged') {
      return NextResponse.json(
        { error: 'Patient is already recorded as discharged. Duplicate discharge prevented.' },
        { status: 409 }
      );
    }

    const dischargeDateTime = dischargeDate ? new Date(dischargeDate) : new Date();
    const nowTimeStr = dischargeTime || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const recordedByStr = user ? `${user.name} (${user.designation})` : 'Discharge Coordinator';

    // Create discharge entry and update patient status
    const [dischargeRecord, updatedPatient] = await prisma.$transaction([
      prisma.patientDischarge.create({
        data: {
          patientRecordId: patient.id,
          dischargeDate: dischargeDateTime,
          dischargeTime: nowTimeStr,
          disposition,
          destinationWard: destinationWard || null,
          dischargeNotes: dischargeNotes.trim(),
          medicationReconciliation: medicationReconciliation !== false,
          recordedBy: recordedByStr,
          bedTurnoverInitiated: bedTurnoverInitiated !== false,
        },
      }),
      prisma.patientRecord.update({
        where: { id: patient.id },
        data: {
          status: 'Discharged',
        },
      }),
    ]);

    // Calculate dwell time in minutes
    const arrivalMs = new Date(patient.arrivalDate).getTime();
    const dischargeMs = dischargeDateTime.getTime();
    const dwellMinutes = Math.max(1, Math.round((dischargeMs - arrivalMs) / (1000 * 60)));

    // Record flow event
    await prisma.patientFlowEvent.create({
      data: {
        patientRecordId: patient.id,
        patientId: patient.patientId,
        patientName: patient.fullName,
        eventType: 'DISCHARGE',
        ward: patient.hospitalArea,
        fromStatus: patient.status,
        toStatus: 'Discharged',
        durationMinutes: dwellMinutes,
        metadata: JSON.stringify({
          disposition,
          destinationWard,
          recordedBy: recordedByStr,
        }),
      },
    });

    // Free the bed if assigned
    if (patient.assignedBed) {
      await prisma.bed.updateMany({
        where: { bedCode: patient.assignedBed },
        data: {
          status: 'AVAILABLE',
          currentPatientId: null,
        },
      });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: 'PATIENT_DISCHARGED',
        entityType: 'PatientRecord',
        entityId: patient.id,
        performedBy: user ? user.email : 'system',
        details: JSON.stringify({
          patientId: patient.patientId,
          disposition,
          destinationWard,
          dwellMinutes,
        }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userId: user ? user.id : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Patient ${patient.fullName} (${patient.patientId}) discharged successfully.`,
      discharge: dischargeRecord,
      patient: updatedPatient,
    });
  } catch (error) {
    console.error('Discharge execution error:', error);
    return NextResponse.json({ error: 'Failed to record patient discharge.' }, { status: 500 });
  }
}

// GET: Fetch candidates awaiting discharge and discharge history
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'candidates'; // 'candidates' or 'history'

    if (mode === 'history') {
      const discharges = await prisma.patientDischarge.findMany({
        include: {
          patientRecord: true,
        },
        orderBy: { dischargeDate: 'desc' },
        take: 50,
      });
      return NextResponse.json({ success: true, discharges });
    }

    // Default: Candidates awaiting discharge
    const candidates = await prisma.patientRecord.findMany({
      where: {
        status: { in: ['Awaiting Transfer', 'Under Treatment', 'Active Intake'] },
      },
      include: {
        flowEvents: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { arrivalDate: 'asc' },
    });

    return NextResponse.json({ success: true, candidates });
  } catch (error) {
    console.error('Fetch discharge data error:', error);
    return NextResponse.json({ error: 'Failed to fetch discharge records' }, { status: 500 });
  }
}

