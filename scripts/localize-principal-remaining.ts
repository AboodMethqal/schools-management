import fs from 'fs';
import path from 'path';

// 1. super-admin/maintenance/page.tsx
const maintPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/maintenance/page.tsx');
if (fs.existsSync(maintPath)) {
  const content = `"use client";
import { useLanguage } from "@/context/LanguageProvider";

export default function Maintenance() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold">{isAr ? 'الصيانة والنظام' : 'System Maintenance'}</h1>
    </div>
  );
}
`;
  fs.writeFileSync(maintPath, content, 'utf8');
  console.log('Updated super-admin/maintenance/page.tsx');
}

// 2. principal/announcements/new/page.tsx
const annNewPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/announcements/new/page.tsx');
if (fs.existsSync(annNewPath)) {
  let c = fs.readFileSync(annNewPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { getCurrentSchoolId } from '@/app/actions/user'",
      "import { getCurrentSchoolId } from '@/app/actions/user'\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      "export default function NewAnnouncement() {",
      "export default function NewAnnouncement() {\n  const { language } = useLanguage();\n  const isAr = language === 'ar';"
    );
  }
  c = c.replace(/Create New Announcement/g, "{isAr ? 'إنشاء إعلان جديد' : 'Create New Announcement'}");
  c = c.replace(/Broadcast notices to your institution\./g, "{isAr ? 'بث الإعلانات والتعميمات لمؤسستك التعليمية.' : 'Broadcast notices to your institution.'}");
  c = c.replace(/Notice Title/g, "{isAr ? 'عنوان الإعلان' : 'Notice Title'}");
  c = c.replace(/placeholder="e\.g\. Winter Vacation Notice"/g, 'placeholder={isAr ? "مثال: إشعار العطلة الشتوية" : "e.g. Winter Vacation Notice"}');
  c = c.replace(/Details \/ Description/g, "{isAr ? 'التفاصيل / الوصف' : 'Details / Description'}");
  c = c.replace(/placeholder="Write your notice details here\.\.\."/g, 'placeholder={isAr ? "اكتب تفاصيل الإعلان هنا..." : "Write your notice details here..."}');
  c = c.replace(/Target Audience/g, "{isAr ? 'الفئة المستهدفة' : 'Target Audience'}");
  c = c.replace(/>Everyone \(All\)<\/option>/g, ">{isAr ? 'الجميع (الكل)' : 'Everyone (All)'}</option>");
  c = c.replace(/>Students Only<\/option>/g, ">{isAr ? 'الطلاب فقط' : 'Students Only'}</option>");
  c = c.replace(/>Teachers Only<\/option>/g, ">{isAr ? 'المعلمون فقط' : 'Teachers Only'}</option>");
  c = c.replace(/>Office Staff<\/option>/g, ">{isAr ? 'طاقم الإدارة' : 'Office Staff'}</option>");
  c = c.replace(/Specific Class/g, "{isAr ? 'فصل محدد' : 'Specific Class'}");
  c = c.replace(/>All Classes<\/option>/g, ">{isAr ? 'جميع الفصول' : 'All Classes'}</option>");
  c = c.replace(/>Class 1<\/option>/g, ">{isAr ? 'الصف الأول' : 'Class 1'}</option>");
  c = c.replace(/>Class 2<\/option>/g, ">{isAr ? 'الصف الثاني' : 'Class 2'}</option>");
  c = c.replace(/>Class 10<\/option>/g, ">{isAr ? 'الصف العاشر' : 'Class 10'}</option>");
  c = c.replace(/Notice Category/g, "{isAr ? 'تصنيف الإعلان' : 'Notice Category'}");
  c = c.replace(/>Academic<\/option>/g, ">{isAr ? 'أكاديمي' : 'Academic'}</option>");
  c = c.replace(/>Holiday \/ Vacation<\/option>/g, ">{isAr ? 'عطلة / إجازة' : 'Holiday / Vacation'}</option>");
  c = c.replace(/>Exam Schedule<\/option>/g, ">{isAr ? 'جدول الاختبارات' : 'Exam Schedule'}</option>");
  c = c.replace(/>Event \/ Sports<\/option>/g, ">{isAr ? 'فعالية / أنشطة' : 'Event / Sports'}</option>");
  c = c.replace(/>Emergency Notice<\/option>/g, ">{isAr ? 'إشعار طارئ' : 'Emergency Notice'}</option>");
  c = c.replace(/Priority Level/g, "{isAr ? 'مستوى الأهمية' : 'Priority Level'}");
  c = c.replace(/>Normal<\/option>/g, ">{isAr ? 'عادي' : 'Normal'}</option>");
  c = c.replace(/>High Priority<\/option>/g, ">{isAr ? 'أولوية عالية' : 'High Priority'}</option>");
  c = c.replace(/>Urgent \(Immediate\)<\/option>/g, ">{isAr ? 'عاجل (فوري)' : 'Urgent (Immediate)'}</option>");
  c = c.replace(/Visible Until \(Expiry\)/g, "{isAr ? 'متاح حتى (تاريخ الانتهاء)' : 'Visible Until (Expiry)'}");
  c = c.replace(/\{loading \? "Publishing\.\.\." : <><Send size=\{20\} \/> Broadcast Announcement<\/>\}/g,
    '{loading ? (isAr ? "جارٍ النشر..." : "Publishing...") : <><Send size={20} /> {isAr ? "نشر الإعلان" : "Broadcast Announcement"}</>}'
  );
  fs.writeFileSync(annNewPath, c, 'utf8');
  console.log('Updated principal/announcements/new/page.tsx');
}

// 3. principal/addsupport/page.tsx
const suppPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/addsupport/page.tsx');
if (fs.existsSync(suppPath)) {
  let c = fs.readFileSync(suppPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import Swal from 'sweetalert2';",
      "import Swal from 'sweetalert2';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      "export default function SupportDashboard() {",
      "export default function SupportDashboard() {\n  const { language } = useLanguage();\n  const isAr = language === 'ar';"
    );
  }
  // Bengali text cleanup & localization
  c = c.replace(/Support <span className="text-primary">Center<\/span>/g,
    "{isAr ? 'مركز ' : 'Support '}<span className=\"text-primary\">{isAr ? 'الدعم الفني' : 'Center'}</span>"
  );
  c = c.replace(/আমাদের টিম আপনার সমস্যার সমাধانه প্রস্তুত। নিচে নতুন টিকেট তৈরি করুন।/g,
    "{isAr ? 'فريق الدعم جاهز لمساعدتك وحل مشكلاتك. يمكنك إنشاء تذكرة دعم جديدة أدناه.' : 'Our support team is ready to resolve your issues. Create a new support ticket below.'}"
  );
  c = c.replace(/Create Ticket/g, "{isAr ? 'إنشاء تذكرة' : 'Create Ticket'}");
  c = c.replace(/label: 'Total Tickets'/g, "label: isAr ? 'إجمالي التذاكر' : 'Total Tickets'");
  c = c.replace(/label: 'Pending'/g, "label: isAr ? 'قيد الانتظار' : 'Pending'");
  c = c.replace(/label: 'Resolved'/g, "label: isAr ? 'تم الحل' : 'Resolved'");
  c = c.replace(/label: 'Last Activity'/g, "label: isAr ? 'آخر نشاط' : 'Last Activity'");
  c = c.replace(/value: 'Today'/g, "value: isAr ? 'اليوم' : 'Today'");
  c = c.replace(/>\s*Subject & Info\s*<\/th>/g, ">{isAr ? 'الموضوع والمعلومات' : 'Subject & Info'}</th>");
  c = c.replace(/>\s*Priority\s*<\/th>/g, ">{isAr ? 'الأولوية' : 'Priority'}</th>");
  c = c.replace(/>\s*Status\s*<\/th>/g, ">{isAr ? 'الحالة' : 'Status'}</th>");
  c = c.replace(/>\s*Actions\s*<\/th>/g, ">{isAr ? 'الإجراءات' : 'Actions'}</th>");
  c = c.replace(/No tickets found\./g, "{isAr ? 'لا توجد تذاكر دعم حالياً.' : 'No tickets found.'}");
  c = c.replace(/New Support Ticket/g, "{isAr ? 'تذكرة دعم فني جديدة' : 'New Support Ticket'}");
  c = c.replace(/Issue Subject/g, "{isAr ? 'عنوان المشكلة' : 'Issue Subject'}");
  c = c.replace(/Priority<\/label>/g, "{isAr ? 'درجة الأولوية' : 'Priority'}</label>");
  c = c.replace(/Description<\/label>/g, "{isAr ? 'تفاصيل المشكلة' : 'Description'}</label>");
  c = c.replace(/Screenshot<\/label>/g, "{isAr ? 'لقطة شاشة (اختياري)' : 'Screenshot'}</label>");
  c = c.replace(/>Low<\/option>/g, ">{isAr ? 'منخفضة' : 'Low'}</option>");
  c = c.replace(/>Medium<\/option>/g, ">{isAr ? 'متوسطة' : 'Medium'}</option>");
  c = c.replace(/>High<\/option>/g, ">{isAr ? 'عالية' : 'High'}</option>");
  c = c.replace(/Submit Ticket/g, "{isAr ? 'إرسال التذكرة' : 'Submit Ticket'}");
  // Status badges in table
  c = c.replace(/>\{ticket\.priority\}<\/span>/g, ">{isAr ? (ticket.priority === 'high' ? 'عالية' : ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة') : ticket.priority}</span>");
  c = c.replace(/>\{ticket\.status\}<\/span>/g, ">{isAr ? (ticket.status === 'open' ? 'قيد المعالجة' : 'مكتملة') : ticket.status}</span>");
  fs.writeFileSync(suppPath, c, 'utf8');
  console.log('Updated principal/addsupport/page.tsx');
}

// 4. principal/students/StudentForm.tsx
const stuFormPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/students/StudentForm.tsx');
if (fs.existsSync(stuFormPath)) {
  let c = fs.readFileSync(stuFormPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { addStudent, getStudent, updateStudent, deleteStudent } from "@/app/actions/student";',
      'import { addStudent, getStudent, updateStudent, deleteStudent } from "@/app/actions/student";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function StudentForm() {',
      'export default function StudentForm() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/SYNCING STUDENT DATA\.\.\./g, "{isAr ? 'جارٍ مزامنة بيانات الطالب...' : 'SYNCING STUDENT DATA...'}");
  c = c.replace(/Success!<\/h2>/g, "{isAr ? 'تم بنجاح!' : 'Success!'}</h2>");
  c = c.replace(/Database Updated Successfully/g, "{isAr ? 'تم تحديث قاعدة البيانات بنجاح' : 'Database Updated Successfully'}");
  c = c.replace(/\{isEdit \? "Update Student" : "New Enrollment"\}/g, '{isEdit ? (isAr ? "تحديث بيانات الطالب" : "Update Student") : (isAr ? "تسجيل طالب جديد" : "New Enrollment")}');
  c = c.replace(/Session 2024-25 • Admission Management/g, "{isAr ? 'العام الدراسي 2024-25 • إدارة القبول والتسجيل' : 'Session 2024-25 • Admission Management'}");
  c = c.replace(/<ChevronLeft className="me-2" size=\{14\} \/> Back/g, '<ChevronLeft className="me-2" size={14} /> {isAr ? "رجوع" : "Back"}');
  c = c.replace(/<UserPlus className="me-2" size=\{14\} \/> Add Bulk Students/g, '<UserPlus className="me-2" size={14} /> {isAr ? "إضافة طلاب مجمعة" : "Add Bulk Students"}');
  c = c.replace(/Login Credentials<\/h3>/g, "{isAr ? 'بيانات تسجيل الدخول' : 'Login Credentials'}</h3>");
  c = c.replace(/Email Address \*/g, "{isAr ? 'البريد الإلكتروني *' : 'Email Address *'}");
  c = c.replace(/Login Password \*/g, "{isAr ? 'كلمة المرور *' : 'Login Password *'}");
  c = c.replace(/placeholder=\{isEdit \? "••••••••" : "Default: Student@1234"\}/g, 'placeholder={isEdit ? "••••••••" : (isAr ? "الافتراضي: Student@1234" : "Default: Student@1234")}');
  c = c.replace(/Personal Profile<\/h3>/g, "{isAr ? 'الملف الشخصي' : 'Personal Profile'}</h3>");
  c = c.replace(/>Reg No \*<\/label>/g, ">{isAr ? 'رقم القيد *' : 'Reg No *'}</label>");
  c = c.replace(/>First Name \*<\/label>/g, ">{isAr ? 'الاسم الأول *' : 'First Name *'}</label>");
  c = c.replace(/>Last Name \*<\/label>/g, ">{isAr ? 'اسم العائلة *' : 'Last Name *'}</label>");
  c = c.replace(/>Date of Birth \*<\/label>/g, ">{isAr ? 'تاريخ الميلاد *' : 'Date of Birth *'}</label>");
  c = c.replace(/>Gender \*<\/label>/g, ">{isAr ? 'الجنس *' : 'Gender *'}</label>");
  c = c.replace(/>Select<\/option>/g, ">{isAr ? 'اختر' : 'Select'}</option>");
  c = c.replace(/>Male<\/option>/g, ">{isAr ? 'ذكر' : 'Male'}</option>");
  c = c.replace(/>Female<\/option>/g, ">{isAr ? 'أنثى' : 'Female'}</option>");
  c = c.replace(/>Blood Group<\/label>/g, ">{isAr ? 'فصيلة الدم' : 'Blood Group'}</label>");
  c = c.replace(/Academic Info<\/h4>/g, "{isAr ? 'المعلومات الأكاديمية' : 'Academic Info'}</h4>");
  c = c.replace(/>Select Class \*<\/option>/g, ">{isAr ? 'اختر الفصل *' : 'Select Class *'}</option>");
  c = c.replace(/value=\{`Class \$\{i \+ 1\}`\}>Class \{i \+ 1\}<\/option>/g, 'value={`Class ${i + 1}`}>{isAr ? `الصف ${i + 1}` : `Class ${i + 1}`}</option>');
  c = c.replace(/placeholder="Section \*"/g, 'placeholder={isAr ? "الشعبة *" : "Section *"}');
  c = c.replace(/placeholder="Roll \*"/g, 'placeholder={isAr ? "رقم الجلوس *" : "Roll *"}');
  c = c.replace(/placeholder="Session \*"/g, 'placeholder={isAr ? "العام الدراسي *" : "Session *"}');
  c = c.replace(/Family Info<\/h4>/g, "{isAr ? 'بيانات ولي الأمر' : 'Family Info'}</h4>");
  c = c.replace(/placeholder="Father's Name \*"/g, 'placeholder={isAr ? "اسم الأب *" : "Father\'s Name *"}');
  c = c.replace(/placeholder="Mother's Name \*"/g, 'placeholder={isAr ? "اسم الأم *" : "Mother\'s Name *"}');
  c = c.replace(/placeholder="Guardian Phone \*"/g, 'placeholder={isAr ? "هاتف ولي الأمر *" : "Guardian Phone *"}');
  c = c.replace(/Parent Account \(Optional\)/g, "{isAr ? 'حساب ولي الأمر (اختياري)' : 'Parent Account (Optional)'}");
  c = c.replace(/placeholder="Parent Email \(pa\.regno@school\.site\)"/g, 'placeholder={isAr ? "بريد ولي الأمر (pa.regno@school.site)" : "Parent Email (pa.regno@school.site)"}');
  c = c.replace(/placeholder="Parent Password \(Def: Parent@1234\)"/g, 'placeholder={isAr ? "كلمة مرور ولي الأمر (الافتراضي: Parent@1234)" : "Parent Password (Def: Parent@1234)"}');
  c = c.replace(/Address<\/h3>/g, "{isAr ? 'العنوان' : 'Address'}</h3>");
  c = c.replace(/placeholder="Student's Residential Address \*"/g, 'placeholder={isAr ? "عنوان سكن الطالب *" : "Student\'s Residential Address *"}');
  c = c.replace(/\{isSubmitting \? "Syncing\.\.\." : isEdit \? "Update Record" : "Finalize Registration"\}/g,
    '{isSubmitting ? (isAr ? "جارٍ المزامنة..." : "Syncing...") : isEdit ? (isAr ? "تحديث السجل" : "Update Record") : (isAr ? "إتمام التسجيل" : "Finalize Registration")}'
  );
  c = c.replace(/Delete Student/g, "{isAr ? 'حذف الطالب' : 'Delete Student'}");
  c = c.replace(/Email used here will be the student's username for logging into the portal\./g,
    "{isAr ? 'سيكون البريد الإلكتروني المسجل هنا هو اسم المستخدم للطالب لتسجيل الدخول إلى البوابة.' : \"Email used here will be the student's username for logging into the portal.\"}"
  );
  fs.writeFileSync(stuFormPath, c, 'utf8');
  console.log('Updated principal/students/StudentForm.tsx');
}

// 5. principal/teachers/TeacherForm.tsx
const teaFormPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/teachers/TeacherForm.tsx');
if (fs.existsSync(teaFormPath)) {
  let c = fs.readFileSync(teaFormPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { addTeacher, getTeacher, updateTeacher, deleteTeacher } from "@/app/actions/teacher";',
      'import { addTeacher, getTeacher, updateTeacher, deleteTeacher } from "@/app/actions/teacher";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function TeacherForm() {',
      'export default function TeacherForm() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/LOADING TEACHER RECORD\.\.\./g, "{isAr ? 'جارٍ تحميل بيانات المعلم...' : 'LOADING TEACHER RECORD...'}");
  c = c.replace(/Teacher Profile Synchronized/g, "{isAr ? 'تمت مزامنة ملف المعلم بنجاح' : 'Teacher Profile Synchronized'}");
  c = c.replace(/Success!<\/h2>/g, "{isAr ? 'تم بنجاح!' : 'Success!'}</h2>");
  c = c.replace(/\{isEdit \? "Update Faculty Member" : "Register New Faculty"\}/g,
    '{isEdit ? (isAr ? "تحديث بيانات المعلم" : "Update Faculty Member") : (isAr ? "تسجيل معلم جديد" : "Register New Faculty")}'
  );
  c = c.replace(/Faculty Directory • Professional Profile System/g, "{isAr ? 'دليل المعلمين • نظام الملف المهني' : 'Faculty Directory • Professional Profile System'}");
  c = c.replace(/<ChevronLeft className="me-2" size=\{14\} \/> Back/g, '<ChevronLeft className="me-2" size={14} /> {isAr ? "رجوع" : "Back"}');
  c = c.replace(/Portal Credentials<\/h3>/g, "{isAr ? 'بيانات الدخول للبوابة' : 'Portal Credentials'}</h3>");
  c = c.replace(/Professional Email Address \*/g, "{isAr ? 'البريد الإلكتروني المهني *' : 'Professional Email Address *'}");
  c = c.replace(/System Access Password \*/g, "{isAr ? 'كلمة مرور النظام *' : 'System Access Password *'}");
  c = c.replace(/Personal Details<\/h3>/g, "{isAr ? 'البيانات الشخصية' : 'Personal Details'}</h3>");
  c = c.replace(/>First Name \*<\/label>/g, ">{isAr ? 'الاسم الأول *' : 'First Name *'}</label>");
  c = c.replace(/>Last Name \*<\/label>/g, ">{isAr ? 'اسم العائلة *' : 'Last Name *'}</label>");
  c = c.replace(/>Phone Number \*<\/label>/g, ">{isAr ? 'رقم الهاتف *' : 'Phone Number *'}</label>");
  c = c.replace(/>Date of Birth<\/label>/g, ">{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</label>");
  c = c.replace(/>Gender \*<\/label>/g, ">{isAr ? 'الجنس *' : 'Gender *'}</label>");
  c = c.replace(/>Select<\/option>/g, ">{isAr ? 'اختر' : 'Select'}</option>");
  c = c.replace(/>Male<\/option>/g, ">{isAr ? 'ذكر' : 'Male'}</option>");
  c = c.replace(/>Female<\/option>/g, ">{isAr ? 'أنثى' : 'Female'}</option>");
  c = c.replace(/>Blood Group<\/label>/g, ">{isAr ? 'فصيلة الدم' : 'Blood Group'}</label>");
  c = c.replace(/Academic & Department Info<\/h3>/g, "{isAr ? 'المعلومات الأكاديمية والقسم' : 'Academic & Department Info'}</h3>");
  c = c.replace(/>Designation \*<\/label>/g, ">{isAr ? 'المسمى الوظيفي *' : 'Designation *'}</label>");
  c = c.replace(/>Department \*<\/label>/g, ">{isAr ? 'القسم / المادة *' : 'Department *'}</label>");
  c = c.replace(/>Qualification \*<\/label>/g, ">{isAr ? 'المؤهل العلمي *' : 'Qualification *'}</label>");
  c = c.replace(/Residential Address<\/h3>/g, "{isAr ? 'عنوان الإقامة' : 'Residential Address'}</h3>");
  c = c.replace(/Delete Faculty Member/g, "{isAr ? 'حذف المعلم' : 'Delete Faculty Member'}");
  c = c.replace(/\{isSubmitting \? "Saving\.\.\." : isEdit \? "Update Faculty Profile" : "Register Faculty"\}/g,
    '{isSubmitting ? (isAr ? "جارٍ الحفظ..." : "Saving...") : isEdit ? (isAr ? "تحديث ملف المعلم" : "Update Faculty Profile") : (isAr ? "تسجيل المعلم" : "Register Faculty")}'
  );
  fs.writeFileSync(teaFormPath, c, 'utf8');
  console.log('Updated principal/teachers/TeacherForm.tsx');
}

// 6. principal/students/bulk-add/page.tsx
const bulkPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/principal/students/bulk-add/page.tsx');
if (fs.existsSync(bulkPath)) {
  let c = fs.readFileSync(bulkPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { addMultipleStudents } from "@/app/actions/student";',
      'import { addMultipleStudents } from "@/app/actions/student";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function BulkAddStudentPage() {',
      'export default function BulkAddStudentPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/Bulk Student Import<\/h1>/g, "{isAr ? 'استيراد الطلاب المجمّع' : 'Bulk Student Import'}</h1>");
  c = c.replace(/Upload CSV or PDF to register multiple students at once/g, "{isAr ? 'رفع ملف CSV أو PDF لتسجيل عدة طلاب في خطوة واحدة' : 'Upload CSV or PDF to register multiple students at once'}");
  c = c.replace(/Download CSV Template/g, "{isAr ? 'تحميل نموذج CSV' : 'Download CSV Template'}");
  c = c.replace(/Upload CSV File<\/h3>/g, "{isAr ? 'رفع ملف CSV' : 'Upload CSV File'}</h3>");
  c = c.replace(/Click to upload or drag and drop/g, "{isAr ? 'انقر للرفع أو اسحب الملف وأفلته هنا' : 'Click to upload or drag and drop'}");
  c = c.replace(/CSV files only/g, "{isAr ? 'ملفات CSV فقط' : 'CSV files only'}");
  c = c.replace(/Upload PDF Document<\/h3>/g, "{isAr ? 'رفع مستند PDF' : 'Upload PDF Document'}</h3>");
  c = c.replace(/PDF files only/g, "{isAr ? 'ملفات PDF فقط' : 'PDF files only'}");
  c = c.replace(/Import All Students/g, "{isAr ? 'استيراد جميع الطلاب' : 'Import All Students'}");
  c = c.replace(/Importing\.\.\./g, "{isAr ? 'جارٍ الاستيراد...' : 'Importing...'}");
  c = c.replace(/Back to Students/g, "{isAr ? 'العودة إلى قائمة الطلاب' : 'Back to Students'}");
  fs.writeFileSync(bulkPath, c, 'utf8');
  console.log('Updated principal/students/bulk-add/page.tsx');
}
