// Complete end-to-end test suite to verify full functionality against running Next.js server

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Homepage
    console.log('\n--- 1. Testing Homepage ---');
    const homeRes = await fetch(`${baseUrl}/`);
    assert(homeRes.status === 200, 'GET / returned 200 OK');
    const homeHtml = await homeRes.text();
    assert(homeHtml.includes('ETU Intelligence') || homeHtml.includes('National Hospital of Sri Lanka'), 'Homepage contains NHSL/ETU branding');

    // 2. Doctor Login
    console.log('\n--- 2. Testing Doctor Authentication ---');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrStaffId: 'stf-4029@hospital.org', password: 'doctor123' })
    });
    assert(loginRes.status === 200, 'POST /api/auth/login returned 200 OK');
    const loginData = await loginRes.json();
    assert(loginData.success === true && loginData.user?.role === 'DOCTOR', 'Doctor login returned role DOCTOR');
    
    // Extract session cookie
    const setCookieHeader = loginRes.headers.get('set-cookie');
    assert(!!setCookieHeader, 'Session cookie received');
    const cookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';

    // 3. Current User verification
    console.log('\n--- 3. Testing /api/auth/me session verification ---');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: cookie }
    });
    assert(meRes.status === 200, 'GET /api/auth/me returned 200 OK');
    const meData = await meRes.json();
    assert(meData.user?.email === 'stf-4029@hospital.org', 'Session correctly verified for stf-4029');

    // 4. Patients API - List & Metrics
    console.log('\n--- 4. Testing Patients API (List & live telemetry) ---');
    const patientsRes = await fetch(`${baseUrl}/api/patients`, {
      headers: { Cookie: cookie }
    });
    assert(patientsRes.status === 200, 'GET /api/patients returned 200 OK');
    const patientsData = await patientsRes.json();
    assert(Array.isArray(patientsData.patients) && patientsData.patients.length > 0, `Retrieved ${patientsData.patients.length} patients from database`);
    assert(patientsData.metrics && typeof patientsData.metrics.activeInUnit === 'number', 'Summary metrics returned');

    // 5. Patient Registration
    console.log('\n--- 5. Testing Patient Registration (Arrival & Record Creation) ---');
    const newPatientPayload = {
      fullName: 'Kamal Jayawardena',
      age: 48,
      gender: 'MALE',
      contactNumber: '+94 77 123 4567',
      category: 'Cat 1 - Critical Resus',
      presentingComplaint: 'Acute chest pain radiating to left arm, diaphoretic',
      hospitalArea: 'ETU Complex',
      assignedBed: 'ETU-BED-01',
      notes: 'BP 85/50, HR 128, SpO2 91%. Immediate ECG performed: Anterior STEMI.'
    };
    const createPatientRes = await fetch(`${baseUrl}/api/patients`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: cookie 
      },
      body: JSON.stringify(newPatientPayload)
    });
    assert(createPatientRes.status === 200 || createPatientRes.status === 201, 'POST /api/patients created patient');
    const createdData = await createPatientRes.json();
    const createdId = createdData.patient?.id;
    const generatedDisplayId = createdData.patient?.patientId;
    assert(generatedDisplayId && generatedDisplayId.startsWith('PT-2026-'), `Generated unique ID: ${generatedDisplayId}`);
    assert(createdData.patient?.fullName === 'Kamal Jayawardena', 'Patient name verified in persistent record');

    // 6. Patient Details & Single Fetch
    console.log('\n--- 6. Testing Patient Details Retrieval ---');
    const singlePatientRes = await fetch(`${baseUrl}/api/patients/${createdId}`, {
      headers: { Cookie: cookie }
    });
    assert(singlePatientRes.status === 200, `GET /api/patients/${createdId} returned 200 OK`);
    const singleData = await singlePatientRes.json();
    assert(singleData.patient?.id === createdId, 'Fetched correct patient details');
    assert(singleData.patient?.flowEvents?.length > 0, 'Patient flow audit trail event logged automatically');

    // 7. Patient Discharge Workflow
    console.log('\n--- 7. Testing Patient Discharge Management ---');
    const dischargePayload = {
      patientId: createdId,
      disposition: 'Transferred to Inpatient Ward',
      destinationWard: 'Cardiology Intensive Care Unit (CICU - Ward 4)',
      dischargeNotes: 'Emergency PCI stenting completed successfully. Hemodynamically stabilized on low-dose norepinephrine.',
      medicationReconciliation: true,
      bedTurnoverInitiated: true
    };
    const dischargeRes = await fetch(`${baseUrl}/api/discharge`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: cookie 
      },
      body: JSON.stringify(dischargePayload)
    });
    assert(dischargeRes.status === 200 || dischargeRes.status === 201, 'POST /api/discharge returned success');
    const dischargeData = await dischargeRes.json();
    assert(dischargeData.patient?.status === 'Discharged', 'Patient status updated to Discharged in database');

    // 8. Discharge Queue / History Retrieval
    console.log('\n--- 8. Testing Discharge Queue & History ---');
    const dischargeListRes = await fetch(`${baseUrl}/api/discharge?mode=history`, {
      headers: { Cookie: cookie }
    });
    assert(dischargeListRes.status === 200, 'GET /api/discharge?mode=history returned 200 OK');
    const dischargeListData = await dischargeListRes.json();
    assert(Array.isArray(dischargeListData.discharges), 'Discharge history list returned');
    assert(dischargeListData.discharges.some(d => d.patientRecordId === createdId), 'Discharged patient present in audit history');

    // 9. Analytics & Dashboard Telemetry
    console.log('\n--- 9. Testing Hospital Analytics & Dwell Time Aggregation ---');
    const analyticsRes = await fetch(`${baseUrl}/api/analytics`, {
      headers: { Cookie: cookie }
    });
    assert(analyticsRes.status === 200, 'GET /api/analytics returned 200 OK');
    const analyticsData = await analyticsRes.json();
    assert(typeof analyticsData.headlineMetrics?.recordedInflow === 'number', 'recordedInflow metric verified');
    assert(typeof analyticsData.headlineMetrics?.totalDischarges === 'number', 'totalDischarges metric verified');
    assert(Array.isArray(analyticsData.chartData) && analyticsData.chartData.length === 7, '7-day flow chartData series verified');

    // 10. AI Recommendations review gate (HITL)
    console.log('\n--- 10. Testing AI Recommendations Human-In-The-Loop Review ---');
    const recsRes = await fetch(`${baseUrl}/api/recommendations`, {
      headers: { Cookie: cookie }
    });
    assert(recsRes.status === 200, 'GET /api/recommendations returned 200 OK');
    const recsData = await recsRes.json();
    assert(Array.isArray(recsData.recommendations) && recsData.recommendations.length > 0, 'AI recommendations loaded');
    const firstRec = recsData.recommendations[0];
    
    // Doctor approves recommendation
    const approveRes = await fetch(`${baseUrl}/api/recommendations`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: cookie 
      },
      body: JSON.stringify({
        id: firstRec.id,
        decision: 'APPROVED',
        overrideNotes: 'Approved clinical transfer order during morning surge'
      })
    });
    assert(approveRes.status === 200, 'PUT /api/recommendations approved recommendation');
    const approvedData = await approveRes.json();
    assert(approvedData.recommendation?.status === 'APPROVED', 'Recommendation status persisted as APPROVED');

    // 11. CSV Dataset Ingestion
    console.log('\n--- 11. Testing CSV Dataset Ingestion API ---');
    const importPayload = {
      filename: 'nhsl_etu_historical_march2026.csv',
      datasetType: 'arrivals',
      rows: [
        { arrival_datetime: '2026-03-31T08:00:00Z', triage_category: 'Cat 2 - Trauma', arrival_mode: '1990 Ambulance' },
        { arrival_datetime: '2026-03-31T08:15:00Z', triage_category: 'Cat 3 - Urgent', arrival_mode: 'Walk-in' },
        { arrival_datetime: '2026-03-31T08:30:00Z', triage_category: 'Cat 1 - Critical Resus', arrival_mode: 'Inter-hospital Transfer' }
      ]
    };

    const importRes = await fetch(`${baseUrl}/api/datasets/import`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: cookie 
      },
      body: JSON.stringify(importPayload)
    });
    assert(importRes.status === 200 || importRes.status === 201, 'POST /api/datasets/import returned success');
    const importData = await importRes.json();
    assert(importData.importRecord?.recordCount === 3, `Imported ${importData.importRecord?.recordCount} records`);
    assert(importData.importRecord?.status === 'COMPLETED', 'CSV import marked COMPLETED with Historical CSV provenance');

    // 12. Role-Based Access Control (RBAC) security check
    console.log('\n--- 12. Testing RBAC Security Protections ---');
    // Normal Doctor tries to access Admin user list -> Must be 403 Forbidden
    const doctorAdminRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Cookie: cookie }
    });
    assert(doctorAdminRes.status === 403, 'Normal Doctor blocked from /api/admin/users with 403 Forbidden');

    // Login as System Administrator
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrStaffId: 'sysadmin@hospital.org', password: 'admin123' })
    });
    assert(adminLoginRes.status === 200, 'System Administrator login successful');
    const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';
    
    // System Admin access to Admin user list -> Must be 200 OK
    const adminUsersRes = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Cookie: adminCookie }
    });
    assert(adminUsersRes.status === 200, 'System Administrator allowed access to /api/admin/users with 200 OK');
    const adminUsersData = await adminUsersRes.json();
    assert(Array.isArray(adminUsersData.users) && adminUsersData.users.length >= 6, `Admin fetched ${adminUsersData.users?.length} system users`);

    // System Admin audit logs inspection
    const auditLogsRes = await fetch(`${baseUrl}/api/admin/audit-logs`, {
      headers: { Cookie: adminCookie }
    });
    assert(auditLogsRes.status === 200, 'System Administrator accessed /api/admin/audit-logs with 200 OK');
    const auditData = await auditLogsRes.json();
    assert(Array.isArray(auditData.logs) && auditData.logs.length > 0, `Verified regulatory audit logs (${auditData.logs.length} logged events)`);

    // 13. Password Reset Request
    console.log('\n--- 13. Testing Password Reset Request API ---');
    const forgotRes = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nurse@hospital.org' })
    });
    assert(forgotRes.status === 200, 'POST /api/auth/forgot-password returned 200 OK');
    const forgotData = await forgotRes.json();
    assert(forgotData.success === true, 'Password reset instructions successfully registered');

    // 14. Google OAuth Endpoint Check
    console.log('\n--- 14. Testing Google OAuth Initiation & Error Handling ---');
    const googleRes = await fetch(`${baseUrl}/api/auth/google`, { redirect: 'manual' });
    const googleLocation = googleRes.headers.get('location') || '';
    assert(googleRes.status === 307 || googleRes.status === 302, 'Google OAuth initiation route responds with redirect');
    console.log(`Google OAuth redirect target: ${googleLocation}`);

    // Summary
    console.log(`\n========================================`);
    console.log(`E2E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during E2E verification:', err);
    process.exit(1);
  }
}

runTests();
