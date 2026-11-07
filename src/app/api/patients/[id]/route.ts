import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = await prisma.patientRecord.findFirst({
      where: {
        OR: [{ id }, { patientId: id }],
      },
      include: {
        discharges: true,
        flowEvents: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, patient });
  } catch (error) {
    console.error('Fetch patient error:', error);
    return NextResponse.json({ error: 'Failed to retrieve patient record' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await req.json();

    const existingPatient = await prisma.patientRecord.findFirst({
      where: { OR: [{ id }, { patientId: id }] },
    });

    if (!existingPatient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const updated = await prisma.patientRecord.update({
      where: { id: existingPatient.id },
      data: {
        fullName: body.fullName !== undefined ? body.fullName : existingPatient.fullName,
        age: body.age !== undefined ? parseInt(body.age, 10) : existingPatient.age,
        gender: body.gender || existingPatient.gender,
        contactNumber: body.contactNumber !== undefined ? body.contactNumber : existingPatient.contactNumber,
        presentingComplaint: body.presentingComplaint || existingPatient.presentingComplaint,
        patientHistory: body.patientHistory !== undefined ? body.patientHistory : existingPatient.patientHistory,
        hospitalArea: body.hospitalArea || existingPatient.hospitalArea,
        category: body.category || existingPatient.category,
        arrivalMode: body.arrivalMode || existingPatient.arrivalMode,
        assignedBed: body.assignedBed !== undefined ? body.assignedBed : existingPatient.assignedBed,
        assignedDoctor: body.assignedDoctor || existingPatient.assignedDoctor,
        assignedNurse: body.assignedNurse || existingPatient.assignedNurse,
        heartRate: body.heartRate !== undefined ? parseInt(body.heartRate, 10) : existingPatient.heartRate,
        bloodPressure: body.bloodPressure !== undefined ? body.bloodPressure : existingPatient.bloodPressure,
        spo2: body.spo2 !== undefined ? parseInt(body.spo2, 10) : existingPatient.spo2,
        gcs: body.gcs !== undefined ? parseInt(body.gcs, 10) : existingPatient.gcs,
        notes: body.notes !== undefined ? body.notes : existingPatient.notes,
        status: body.status || existingPatient.status,
      },
    });

    // If status changed, record flow event
    if (body.status && body.status !== existingPatient.status) {
      await prisma.patientFlowEvent.create({
        data: {
          patientRecordId: existingPatient.id,
          patientId: existingPatient.patientId,
          patientName: existingPatient.fullName,
          eventType: 'STATUS_UPDATE',
          ward: updated.hospitalArea,
          fromStatus: existingPatient.status,
          toStatus: body.status,
          timestamp: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, patient: updated });
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json({ error: 'Failed to update patient record' }, { status: 500 });
  }
}

