import 'dotenv/config';

async function wait(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {
    const BASE = 'https://schools-management-parent.vercel.app';
    console.log('====================================================');
    console.log('METHQAL TECH — LIVE PRODUCTION WORKFLOW & DB AUDIT');
    console.log('Target URL:', BASE);
    console.log('====================================================\n');

    console.log('⏳ Waiting for Vercel deployment of commit eee83e9 to finalize...');
    let activeDeploymentHost = '';
    let dbStatus: any = null;

    for (let attempt = 1; attempt <= 20; attempt++) {
        try {
            const res = await fetch(`${BASE}/api/system/db-status`, { cache: 'no-store' });
            if (res.ok) {
                dbStatus = await res.json();
                console.log(`[Attempt ${attempt}] Turso Host: ${dbStatus.tursoHost} | Column Audit: ${dbStatus.columnAudit ? (dbStatus.columnAudit.allModelsMatch ? '✅ ALL MODELS MATCH' : `⚠️ ${dbStatus.columnAudit.totalMissingColumns} MISSING COLS`) : 'N/A'}`);
                if (dbStatus.columnAudit && dbStatus.columnAudit.allModelsMatch) {
                    activeDeploymentHost = dbStatus.tursoHost;
                    console.log('🎉 Confirmed: Live deployment is active with 100% matched Turso schema!\n');
                    break;
                }
            }
        } catch (e: any) {
            console.log(`[Attempt ${attempt}] Ping error: ${e.message}`);
        }
        await wait(6000);
    }

    if (!dbStatus || !dbStatus.columnAudit?.allModelsMatch) {
        console.error('❌ Error: Could not verify full schema match on live Turso database within timeout.');
        console.log('Last dbStatus:', JSON.stringify(dbStatus, null, 2));
        process.exit(1);
    }

    // Print Column Audit Details
    console.log('----------------------------------------------------');
    console.log('1. TURSO CLOUD COLUMN-LEVEL SCHEMA STATUS:');
    console.log('----------------------------------------------------');
    console.log(`- Turso Host: ${activeDeploymentHost}`);
    console.log(`- Total Database Tables: ${dbStatus.columnAudit.totalTables}`);
    console.log(`- Models Verified: ${dbStatus.columnAudit.modelsChecked}`);
    console.log(`- Total Missing Columns: ${dbStatus.columnAudit.totalMissingColumns}`);
    console.log(`- Parent Table: Status=${dbStatus.columnAudit.tables?.Parent?.status}, ActualCols=${dbStatus.columnAudit.tables?.Parent?.actualCount}`);
    console.log(`- students Table: Status=${dbStatus.columnAudit.tables?.students?.status}, ActualCols=${dbStatus.columnAudit.tables?.students?.actualCount}`);
    console.log(`- Exam Table: Status=${dbStatus.columnAudit.tables?.Exam?.status}, ActualCols=${dbStatus.columnAudit.tables?.Exam?.actualCount}`);
    console.log(`- Fee Table: Status=${dbStatus.columnAudit.tables?.Fee?.status}, ActualCols=${dbStatus.columnAudit.tables?.Fee?.actualCount}`);
    console.log(`- Payment Table: Status=${dbStatus.columnAudit.tables?.Payment?.status}, ActualCols=${dbStatus.columnAudit.tables?.Payment?.actualCount}`);
    console.log('----------------------------------------------------\n');

    // TEST B: School Admin / Principal -> Add Student & Create/Link Parent (The exact reported error!)
    console.log('----------------------------------------------------');
    console.log('2. TESTING STUDENT & PARENT CREATION WORKFLOW (BUG FIX)');
    console.log('----------------------------------------------------');

    // Login as Principal
    console.log('Logging in as Principal (principal@methqal.tech)...');
    const princLoginRes = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'principal@methqal.tech', password: 'Principal@123456' })
    });
    console.log('Principal Login Status:', princLoginRes.status);
    const princCookies = princLoginRes.headers.getSetCookie();
    const princCookieHeader = princCookies.map(c => c.split(';')[0]).join('; ');

    const uniqueReg = `REG-${Date.now().toString().slice(-5)}`;
    const studentEmail = `student.${uniqueReg.toLowerCase()}@methqal-cloud.test`;
    const parentEmail = `parent.${uniqueReg.toLowerCase()}@methqal-cloud.test`;
    console.log(`Registering new student: ${uniqueReg} (Father: Ahmed Al-Yemeni, Parent Email: ${parentEmail})...`);

    // Call student registration via Server Action or API
    // We can simulate addStudent call using Next.js action or direct API test
    // Let's create a test runner endpoint or call the student creation
    console.log('Submitting Add Student payload...');
    const addStudentPayload = {
        registrationNo: uniqueReg,
        firstName: 'سامي',
        lastName: 'أحمد اليمني',
        dateOfBirth: '2010-05-15',
        gender: 'Male',
        bloodGroup: 'O+',
        religion: 'Muslim',
        currentClass: 'Class 10 - A',
        section: 'أ',
        rollNo: 42,
        session: '2026-2027',
        fatherName: 'أحمد علي اليمني',
        motherName: 'فاطمة صالح',
        guardianPhone: '+967771998877',
        emergencyContact: '+967771998877',
        email: studentEmail,
        password: 'Student@1234',
        parentEmail: parentEmail,
        parentPassword: 'Parent@1234',
        presentAddress: 'صنعاء، شارع حدة',
        permanentAddress: 'صنعاء، شارع حدة'
    };

    // To test the exact server action in production, we can invoke through Next Server Action request
    // or inspect through a small test route. Let's create an automated test endpoint /api/test-workflows/route.ts
    // or check direct database state!
}

run().catch(console.error);
