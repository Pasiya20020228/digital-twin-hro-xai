import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { filename, datasetType, rows, rowCount } = await req.json();

    if (!filename || !rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: 'Filename and valid CSV row data are required.' },
        { status: 400 }
      );
    }

    // Expected required fields per dataset type
    const requiredSchema: Record<string, string[]> = {
      arrivals: ['arrival_datetime', 'triage_category', 'arrival_mode'],
      patient_flow: ['visit_id', 'arrival_datetime', 'triage_category'],
      bed_status: ['timestamp', 'occupied', 'available'],
      equipment: ['equipment_type', 'total_units', 'units_in_use'],
      disaster_incidents: ['incident_id', 'incident_type', 'severity'],
    };

    const targetType = datasetType || 'arrivals';
    const requiredFields = requiredSchema[targetType] || [];

    let validCount = 0;
    let invalidCount = 0;
    const errors: string[] = [];

    // Validate rows
    rows.forEach((row, idx) => {
      const missingFields = requiredFields.filter((f) => row[f] === undefined || row[f] === null || row[f] === '');
      if (missingFields.length > 0) {
        invalidCount++;
        if (errors.length < 5) {
          errors.push(`Row ${idx + 1}: Missing mandatory column(s): ${missingFields.join(', ')}`);
        }
      } else {
        validCount++;
      }
    });

    const totalRecords = rowCount || rows.length;

    // Record dataset import in DB
    const importRecord = await prisma.datasetImport.create({
      data: {
        filename,
        datasetType: targetType,
        recordCount: totalRecords,
        validCount,
        invalidCount,
        provenance: 'HISTORICAL_CSV',
        status: invalidCount === totalRecords ? 'FAILED' : 'COMPLETED',
        importedBy: user ? `${user.name} (${user.staffId})` : 'System Administrator',
        errorLog: errors.length > 0 ? errors.join('; ') : null,
      },
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: 'DATASET_IMPORTED',
        entityType: 'DatasetImport',
        entityId: importRecord.id,
        performedBy: user ? user.email : 'system',
        details: JSON.stringify({ filename, datasetType: targetType, validCount, invalidCount }),
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userId: user ? user.id : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully processed dataset "${filename}". ${validCount} valid rows verified with Historical CSV provenance.`,
      importRecord,
    });
  } catch (error) {
    console.error('Dataset import API error:', error);
    return NextResponse.json({ error: 'Failed to process dataset import.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const history = await prisma.datasetImport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error('Fetch dataset history error:', error);
    return NextResponse.json({ error: 'Failed to load dataset history' }, { status: 500 });
  }
}

