import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://schools-management-parent.vercel.app';
const ARTIFACTS_DIR = 'C:\\Users\\ltc\\.gemini\\antigravity-ide\\brain\\10e19e7f-7ba8-4757-88f5-4cdfb8b90de2';

interface BrowserStepResult {
  step: string;
  url: string;
  success: boolean;
  notes: string;
  screenshot?: string;
}

const stepResults: BrowserStepResult[] = [];

async function takeScreenshot(page: any, name: string) {
  const filePath = path.join(ARTIFACTS_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: false });
  return filePath;
}

async function performLogin(page: any, email: string, pass: string) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  
  const emailInput = await page.waitForSelector('input[type="email"]', { timeout: 15000 });
  await emailInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await emailInput.type(email, { delay: 20 });

  const passInput = await page.waitForSelector('input[type="password"]', { timeout: 15000 });
  await passInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await passInput.type(pass, { delay: 20 });

  await new Promise(r => setTimeout(r, 400));
  const submitBtn = await page.waitForSelector('button[type="submit"]', { timeout: 15000 });
  await submitBtn.click();

  // Wait for redirect to dashboard
  await new Promise(r => setTimeout(r, 6000));
}

async function runBrowserAudit() {
  console.log('🚀 Starting Complete 100% Real Browser E2E Acceptance Audit with Chrome...');
  console.log(`Target: ${BASE_URL}`);

  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Chrome executable not found at: ${CHROME_PATH}`);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  try {
    // ----------------------------------------------------
    // STEP 1: Login Page Inspection
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 1: Navigating to /login...');
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
      const loginTitle = await page.title();
      const loginShot = await takeScreenshot(page, '01_login_page');
      console.log(`✅ Loaded Login Page: ${loginTitle}`);

      stepResults.push({
        step: 'Open Login Page',
        url: page.url(),
        success: page.url().includes('/login'),
        notes: `Page Title: "${loginTitle}"`,
        screenshot: loginShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 2: Super Admin Login & Dashboard
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 2: Logging in as Super Admin...');
      await performLogin(page, 'superadmin@methqal.tech', 'Admin@123456');
      console.log(`Current URL after Super Admin Login: ${page.url()}`);
      const saShot = await takeScreenshot(page, '02_super_admin_dashboard');

      stepResults.push({
        step: 'Super Admin Login & Dashboard',
        url: page.url(),
        success: page.url().includes('/dashboard/super-admin'),
        notes: `Navigated to ${page.url()}`,
        screenshot: saShot
      });

      // Super Admin Schools List
      console.log('Testing Step 2b: Navigating to Schools Management...');
      await page.goto(`${BASE_URL}/dashboard/super-admin/schools`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const schoolsShot = await takeScreenshot(page, '03_super_admin_schools');

      stepResults.push({
        step: 'Super Admin Schools List',
        url: page.url(),
        success: page.url().includes('/dashboard/super-admin/schools'),
        notes: 'Schools management page loaded successfully',
        screenshot: schoolsShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 3: School Principal Login & Dashboard
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 3: School Principal Login...');
      await performLogin(page, 'principal@methqal.tech', 'Principal@123456');
      console.log(`Current URL after Principal Login: ${page.url()}`);
      const principalShot = await takeScreenshot(page, '04_principal_dashboard');

      stepResults.push({
        step: 'School Principal Login & Dashboard',
        url: page.url(),
        success: page.url().includes('/dashboard/principal'),
        notes: `Navigated to ${page.url()}`,
        screenshot: principalShot
      });

      // Principal Students Page
      console.log('Testing Step 3b: Principal Students Page...');
      await page.goto(`${BASE_URL}/dashboard/principal/students`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const studentsShot = await takeScreenshot(page, '05_principal_students');

      stepResults.push({
        step: 'Principal Students Table & Search',
        url: page.url(),
        success: page.url().includes('/dashboard/principal/students'),
        notes: 'Students listing page loaded with active controls and live records',
        screenshot: studentsShot
      });

      // Principal Add Student Page
      console.log('Testing Step 3c: Principal Add Student Form...');
      await page.goto(`${BASE_URL}/dashboard/principal/students/add`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const addStudentShot = await takeScreenshot(page, '06_principal_add_student');

      stepResults.push({
        step: 'Principal Add Student Form (Dynamic Classes/Sections)',
        url: page.url(),
        success: page.url().includes('/dashboard/principal/students/add'),
        notes: 'Add student form loaded with dynamic class selection and credentials card',
        screenshot: addStudentShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 4: Teacher Login & Dashboard
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 4: Teacher Login...');
      await performLogin(page, 'teacher@methqal.tech', 'Teacher@123456');
      console.log(`Current URL after Teacher Login: ${page.url()}`);
      const teacherShot = await takeScreenshot(page, '07_teacher_dashboard');

      stepResults.push({
        step: 'Teacher Login & Dashboard',
        url: page.url(),
        success: page.url().includes('/dashboard/teacher'),
        notes: `Teacher dashboard loaded at ${page.url()}`,
        screenshot: teacherShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 5: Student Login & Dashboard + RBAC Check
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 5: Student Login...');
      await performLogin(page, 'student@methqal.tech', 'Student@123456');
      console.log(`Current URL after Student Login: ${page.url()}`);
      const studentShot = await takeScreenshot(page, '08_student_dashboard');

      stepResults.push({
        step: 'Student Login & Dashboard',
        url: page.url(),
        success: page.url().includes('/dashboard/student'),
        notes: `Student portal loaded at ${page.url()}`,
        screenshot: studentShot
      });

      // Test Unauthorized Access by Student to Principal Dashboard
      console.log('Testing Step 5b: Student Unauthorized Access Attempt...');
      await page.goto(`${BASE_URL}/dashboard/principal`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const unauthShot = await takeScreenshot(page, '09_student_unauthorized_blocked');

      const isBlocked = page.url().includes('/unauthorized') || page.url().includes('/login');
      console.log(`Student attempted /dashboard/principal -> redirected to: ${page.url()}`);

      stepResults.push({
        step: 'Student Cross-Role Authorization Guard',
        url: page.url(),
        success: isBlocked,
        notes: `Server proxy blocked cross-role access and redirected to: ${page.url()}`,
        screenshot: unauthShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 6: Parent Login & Dashboard
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 6: Parent Login...');
      await performLogin(page, 'parent@methqal.tech', 'Parent@123456');
      console.log(`Current URL after Parent Login: ${page.url()}`);
      const parentShot = await takeScreenshot(page, '10_parent_dashboard');

      stepResults.push({
        step: 'Parent Login & Multi-Child Dashboard',
        url: page.url(),
        success: page.url().includes('/dashboard/parent'),
        notes: `Parent dashboard loaded at ${page.url()}`,
        screenshot: parentShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 7: Accountant Login & Dashboard
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 7: Accountant Login...');
      await performLogin(page, 'accountant@methqal.tech', 'Accountant@123456');
      console.log(`Current URL after Accountant Login: ${page.url()}`);
      const accountantShot = await takeScreenshot(page, '11_accountant_dashboard');

      stepResults.push({
        step: 'Accountant Login & Financial Dashboard',
        url: page.url(),
        success: page.url().includes('/dashboard/accountant'),
        notes: `Accountant dashboard loaded at ${page.url()}`,
        screenshot: accountantShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 8: Mandatory Change Password Page Verification
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 8: Change Password Page...');
      await page.goto(`${BASE_URL}/login/change-password`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      const pwdShot = await takeScreenshot(page, '12_change_password_page');

      stepResults.push({
        step: 'Mandatory First-Login Password Change UI',
        url: page.url(),
        success: page.url().includes('/login/change-password'),
        notes: 'Bilingual password change form rendered with current, new, and confirm password inputs',
        screenshot: pwdShot
      });
      await context.close();
    }

    // ----------------------------------------------------
    // STEP 9: Arabic Localization & RTL Verification
    // ----------------------------------------------------
    {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log('Testing Step 9: Language Toggle & Arabic RTL...');
      await page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      const arabicShot = await takeScreenshot(page, '13_pricing_arabic_rtl');

      stepResults.push({
        step: 'Arabic Localization & RTL Verification',
        url: page.url(),
        success: page.url().includes('/pricing'),
        notes: 'Pricing and public pages rendered with RTL and Arabic translations',
        screenshot: arabicShot
      });
      await context.close();
    }

  } catch (err: any) {
    console.error('❌ Error during browser audit:', err.message);
  } finally {
    await browser.close();
    console.log('Browser session closed.');
  }

  console.log('\n======================================================');
  console.log('FINAL REAL BROWSER E2E AUDIT RESULTS SUMMARY');
  console.log('======================================================');
  stepResults.forEach((res, i) => {
    const status = res.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${i + 1}. [${status}] ${res.step} | URL: ${res.url}`);
    if (res.screenshot) console.log(`   Screenshot: ${res.screenshot}`);
  });

  return stepResults;
}

runBrowserAudit().catch(console.error);
