import fs from 'fs';
import path from 'path';

console.log('--- Starting Parent Suite Localization ---');

// 1. parent/about/page.tsx
const aboutPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/about/page.tsx');
if (fs.existsSync(aboutPath)) {
  let c = fs.readFileSync(aboutPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import React from 'react';",
      "import React from 'react';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'export default function AboutWebsite() {',
      'export default function AboutWebsite() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>\s*Next-Generation <br\/>\s*<span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-indigo-500">\s*School Management\s*<\/span>\s*<\/h1>/g,
    '>{isAr ? "الجيل القادم من " : "Next-Generation "}<br/><span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-indigo-500">{isAr ? "إدارة المدارس الذكية" : "School Management"}</span></h1>'
  );
  c = c.replace(/Our platform is designed to bridge the gap between education and technology\. We bring transparency, efficiency, and intelligence to daily school operations, empowering the entire academic community\./g,
    "{isAr ? 'منصتنا مصممة للربط بين التعليم والتقنية الحديثة. نوفر الشفافية والكفاءة والذكاء للعمليات المدرسية اليومية لتمكين المجتمع التعليمي بأكمله.' : 'Our platform is designed to bridge the gap between education and technology. We bring transparency, efficiency, and intelligence to daily school operations, empowering the entire academic community.'}"
  );
  fs.writeFileSync(aboutPath, c, 'utf8');
  console.log('Localized parent/about/page.tsx');
}

// 2. parent/attendance/page.tsx
const parAttPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/attendance/page.tsx');
if (fs.existsSync(parAttPath)) {
  let c = fs.readFileSync(parAttPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getParentAttendanceData } from "@/app/actions/parent/attendance";',
      'import { getParentAttendanceData } from "@/app/actions/parent/attendance";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function AttendancePage() {',
      'export default function AttendancePage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Attendance Report<\/h1>/g, '>{isAr ? "تقرير الحضور والغياب" : "Attendance Report"}</h1>');
  c = c.replace(/>View detailed daily attendance record of your child<\/p>/g, '>{isAr ? "عرض سجل الحضور اليومي المفصل لأبنائك" : "View detailed daily attendance record of your child"}</p>');
  c = c.replace(/{ label: 'Total Recorded'/g, '{ label: isAr ? "إجمالي الأيام المسجلة" : "Total Recorded"');
  c = c.replace(/{ label: 'Present'/g, '{ label: isAr ? "حاضر" : "Present"');
  c = c.replace(/{ label: 'Absent'/g, '{ label: isAr ? "غائب" : "Absent"');
  c = c.replace(/{ label: 'Avg\. Rate'/g, '{ label: isAr ? "متوسط الحضور" : "Avg. Rate"');
  c = c.replace(/>\s*Daily Logs\s*<\/h3>/g, '>{isAr ? "السجلات اليومية" : "Daily Logs"}</h3>');
  c = c.replace(/>Date<\/th>/g, '>{isAr ? "التاريخ" : "Date"}</th>');
  c = c.replace(/>Status<\/th>/g, '>{isAr ? "الحالة" : "Status"}</th>');
  c = c.replace(/>Remarks<\/th>/g, '>{isAr ? "الملاحظات" : "Remarks"}</th>');
  c = c.replace(/>\s*\{log\.status\}\s*<\/span>/g, '>{isAr ? (log.status === "Present" ? "حاضر" : log.status === "Absent" ? "غائب" : "متأخر") : log.status}</span>');
  fs.writeFileSync(parAttPath, c, 'utf8');
  console.log('Localized parent/attendance/page.tsx');
}

// 3. parent/benefits/page.tsx
const benPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/benefits/page.tsx');
if (fs.existsSync(benPath)) {
  let c = fs.readFileSync(benPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import React from 'react';",
      "import React from 'react';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'export default function WebsiteBenefits() {',
      'export default function WebsiteBenefits() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Why Choose Our Portal\?<\/h1>/g, '>{isAr ? "لماذا تختار بوابتنا التعليمية؟" : "Why Choose Our Portal?"}</h1>');
  c = c.replace(/>Discover how our unified digital platform transforms your academic engagement\.<\/p>/g,
    '{isAr ? "اكتشف كيف تحول منصتنا الرقمية الموحدة تجربة متابعتك الأكاديمية لأبنائك." : "Discover how our unified digital platform transforms your academic engagement."}</p>'
  );
  fs.writeFileSync(benPath, c, 'utf8');
  console.log('Localized parent/benefits/page.tsx');
}

// 4. parent/communication/page.tsx
const commPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/communication/page.tsx');
if (fs.existsSync(commPath)) {
  let c = fs.readFileSync(commPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getCommunicationData, sendMessage } from "@/app/actions/parent/communication";',
      'import { getCommunicationData, sendMessage } from "@/app/actions/parent/communication";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function ContactTeacherPage() {',
      'export default function ContactTeacherPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Direct Communication<\/h1>/g, '>{isAr ? "التواصل المباشر" : "Direct Communication"}</h1>');
  c = c.replace(/>Connect directly with instructors and academic mentors\.<\/p>/g,
    '{isAr ? "تواصل مباشرة مع معلمي أبنائك والمرشدين الأكاديميين." : "Connect directly with instructors and academic mentors."}</p>'
  );
  c = c.replace(/>Select Faculty Member<\/h3>/g, '>{isAr ? "اختر المعلم" : "Select Faculty Member"}</h3>');
  c = c.replace(/>Write Message<\/h3>/g, '>{isAr ? "كتابة الرسالة" : "Write Message"}</h3>');
  c = c.replace(/placeholder="Type your message or inquiry here\.\.\."/g, 'placeholder={isAr ? "اكتب رسالتك أو استفسارك هنا..." : "Type your message or inquiry here..."}');
  c = c.replace(/>Send Message<\/button>/g, '>{isAr ? "إرسال الرسالة" : "Send Message"}</button>');
  fs.writeFileSync(commPath, c, 'utf8');
  console.log('Localized parent/communication/page.tsx');
}

// 5. parent/notices/page.tsx
const parNotPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/notices/page.tsx');
if (fs.existsSync(parNotPath)) {
  let c = fs.readFileSync(parNotPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getParentNoticesData } from "@/app/actions/parent/notices";',
      'import { getParentNoticesData } from "@/app/actions/parent/notices";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function NoticesPage() {',
      'export default function NoticesPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>School Announcements<\/h1>/g, '>{isAr ? "إعلانات المدرسة" : "School Announcements"}</h1>');
  c = c.replace(/>Stay informed with latest circulars and academic alerts<\/p>/g,
    '{isAr ? "ابقَ على اطلاع بأحدث التعميمات والتنبيهات الأكاديمية" : "Stay informed with latest circulars and academic alerts"}</p>'
  );
  c = c.replace(/placeholder="Search notices\.\.\."/g, 'placeholder={isAr ? "البحث في الإعلانات..." : "Search notices..."}');
  c = c.replace(/>All Announcements<\/button>/g, '>{isAr ? "جميع الإعلانات" : "All Announcements"}</button>');
  c = c.replace(/>Academic<\/button>/g, '>{isAr ? "أكاديمي" : "Academic"}</button>');
  c = c.replace(/>Important<\/button>/g, '>{isAr ? "هام" : "Important"}</button>');
  c = c.replace(/No notices found\./g, "{isAr ? 'لا توجد إعلانات حالياً.' : 'No notices found.'}");
  fs.writeFileSync(parNotPath, c, 'utf8');
  console.log('Localized parent/notices/page.tsx');
}

// 6. parent/profile/page.tsx
const parProfPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/profile/page.tsx');
if (fs.existsSync(parProfPath)) {
  let c = fs.readFileSync(parProfPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { getParentProfileData } from '@/app/actions/parent/profile';",
      "import { getParentProfileData } from '@/app/actions/parent/profile';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'export default function ParentProfile() {',
      'export default function ParentProfile() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Parent Profile<\/h1>/g, '>{isAr ? "ملف ولي الأمر" : "Parent Profile"}</h1>');
  c = c.replace(/>View your guardian account details<\/p>/g, '>{isAr ? "عرض تفاصيل حساب ولي الأمر" : "View your guardian account details"}</p>');
  c = c.replace(/>Account Settings<\/Link>/g, '>{isAr ? "إعدادات الحساب" : "Account Settings"}</Link>');
  c = c.replace(/>Guardian Information<\/h3>/g, '>{isAr ? "بيانات ولي الأمر" : "Guardian Information"}</h3>');
  c = c.replace(/>Enrolled Children<\/h3>/g, '>{isAr ? "الأبناء المسجلون" : "Enrolled Children"}</h3>');
  c = c.replace(/>Full Name<\/label>/g, '>{isAr ? "الاسم الكامل" : "Full Name"}</label>');
  c = c.replace(/>Email Address<\/label>/g, '>{isAr ? "البريد الإلكتروني" : "Email Address"}</label>');
  c = c.replace(/>Phone Number<\/label>/g, '>{isAr ? "رقم الهاتف" : "Phone Number"}</label>');
  fs.writeFileSync(parProfPath, c, 'utf8');
  console.log('Localized parent/profile/page.tsx');
}

// 7. parent/reports/page.tsx
const parRepPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/reports/page.tsx');
if (fs.existsSync(parRepPath)) {
  let c = fs.readFileSync(parRepPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import Swal from 'sweetalert2';",
      "import Swal from 'sweetalert2';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'export default function ReportsPage() {',
      'export default function ReportsPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Academic Reports<\/h1>/g, '>{isAr ? "التقارير الأكاديمية" : "Academic Reports"}</h1>');
  c = c.replace(/>Official term report cards and gradebooks<\/p>/g,
    '{isAr ? "كشوف درجات الفصول الرسمية وتقارير الأداء" : "Official term report cards and gradebooks"}</p>'
  );
  c = c.replace(/>Available Reports<\/h3>/g, '>{isAr ? "التقارير المتاحة" : "Available Reports"}</h3>');
  c = c.replace(/>Report Name<\/th>/g, '>{isAr ? "اسم التقرير" : "Report Name"}</th>');
  c = c.replace(/>Type<\/th>/g, '>{isAr ? "النوع" : "Type"}</th>');
  c = c.replace(/>Date<\/th>/g, '>{isAr ? "التاريخ" : "Date"}</th>');
  c = c.replace(/>Download<\/span>/g, '>{isAr ? "تحميل" : "Download"}</span>');
  fs.writeFileSync(parRepPath, c, 'utf8');
  console.log('Localized parent/reports/page.tsx');
}

// 8. parent/results/page.tsx
const parResPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/results/page.tsx');
if (fs.existsSync(parResPath)) {
  let c = fs.readFileSync(parResPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { getParentResultsData } from '@/app/actions/parent/results';",
      "import { getParentResultsData } from '@/app/actions/parent/results';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'export default function ResultsPage() {',
      'export default function ResultsPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Academic Results<\/h1>/g, '>{isAr ? "النتائج الأكاديمية" : "Academic Results"}</h1>');
  c = c.replace(/>Comprehensive term performance and scorecard<\/p>/g,
    '{isAr ? "سجل درجات وأداء الطلاب الشامل للفصول الدراسية" : "Comprehensive term performance and scorecard"}</p>'
  );
  c = c.replace(/placeholder="Search student or subject\.\.\."/g, 'placeholder={isAr ? "البحث عن طالب أو مادة..." : "Search student or subject..."}');
  c = c.replace(/>Print Report<\/button>/g, '>{isAr ? "طباعة التقرير" : "Print Report"}</button>');
  c = c.replace(/>Subject<\/th>/g, '>{isAr ? "المادة" : "Subject"}</th>');
  c = c.replace(/>Score<\/th>/g, '>{isAr ? "الدرجة" : "Score"}</th>');
  c = c.replace(/>Grade<\/th>/g, '>{isAr ? "التقدير" : "Grade"}</th>');
  c = c.replace(/>Status<\/th>/g, '>{isAr ? "الحالة" : "Status"}</th>');
  fs.writeFileSync(parResPath, c, 'utf8');
  console.log('Localized parent/results/page.tsx');
}

// 9. parent/settings/page.tsx
const parSetPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/parent/settings/page.tsx');
if (fs.existsSync(parSetPath)) {
  let c = fs.readFileSync(parSetPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import Swal from 'sweetalert2';",
      "import Swal from 'sweetalert2';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'export default function SettingsPage() {',
      'export default function SettingsPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Account Settings<\/h1>/g, '>{isAr ? "إعدادات الحساب" : "Account Settings"}</h1>');
  c = c.replace(/>Manage your guardian profile and contact info<\/p>/g,
    '{isAr ? "إدارة ملف ولي الأمر ومعلومات الاتصال الخاصة بك" : "Manage your guardian profile and contact info"}</p>'
  );
  c = c.replace(/>Profile Information<\/h3>/g, '>{isAr ? "معلومات الملف الشخصي" : "Profile Information"}</h3>');
  c = c.replace(/>Full Name<\/label>/g, '>{isAr ? "الاسم الكامل" : "Full Name"}</label>');
  c = c.replace(/>Phone Number<\/label>/g, '>{isAr ? "رقم الهاتف" : "Phone Number"}</label>');
  c = c.replace(/>Save Changes<\/button>/g, '>{isAr ? "حفظ التغييرات" : "Save Changes"}</button>');
  fs.writeFileSync(parSetPath, c, 'utf8');
  console.log('Localized parent/settings/page.tsx');
}

console.log('--- Parent Suite Localization Completed ---');
