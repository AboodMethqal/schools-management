import fs from 'fs';
import path from 'path';

// 1. Attendance Page
const attPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/attendance/page.tsx');
if (fs.existsSync(attPath)) {
  let c = fs.readFileSync(attPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace('import { CalendarCheck, AlertTriangle } from "lucide-react";', 'import { CalendarCheck, AlertTriangle } from "lucide-react";\nimport { useLanguage } from "@/context/LanguageProvider";');
    c = c.replace('export default function AttendancePage() {', 'export default function AttendancePage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";');
  }
  c = c.replace(/Overall Attendance/g, "{isAr ? 'نسبة الحضور العامة' : 'Overall Attendance'}");
  c = c.replace(/Current month average/g, "{isAr ? 'متوسط الشهر الحالي' : 'Current month average'}");
  c = c.replace(/Chronic Absence/g, "{isAr ? 'الغياب المتكرر' : 'Chronic Absence'}");
  c = c.replace(/Students below 75% attendance/g, "{isAr ? 'الطلاب الأقل من 75% حضوراً' : 'Students below 75% attendance'}");
  c = c.replace(/Attendance by Class/g, "{isAr ? 'الحضور حسب الفصل' : 'Attendance by Class'}");
  c = c.replace(/Current term average \(%\)/g, "{isAr ? 'متوسط الفصل الحالي (%)' : 'Current term average (%)'}");
  c = c.replace(/Monthly Attendance Trend/g, "{isAr ? 'مسار الحضور الشهري' : 'Monthly Attendance Trend'}");
  c = c.replace(/School-wide average over time/g, "{isAr ? 'متوسط المدرسة عبر الأشهر' : 'School-wide average over time'}");
  fs.writeFileSync(attPath, c, 'utf8');
  console.log('Updated principal/attendance/page.tsx');
}

// 2. Finance Page
const finPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/finance/page.tsx');
if (fs.existsSync(finPath)) {
  let c = fs.readFileSync(finPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace('import { DollarSign, Clock, AlertTriangle } from "lucide-react";', 'import { DollarSign, Clock, AlertTriangle } from "lucide-react";\nimport { useLanguage } from "@/context/LanguageProvider";');
    c = c.replace('export default function FinancePage() {', 'export default function FinancePage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";\n  const cur = (val: string) => isAr ? val.replace("₹", "ر.ي ") : val.replace("₹", "$");');
  }
  c = c.replace(/>\{item\.title\}<\/p>/g, ">{isAr ? (item.title === 'Collected' ? 'المحصلة' : item.title === 'Pending' ? 'المعلقة' : 'المتأخرة') : item.title}</p>");
  c = c.replace(/<h2 className="text-3xl font-bold mt-1">\{item\.value\}<\/h2>/g, '<h2 className="text-3xl font-bold mt-1">{cur(item.value)}</h2>');
  c = c.replace(/74% of target/g, "{isAr ? '74% من الهدف' : '74% of target'}");
  c = c.replace(/18% — due within 15 days/g, "{isAr ? '18% — مستحقة خلال 15 يوماً' : '18% — due within 15 days'}");
  c = c.replace(/8% — requires follow-up/g, "{isAr ? '8% — تتطلب متابعة عاجلة' : '8% — requires follow-up'}");
  c = c.replace(/Fee Collection Distribution/g, "{isAr ? 'توزيع تحصيل الرسوم' : 'Fee Collection Distribution'}");
  c = c.replace(/Current month breakdown/g, "{isAr ? 'تفاصيل الشهر الحالي' : 'Current month breakdown'}");
  c = c.replace(/Revenue vs Target/g, "{isAr ? 'الإيرادات مقابل المستهدف' : 'Revenue vs Target'}");
  c = c.replace(/Monthly comparison \(₹ Lakhs\)/g, "{isAr ? 'مقارنة شهرية' : 'Monthly comparison ($)'}");
  c = c.replace(/>\{item\.name\}<\/span>/g, ">{isAr ? (item.name === 'Collected' ? 'المحصلة' : item.name === 'Pending' ? 'المعلقة' : 'المتأخرة') : item.name}</span>");
  fs.writeFileSync(finPath, c, 'utf8');
  console.log('Updated principal/finance/page.tsx');
}

// 3. Performance Page
const perfPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/performance/page.tsx');
if (fs.existsSync(perfPath)) {
  let c = fs.readFileSync(perfPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace("import {", "import { useLanguage } from '@/context/LanguageProvider';\nimport {");
    c = c.replace("export default function SchoolPerformancePage() {", "export default function SchoolPerformancePage() {\n  const { language } = useLanguage();\n  const isAr = language === 'ar';");
  }
  c = c.replace(/School Performance<\/h1>/g, "{isAr ? 'أداء المدرسة' : 'School Performance'}</h1>");
  c = c.replace(/Academic progress & attendance insights<\/p>/g, "{isAr ? 'رؤى التحصيل الأكاديمي والحضور' : 'Academic progress & attendance insights'}</p>");
  c = c.replace(/Overall Result<\/h3>/g, "{isAr ? 'النتيجة الإجمالية' : 'Overall Result'}</h3>");
  c = c.replace(/Based on last 6 months<\/p>/g, "{isAr ? 'بناءً على آخر 6 أشهر' : 'Based on last 6 months'}</p>");
  c = c.replace(/Average Attendance<\/h3>/g, "{isAr ? 'متوسط الحضور' : 'Average Attendance'}</h3>");
  c = c.replace(/Stable trend<\/p>/g, "{isAr ? 'مستوى مستقر' : 'Stable trend'}</p>");
  c = c.replace(/Top Performing Class<\/h3>/g, "{isAr ? 'أعلى الفصول أداءً' : 'Top Performing Class'}</h3>");
  c = c.replace(/Highest attendance & result<\/p>/g, "{isAr ? 'الأعلى حضوراً ودرجات' : 'Highest attendance & result'}</p>");
  c = c.replace(/Academic Performance Trend<\/h3>/g, "{isAr ? 'مسار الأداء الأكاديمي' : 'Academic Performance Trend'}</h3>");
  c = c.replace(/Class-wise Attendance<\/h3>/g, "{isAr ? 'الحضور حسب الفصل' : 'Class-wise Attendance'}</h3>");
  c = c.replace(/>Improving<\/span>/g, ">{isAr ? 'في تحسن مستمر' : 'Improving'}</span>");
  c = c.replace(/>Positive Trend<\/span>/g, ">{isAr ? 'مؤشر إيجابي' : 'Positive Trend'}</span>");
  c = c.replace(/>Growth<\/span>/g, ">{isAr ? 'نمو' : 'Growth'}</span>");
  c = c.replace(/>Needs Attention<\/span>/g, ">{isAr ? 'يحتاج إلى متابعة' : 'Needs Attention'}</span>");
  c = c.replace(/>Action Required<\/span>/g, ">{isAr ? 'إجراء مطلوب' : 'Action Required'}</span>");
  c = c.replace(/>Risk<\/span>/g, ">{isAr ? 'تراجع' : 'Risk'}</span>");
  fs.writeFileSync(perfPath, c, 'utf8');
  console.log('Updated principal/performance/page.tsx');
}

// 4. Reports Page
const repPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/reports/page.tsx');
if (fs.existsSync(repPath)) {
  let c = fs.readFileSync(repPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace('import { FileText, Eye, CheckCircle, Download } from "lucide-react";', 'import { FileText, Eye, CheckCircle, Download } from "lucide-react";\nimport { useLanguage } from "@/context/LanguageProvider";');
    c = c.replace('export default function ReportsPage() {', 'export default function ReportsPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";');
  }
  c = c.replace(/>\{item\.title\}<\/p>/g, ">{isAr ? (item.title === 'Total Reports' ? 'إجمالي التقارير' : item.title === 'Pending Review' ? 'قيد المراجعة' : 'التقارير المعتمدة') : item.title}</p>");
  c = c.replace(/This academic year/g, "{isAr ? 'خلال هذا العام الأكاديمي' : 'This academic year'}");
  c = c.replace(/Awaiting your approval/g, "{isAr ? 'في انتظار موافقتك' : 'Awaiting your approval'}");
  c = c.replace(/Published & archived/g, "{isAr ? 'منشورة ومؤرشفة' : 'Published & archived'}");
  c = c.replace(/All Reports<\/h3>/g, "{isAr ? 'كافة التقارير' : 'All Reports'}</h3>");
  c = c.replace(/>Report Name<\/th>/g, ">{isAr ? 'اسم التقرير' : 'Report Name'}</th>");
  c = c.replace(/>Type<\/th>/g, ">{isAr ? 'النوع' : 'Type'}</th>");
  c = c.replace(/>Date<\/th>/g, ">{isAr ? 'التاريخ' : 'Date'}</th>");
  c = c.replace(/>Status<\/th>/g, ">{isAr ? 'الحالة' : 'Status'}</th>");
  c = c.replace(/>Actions<\/th>/g, ">{isAr ? 'الإجراءات' : 'Actions'}</th>");
  c = c.replace(/>View<\/span>/g, ">{isAr ? 'عرض' : 'View'}</span>");
  c = c.replace(/>Download<\/span>/g, ">{isAr ? 'تحميل' : 'Download'}</span>");
  c = c.replace(/>\{report\.status\}<\/span>/g, ">{isAr ? (report.status === 'Approved' ? 'معتمد' : 'معلق') : report.status}</span>");
  c = c.replace(/>\{report\.type\}<\/td>/g, ">{isAr ? (report.type === 'Academic' ? 'أكاديمي' : report.type === 'Attendance' ? 'حضور' : 'مالي') : report.type}</td>");
  fs.writeFileSync(repPath, c, 'utf8');
  console.log('Updated principal/reports/page.tsx');
}

// 5. Settings Page
const setPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/settings/page.tsx');
if (fs.existsSync(setPath)) {
  let c = fs.readFileSync(setPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace('import Swal from "sweetalert2";', 'import Swal from "sweetalert2";\nimport { useLanguage } from "@/context/LanguageProvider";');
    c = c.replace('export default function SettingsPage() {', 'export default function SettingsPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";');
  }
  c = c.replace(/My Profile Information/g, "{isAr ? 'بيانات الملف الشخصي' : 'My Profile Information'}");
  c = c.replace(/label="Full Name"/g, 'label={isAr ? "الاسم الكامل" : "Full Name"}');
  c = c.replace(/label="Email"/g, 'label={isAr ? "البريد الإلكتروني" : "Email"}');
  c = c.replace(/label="Role"/g, 'label={isAr ? "الدور" : "Role"}');
  c = c.replace(/Update Profile/g, "{isAr ? 'تحديث الملف الشخصي' : 'Update Profile'}");
  c = c.replace(/"Updating\.\.\."/g, 'isAr ? "جارٍ التحديث..." : "Updating..."');
  fs.writeFileSync(setPath, c, 'utf8');
  console.log('Updated principal/settings/page.tsx');
}

// 6. Announcements Page
const annPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/announcements/page.tsx');
if (fs.existsSync(annPath)) {
  let c = fs.readFileSync(annPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace('import { getAnnouncements } from "@/app/actions/announcement";', 'import { getAnnouncements } from "@/app/actions/announcement";\nimport { useLanguage } from "@/context/LanguageProvider";');
    c = c.replace('export default function AnnouncementsPage() {', 'export default function AnnouncementsPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";');
  }
  c = c.replace(/Announcement Board<\/h2>/g, "{isAr ? 'لوحة الإعلانات المدرسية' : 'Announcement Board'}</h2>");
  c = c.replace(/\{publishedCount\} published · \{draftCount\} drafts/g, "{isAr ? `${publishedCount} منشور · ${draftCount} مسودة` : `${publishedCount} published · ${draftCount} drafts`}");
  c = c.replace(/New Announcement/g, "{isAr ? 'إعلان جديد' : 'New Announcement'}");
  c = c.replace(/placeholder="Search notices\.\.\."/g, 'placeholder={isAr ? "بحث في الإعلانات..." : "Search notices..."}');
  c = c.replace(/>All Audience<\/option>/g, ">{isAr ? 'كافة الجمهور' : 'All Audience'}</option>");
  c = c.replace(/>Students Only<\/option>/g, ">{isAr ? 'الطلاب فقط' : 'Students Only'}</option>");
  c = c.replace(/>Teachers Only<\/option>/g, ">{isAr ? 'المعلمون فقط' : 'Teachers Only'}</option>");
  c = c.replace(/>Parents Only<\/option>/g, ">{isAr ? 'أولياء الأمور فقط' : 'Parents Only'}</option>");
  c = c.replace(/No announcements found/g, "{isAr ? 'لم يتم العثور على إعلانات' : 'No announcements found'}");
  fs.writeFileSync(annPath, c, 'utf8');
  console.log('Updated principal/announcements/page.tsx');
}
