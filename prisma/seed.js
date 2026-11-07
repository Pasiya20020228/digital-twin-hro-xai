const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('Seeding ETU Intelligence database...');

  // 1. Seed Users
  await prisma.user.deleteMany({});
  
  const defaultPasswordHash = hashPassword('doctor123');
  const adminPasswordHash = hashPassword('admin123');
  const nursePasswordHash = hashPassword('nurse123');

  const users = [
    {
      email: 'stf-4029@hospital.org',
      name: 'Dr. Elena Vance, MD, FACEP',
      staffId: 'STF-4029',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
      department: 'Emergency Treatment Unit (ETU)',
      designation: 'ETU In-Charge Medical Officer',
      preferredWorkArea: 'ETU Complex',
      status: 'APPROVED',
    },
    {
      email: 'sysadmin@hospital.org',
      name: 'Eng. Kasun Jayawardena',
      staffId: 'STF-0001',
      passwordHash: adminPasswordHash,
      role: 'SYSTEM_ADMIN',
      hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
      department: 'Digital Health & Clinical Telemetry',
      designation: 'Chief Systems Administrator',
      preferredWorkArea: 'Colombo Ops Control',
      status: 'APPROVED',
    },
    {
      email: 'hospadmin@hospital.org',
      name: 'Dr. Maithree Perera',
      staffId: 'STF-0010',
      passwordHash: adminPasswordHash,
      role: 'HOSPITAL_ADMIN',
      hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
      department: 'Hospital Administration & Operations',
      designation: 'Deputy Director / Hospital Administrator',
      preferredWorkArea: 'ETU Complex',
      status: 'APPROVED',
    },
    {
      email: 'nurse@hospital.org',
      name: 'Sr. Elena Vance, RN',
      staffId: 'STF-7729',
      passwordHash: nursePasswordHash,
      role: 'NURSE',
      hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
      department: 'Emergency Treatment Unit (ETU)',
      designation: 'Senior Nursing Sister / Charge Nurse',
      preferredWorkArea: 'ETU Complex',
      status: 'APPROVED',
    },
    {
      email: 'pending@hospital.org',
      name: 'Dr. Nuwan Senanayake',
      staffId: 'STF-9901',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
      hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
      department: 'Accident Ward',
      designation: 'Casualty Medical Officer (Intern)',
      preferredWorkArea: 'Accident Ward',
      status: 'PENDING',
    },
    {
      email: 'disabled@hospital.org',
      name: 'Staff Revoked User',
      staffId: 'STF-9999',
      passwordHash: defaultPasswordHash,
      role: 'STAFF',
      hospital: 'National Hospital of Sri Lanka (NHSL), Colombo',
      department: 'Records Unit',
      designation: 'Inactive Staff Member',
      preferredWorkArea: 'ETU Complex',
      status: 'DISABLED',
    },
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
  }
  console.log(`Created ${users.length} authenticated users.`);

  // 2. Seed Beds
  await prisma.bed.deleteMany({});
  const bedsData = [];
  for (let i = 1; i <= 6; i++) {
    bedsData.push({
      bedCode: `RESUS-0${i}`,
      bedType: 'RESUSCITATION',
      ward: 'ETU Complex',
      status: i <= 3 ? 'OCCUPIED' : 'AVAILABLE',
    });
  }
  for (let i = 1; i <= 16; i++) {
    bedsData.push({
      bedCode: `ETU-BAY-${i.toString().padStart(2, '0')}`,
      bedType: 'ACUTE',
      ward: 'ETU Complex',
      status: i <= 12 ? 'OCCUPIED' : 'AVAILABLE',
    });
  }
  for (let i = 1; i <= 18; i++) {
    bedsData.push({
      bedCode: `ACC-BAY-${i.toString().padStart(2, '0')}`,
      bedType: 'GENERAL',
      ward: 'Accident Ward',
      status: i <= 14 ? 'OCCUPIED' : 'AVAILABLE',
    });
  }
  for (const b of bedsData) {
    await prisma.bed.create({ data: b });
  }
  console.log(`Created ${bedsData.length} hospital beds.`);

  // 3. Seed Patients & Discharges
  await prisma.patientDischarge.deleteMany({});
  await prisma.patientFlowEvent.deleteMany({});
  await prisma.patientRecord.deleteMany({});

  const now = new Date();
  const samplePatients = [
    {
      patientId: 'PT-2026-0042',
      fullName: 'Johnathan Silva',
      age: 54,
      gender: 'Male',
      contactNumber: '+94 77 123 4567',
      presentingComplaint: 'Acute crushing chest pain, diaphoresis & dyspnea (2h)',
      patientHistory: 'Hypertension (10y), Type-2 Diabetes Mellitus, Ex-smoker',
      arrivalDate: new Date(now.getTime() - 95 * 60 * 1000),
      arrivalTime: '14:20',
      hospitalArea: 'ETU Complex',
      category: 'Cat 1 - Resus',
      arrivalMode: 'Ambulance 1990',
      assignedBed: 'RESUS-01',
      assignedDoctor: 'Dr. Elena Vance, MD',
      assignedNurse: 'Sr. Elena Vance, RN',
      heartRate: 118,
      bloodPressure: '85/55',
      spo2: 91,
      gcs: 14,
      notes: 'ECG shows acute anterolateral STEMI. Heparin & Aspirin loaded. Urgent catheterization lab activation.',
      registeredBy: 'Sr. Elena Vance, RN',
      status: 'Under Treatment',
    },
    {
      patientId: 'PT-2026-0043',
      fullName: 'Kaveesh Perera',
      age: 29,
      gender: 'Male',
      contactNumber: '+94 71 987 6543',
      presentingComplaint: 'High-velocity blunt thoracic trauma, road accident on Galle Road',
      patientHistory: 'No prior medical co-morbidities',
      arrivalDate: new Date(now.getTime() - 60 * 60 * 1000),
      arrivalTime: '14:55',
      hospitalArea: 'ETU Complex',
      category: 'Cat 2 - Trauma',
      arrivalMode: 'Ambulance 1990',
      assignedBed: 'ETU-BAY-03',
      assignedDoctor: 'Dr. Elena Vance, MD',
      assignedNurse: 'Nurse P. Fernando',
      heartRate: 104,
      bloodPressure: '110/70',
      spo2: 96,
      gcs: 15,
      notes: 'FAST scan negative for free fluid. Right rib fractures (4th-6th). Intercostal chest drain inserted.',
      registeredBy: 'Triage Officer STF-4029',
      status: 'Under Treatment',
    },
    {
      patientId: 'PT-2026-0038',
      fullName: 'Mary Fernando',
      age: 68,
      gender: 'Female',
      contactNumber: '+94 72 345 6789',
      presentingComplaint: 'Severe orthopnea, bilateral pedal edema, acute pulmonary congestion',
      patientHistory: 'Ischemic cardiomyopathy (EF 30%), Chronic Kidney Disease Stage 3',
      arrivalDate: new Date(now.getTime() - 140 * 60 * 1000),
      arrivalTime: '13:35',
      hospitalArea: 'Accident Ward',
      category: 'Cat 3 - Urgent',
      arrivalMode: 'Walk-in',
      assignedBed: 'ACC-BAY-02',
      assignedDoctor: 'Dr. Maithree Perera',
      assignedNurse: 'Nurse T. Jayamaha',
      heartRate: 92,
      bloodPressure: '145/90',
      spo2: 93,
      gcs: 15,
      notes: 'IV Furosemide 80mg bolus given. Good urine output response. Pending step-down ward bed.',
      registeredBy: 'Sr. Elena Vance, RN',
      status: 'Awaiting Transfer',
    },
    {
      patientId: 'PT-2026-0039',
      fullName: 'Nimal Jayasinghe',
      age: 41,
      gender: 'Male',
      contactNumber: '+94 75 889 0012',
      presentingComplaint: 'Compound distal radius fracture with moderate soft tissue laceration',
      patientHistory: 'Asthma on PRN inhaler',
      arrivalDate: new Date(now.getTime() - 180 * 60 * 1000),
      arrivalTime: '12:55',
      hospitalArea: 'Accident Ward',
      category: 'Cat 3 - Urgent',
      arrivalMode: 'Walk-in',
      assignedBed: 'ACC-BAY-05',
      assignedDoctor: 'Dr. S. Wickramasinghe',
      assignedNurse: 'Nurse K. Abeyrathne',
      heartRate: 84,
      bloodPressure: '128/82',
      spo2: 99,
      gcs: 15,
      notes: 'Wound irrigated, tetanus toxoid given. Ortho consult completed; awaiting OT slot for ORIF.',
      registeredBy: 'Triage Lead',
      status: 'Under Treatment',
    },
    {
      patientId: 'PT-2026-0035',
      fullName: 'Kumari Rathnayake',
      age: 35,
      gender: 'Female',
      contactNumber: '+94 76 443 2190',
      presentingComplaint: 'High fever (103.5°F), rigors, altered mentation and flank tenderness',
      patientHistory: 'Recurrent UTIs, gestational diabetes history',
      arrivalDate: new Date(now.getTime() - 210 * 60 * 1000),
      arrivalTime: '12:25',
      hospitalArea: 'ETU Complex',
      category: 'Cat 2 - Trauma',
      arrivalMode: 'Hospital Transfer',
      assignedBed: 'ETU-BAY-06',
      assignedDoctor: 'Dr. Elena Vance, MD',
      assignedNurse: 'Sr. Elena Vance, RN',
      heartRate: 112,
      bloodPressure: '92/60',
      spo2: 94,
      gcs: 14,
      notes: 'Sepsis pathway activated. Blood cultures drawn, IV Ceftriaxone 2g started. Fluid resuscitation 30ml/kg.',
      registeredBy: 'Triage Officer STF-4029',
      status: 'Under Treatment',
    },
    {
      patientId: 'PT-2026-0031',
      fullName: 'Rohan De Silva',
      age: 62,
      gender: 'Male',
      contactNumber: '+94 78 554 4332',
      presentingComplaint: 'Severe colicky left flank pain radiating to groin, microscopic hematuria',
      patientHistory: 'Nephrolithiasis (2023), Dyslipidemia',
      arrivalDate: new Date(now.getTime() - 260 * 60 * 1000),
      arrivalTime: '11:35',
      hospitalArea: 'Accident Ward',
      category: 'Cat 4 - Semi-Urgent',
      arrivalMode: 'Walk-in',
      assignedBed: 'ACC-BAY-09',
      assignedDoctor: 'Dr. Maithree Perera',
      assignedNurse: 'Nurse S. Liyanage',
      heartRate: 76,
      bloodPressure: '135/85',
      spo2: 98,
      gcs: 15,
      notes: 'Analgesia effective with IV Ketorolac. Non-contrast CT KUB confirms 4mm distal ureteric calculus.',
      registeredBy: 'Sr. Elena Vance, RN',
      status: 'Active Intake',
    },
  ];

  for (const p of samplePatients) {
    const createdPatient = await prisma.patientRecord.create({ data: p });
    await prisma.patientFlowEvent.create({
      data: {
        patientRecordId: createdPatient.id,
        patientId: p.patientId,
        patientName: p.fullName,
        eventType: 'ARRIVAL',
        ward: p.hospitalArea,
        fromStatus: null,
        toStatus: p.status,
        durationMinutes: 15,
        timestamp: p.arrivalDate,
      },
    });
  }
  console.log(`Created ${samplePatients.length} active patient records with flow events.`);

  // 4. Seed Discharged Patients
  const dischargedPatients = [
    {
      patientId: 'PT-2026-0021',
      fullName: 'Priyantha Bandara',
      age: 48,
      gender: 'Male',
      contactNumber: '+94 77 999 8881',
      presentingComplaint: 'Paroxysmal supraventricular tachycardia (HR 185), lightheadedness',
      arrivalDate: new Date(now.getTime() - 360 * 60 * 1000),
      arrivalTime: '09:50',
      hospitalArea: 'ETU Complex',
      category: 'Cat 2 - Trauma',
      arrivalMode: 'Ambulance 1990',
      registeredBy: 'Sr. Elena Vance, RN',
      status: 'Discharged',
      discharges: {
        create: {
          dischargeDate: new Date(now.getTime() - 60 * 60 * 1000),
          dischargeTime: '14:50',
          disposition: 'Home / Self Care',
          destinationWard: 'Outpatient Cardiology Clinic Follow-up',
          dischargeNotes: 'Valsalva maneuver + IV Adenosine 6mg converted to sinus rhythm. Trop negative, normal 12-lead ECG post-conversion. Safe for discharge.',
          medicationReconciliation: true,
          recordedBy: 'Dr. Elena Vance, MD',
          bedTurnoverInitiated: true,
        },
      },
    },
    {
      patientId: 'PT-2026-0022',
      fullName: 'Sanduni Jayawardena',
      age: 31,
      gender: 'Female',
      contactNumber: '+94 71 333 4445',
      presentingComplaint: 'Left clavicle midshaft fracture post-slip, sharp localized pain',
      arrivalDate: new Date(now.getTime() - 420 * 60 * 1000),
      arrivalTime: '08:50',
      hospitalArea: 'Accident Ward',
      category: 'Cat 3 - Urgent',
      arrivalMode: 'Walk-in',
      registeredBy: 'Triage Lead',
      status: 'Discharged',
      discharges: {
        create: {
          dischargeDate: new Date(now.getTime() - 90 * 60 * 1000),
          dischargeTime: '14:20',
          disposition: 'Transferred to Inpatient Ward',
          destinationWard: 'Ward 14 (Trauma Orthopedic)',
          dischargeNotes: 'Figure-of-eight bandage applied. Neurovascular exam intact. Transferred for elective internal fixation under Dr. Senarathne.',
          medicationReconciliation: true,
          recordedBy: 'Dr. Maithree Perera',
          bedTurnoverInitiated: true,
        },
      },
    },
  ];

  for (const dp of dischargedPatients) {
    const created = await prisma.patientRecord.create({ data: dp });
    await prisma.patientFlowEvent.create({
      data: {
        patientRecordId: created.id,
        patientId: dp.patientId,
        patientName: dp.fullName,
        eventType: 'DISCHARGE',
        ward: dp.hospitalArea,
        fromStatus: 'Under Treatment',
        toStatus: 'Discharged',
        durationMinutes: 300,
        timestamp: new Date(now.getTime() - 60 * 60 * 1000),
      },
    });
  }
  console.log(`Created ${dischargedPatients.length} discharged records.`);

  // 5. Seed Equipment
  await prisma.equipment.deleteMany({});
  const equipmentData = [
    { equipmentCode: 'VENT-01', equipmentType: 'Mechanical Ventilator', status: 'IN_USE', location: 'ETU Bay 1 (Resus)' },
    { equipmentCode: 'VENT-02', equipmentType: 'Mechanical Ventilator', status: 'AVAILABLE', location: 'ETU Bay 2 (Resus)' },
    { equipmentCode: 'VENT-03', equipmentType: 'Mechanical Ventilator', status: 'AVAILABLE', location: 'ETU Bay 3 (Resus)' },
    { equipmentCode: 'DEFIB-01', equipmentType: 'Defibrillator', status: 'AVAILABLE', location: 'Crash Cart A - Resus' },
    { equipmentCode: 'DEFIB-02', equipmentType: 'Defibrillator', status: 'AVAILABLE', location: 'Crash Cart B - Accident Ward' },
    { equipmentCode: 'PUMP-01', equipmentType: 'Infusion Pump', status: 'IN_USE', location: 'ETU Bay 1' },
    { equipmentCode: 'PUMP-02', equipmentType: 'Infusion Pump', status: 'IN_USE', location: 'ETU Bay 6' },
  ];
  for (const eq of equipmentData) {
    await prisma.equipment.create({ data: eq });
  }

  // 6. Seed Operational Alerts
  await prisma.operationalAlert.deleteMany({});
  await prisma.operationalAlert.createMany({
    data: [
      {
        severity: 'WARNING',
        component: 'Bed Capacity',
        message: 'Resus suite occupancy reached 83% (5/6 acute beds occupied). Step-down protocol recommended.',
        isResolved: false,
      },
      {
        severity: 'INFO',
        component: 'Telemetry Sync',
        message: 'Digital Twin SimPy engine synchronized with 40-bed telemetry grid (250ms latency).',
        isResolved: false,
      },
      {
        severity: 'CRITICAL',
        component: 'Surge Warning',
        message: 'Kelani River high-water advisory: Colombo emergency catchment on Stage 2 surge readiness.',
        isResolved: false,
      },
    ],
  });

  // 7. Seed AI Recommendations
  await prisma.recommendation.deleteMany({});
  await prisma.recommendation.createMany({
    data: [
      {
        recommendationCode: 'REC-2027-0104',
        category: 'Bed Reallocation',
        action: 'Reallocate 2 Observation beds from Yellow Zone to Critical Amber Zone',
        rationale: 'XGBoost 6h horizon forecasts +4.8 Cat 2 arrivals while Amber zone is currently at 90% capacity.',
        impactScore: 8.7,
        status: 'PENDING',
      },
      {
        recommendationCode: 'REC-2027-0105',
        category: 'Staff Shift Balancing',
        action: 'Deploy 1 additional Senior Triage Nurse to Accident Ward Intake',
        rationale: 'Current intake queue time is 18.4 mins against the 15 min clinical safety standard.',
        impactScore: 7.9,
        status: 'APPROVED',
        reviewedBy: 'Dr. Elena Vance, MD',
        reviewedAt: new Date(now.getTime() - 30 * 60 * 1000),
      },
    ],
  });

  // 8. Seed Dataset Imports History
  await prisma.datasetImport.deleteMany({});
  await prisma.datasetImport.createMany({
    data: [
      {
        filename: 'etu_arrivals_2026_q3.csv',
        datasetType: 'arrivals',
        recordCount: 1420,
        validCount: 1418,
        invalidCount: 2,
        provenance: 'REAL_APPROVED',
        status: 'COMPLETED',
        importedBy: 'Dr. Maithree Perera',
      },
      {
        filename: 'colombo_surge_kelani_flood_scenario.csv',
        datasetType: 'disaster_incidents',
        recordCount: 85,
        validCount: 85,
        invalidCount: 0,
        provenance: 'SYNTHETIC',
        status: 'COMPLETED',
        importedBy: 'Eng. Kasun Jayawardena',
      },
    ],
  });

  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

