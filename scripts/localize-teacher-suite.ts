import fs from 'fs';
import path from 'path';

console.log('--- Starting Teacher Suite Localization ---');

// 1. teacher/my-classes/page.tsx
const myClassesPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/my-classes/page.tsx');
if (fs.existsSync(myClassesPath)) {
  let c = fs.readFileSync(myClassesPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function MyClassesPage() {',
      'export default function MyClassesPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title="My"/g, 'title={isAr ? "فصولي" : "My"}');
  c = c.replace(/highlight="Classes"/g, 'highlight={isAr ? "الدراسية" : "Classes"}');
  c = c.replace(/subtitle="Manage your active classes and student sessions\."/g, 'subtitle={isAr ? "إدارة الفصول الدراسية النشطة وجلسات الطلاب." : "Manage your active classes and student sessions."}');
  c = c.replace(/>Active Classes<\/h2>/g, '>{isAr ? "الفصول الدراسية النشطة" : "Active Classes"}</h2>');
  c = c.replace(/Academic Year 2026/g, "{isAr ? 'العام الأكاديمي 2026' : 'Academic Year 2026'}");
  c = c.replace(/>Class Name<\/th>/g, '>{isAr ? "اسم الفصل" : "Class Name"}</th>');
  c = c.replace(/>Section<\/th>/g, '>{isAr ? "الشعبة" : "Section"}</th>');
  c = c.replace(/>Subject<\/th>/g, '>{isAr ? "المادة" : "Subject"}</th>');
  c = c.replace(/>Total Students<\/th>/g, '>{isAr ? "إجمالي الطلاب" : "Total Students"}</th>');
  c = c.replace(/>Actions<\/th>/g, '>{isAr ? "الإجراءات" : "Actions"}</th>');
  c = c.replace(/>View Details<\/Link>/g, '>{isAr ? "عرض التفاصيل" : "View Details"}</Link>');
  c = c.replace(/Attendance <ChevronRight/g, '{isAr ? "الحضور " : "Attendance "}<ChevronRight');
  c = c.replace(/>Students Directory<\/span>/g, '>{isAr ? "دليل الطلاب" : "Students Directory"}</span>');
  c = c.replace(/>Attendance<\/span>/g, '>{isAr ? "الحضور" : "Attendance"}</span>');
  c = c.replace(/>Active<\/span>/g, '>{isAr ? "نشط" : "Active"}</span>');
  fs.writeFileSync(myClassesPath, c, 'utf8');
  console.log('Localized teacher/my-classes/page.tsx');
}

// 2. teacher/my-classes/[classId]/page.tsx
const classDetailPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/my-classes/[classId]/page.tsx');
if (fs.existsSync(classDetailPath)) {
  let c = fs.readFileSync(classDetailPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../../TeacherHeader";',
      'import { TeacherHeader } from "../../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function ClassDetailPage() {',
      'export default function ClassDetailPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Students Directory<\/span>/g, '>{isAr ? "قائمة الطلاب" : "Students Directory"}</span>');
  c = c.replace(/>Attendance Records<\/span>/g, '>{isAr ? "سجلات الحضور" : "Attendance Records"}</span>');
  c = c.replace(/>Exam Results<\/span>/g, '>{isAr ? "نتائج الاختبارات" : "Exam Results"}</span>');
  c = c.replace(/>Assignments<\/span>/g, '>{isAr ? "الواجبات" : "Assignments"}</span>');
  c = c.replace(/placeholder="Search students by name or roll\.\.\."/g, 'placeholder={isAr ? "البحث عن الطلاب بالاسم أو رقم القيد..." : "Search students by name or roll..."}');
  c = c.replace(/Back to Classes/g, "{isAr ? 'العودة إلى الفصول' : 'Back to Classes'}");
  c = c.replace(/>Roll<\/th>/g, '>{isAr ? "رقم الجلوس" : "Roll"}</th>');
  c = c.replace(/>Student Name<\/th>/g, '>{isAr ? "اسم الطالب" : "Student Name"}</th>');
  c = c.replace(/>Attendance Rate<\/th>/g, '>{isAr ? "نسبة الحضور" : "Attendance Rate"}</th>');
  c = c.replace(/>Performance<\/th>/g, '>{isAr ? "المستوى" : "Performance"}</th>');
  c = c.replace(/>Action<\/th>/g, '>{isAr ? "الإجراء" : "Action"}</th>');
  c = c.replace(/>View Profile<\/button>/g, '>{isAr ? "عرض الملف" : "View Profile"}</button>');
  fs.writeFileSync(classDetailPath, c, 'utf8');
  console.log('Localized teacher/my-classes/[classId]/page.tsx');
}

// 3. teacher/my-classes/StudentProfile.tsx
const stuProfPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/my-classes/StudentProfile.tsx');
if (fs.existsSync(stuProfPath)) {
  let c = fs.readFileSync(stuProfPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getStudentDetail } from \'@/app/actions/teacher/classes\';',
      'import { getStudentDetail } from \'@/app/actions/teacher/classes\';\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function StudentProfile({ student, onBack }: StudentProfileProps) {',
      'export default function StudentProfile({ student, onBack }: StudentProfileProps) {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/Back to Student List/g, "{isAr ? 'العودة إلى قائمة الطلاب' : 'Back to Student List'}");
  c = c.replace(/>Academic Overview<\/h3>/g, '>{isAr ? "نظرة أكاديمية عامة" : "Academic Overview"}</h3>');
  c = c.replace(/>Attendance History<\/h3>/g, '>{isAr ? "سجل الحضور والغياب" : "Attendance History"}</h3>');
  c = c.replace(/>Attendance Rate<\/p>/g, '>{isAr ? "نسبة الحضور" : "Attendance Rate"}</p>');
  c = c.replace(/>Overall Grade<\/p>/g, '>{isAr ? "التقدير العام" : "Overall Grade"}</p>');
  c = c.replace(/>Behavior<\/p>/g, '>{isAr ? "السلوك" : "Behavior"}</p>');
  c = c.replace(/No results recorded yet\./g, "{isAr ? 'لم تُسجل أي نتائج حتى الآن.' : 'No results recorded yet.'}");
  c = c.replace(/No attendance records found\./g, "{isAr ? 'لا توجد سجلات حضور مسجلة.' : 'No attendance records found.'}");
  fs.writeFileSync(stuProfPath, c, 'utf8');
  console.log('Localized teacher/my-classes/StudentProfile.tsx');
}

// 4. teacher/assignments/page.tsx
const assignPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/assignments/page.tsx');
if (fs.existsSync(assignPath)) {
  let c = fs.readFileSync(assignPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function AssignmentPage() {',
      'export default function AssignmentPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title=\{reviewMode \? "Review" : "Task"\}/g, 'title={reviewMode ? (isAr ? "مراجعة" : "Review") : (isAr ? "إدارة" : "Task")}');
  c = c.replace(/highlight=\{reviewMode \? "Submissions" : "Manager"\}/g, 'highlight={reviewMode ? (isAr ? "التسليمات" : "Submissions") : (isAr ? "الواجبات" : "Manager")}');
  c = c.replace(/subtitle=\{reviewMode \? `\$\{reviewingAssignment\?\.title\} - \$\{reviewingAssignment\?\.subject\}` : "Create, track, and grade student assignments\."\}/g,
    'subtitle={reviewMode ? `${reviewingAssignment?.title} - ${reviewingAssignment?.subject}` : (isAr ? "إنشاء ومتابعة وتصحيح واجبات الطلاب الأكاديمية." : "Create, track, and grade student assignments.")}'
  );
  c = c.replace(/<Plus size=\{18\} \/> New Assignment/g, '<Plus size={18} /> {isAr ? "واجب جديد" : "New Assignment"}');
  c = c.replace(/Back to Assignments/g, "{isAr ? 'العودة إلى الواجبات' : 'Back to Assignments'}");
  c = c.replace(/>Student<\/th>/g, '>{isAr ? "الطالب" : "Student"}</th>');
  c = c.replace(/>Submission Date<\/th>/g, '>{isAr ? "تاريخ التسليم" : "Submission Date"}</th>');
  c = c.replace(/>Feedback & Remarks<\/th>/g, '>{isAr ? "الملاحظات والتقييم" : "Feedback & Remarks"}</th>');
  c = c.replace(/>Actions<\/th>/g, '>{isAr ? "الإجراءات" : "Actions"}</th>');
  c = c.replace(/placeholder="Marks"/g, 'placeholder={isAr ? "الدرجة" : "Marks"}');
  c = c.replace(/placeholder="Add feedback\.\.\."/g, 'placeholder={isAr ? "أضف ملاحظاتك..." : "Add feedback..."}');
  c = c.replace(/>Save<\/button>/g, '>{isAr ? "حفظ" : "Save"}</button>');
  c = c.replace(/>Received<\/span>/g, '>{isAr ? "تم الاستلام" : "Received"}</span>');
  c = c.replace(/>Missing<\/span>/g, '>{isAr ? "مفقود" : "Missing"}</span>');
  c = c.replace(/>Not Submitted<\/span>/g, '>{isAr ? "لم يتم التسليم" : "Not Submitted"}</span>');
  c = c.replace(/>Active<\/button>/g, '>{isAr ? "النشطة" : "Active"}</button>');
  c = c.replace(/>Closed<\/button>/g, '>{isAr ? "المغلقة" : "Closed"}</button>');
  c = c.replace(/>History<\/button>/g, '>{isAr ? "السجل" : "History"}</button>');
  c = c.replace(/placeholder="Search tasks\.\.\."/g, 'placeholder={isAr ? "البحث في المهام..." : "Search tasks..."}');
  c = c.replace(/>Locked<\/span>/g, '>{isAr ? "مغلق" : "Locked"}</span>');
  c = c.replace(/Success Rate<\/span>/g, "{isAr ? 'نسبة الإنجاز' : 'Success Rate'}</span>");
  c = c.replace(/>\s*Review\s*<\/button>/g, '>{isAr ? "مراجعة" : "Review"}</button>');
  c = c.replace(/>New Assignment<\/h3>/g, '>{isAr ? "واجب جديد" : "New Assignment"}</h3>');
  c = c.replace(/>Setup task for students<\/p>/g, '>{isAr ? "إعداد مهمة أو واجب دراسي للطلاب" : "Setup task for students"}</p>');
  c = c.replace(/>Assignment Title<\/label>/g, '>{isAr ? "عنوان الواجب" : "Assignment Title"}</label>');
  c = c.replace(/placeholder="e\.g\. Physics Lab Report"/g, 'placeholder={isAr ? "مثال: تقرير مختبر الفيزياء" : "e.g. Physics Lab Report"}');
  c = c.replace(/>Subject<\/label>/g, '>{isAr ? "المادة" : "Subject"}</label>');
  c = c.replace(/>Target Class<\/label>/g, '>{isAr ? "الفصل المستهدف" : "Target Class"}</label>');
  c = c.replace(/>Submission Deadline<\/label>/g, '>{isAr ? "موعد التسليم النهائي" : "Submission Deadline"}</label>');
  c = c.replace(/>Resources & Guidelines<\/label>/g, '>{isAr ? "المصادر والإرشادات" : "Resources & Guidelines"}</label>');
  c = c.replace(/>Drag & Drop File<\/p>/g, '>{isAr ? "اسحب الملف وأفلته هنا" : "Drag & Drop File"}</p>');
  c = c.replace(/>Discard<\/button>/g, '>{isAr ? "إلغاء" : "Discard"}</button>');
  c = c.replace(/>Post Task<\/button>/g, '>{isAr ? "نشر الواجب" : "Post Task"}</button>');
  fs.writeFileSync(assignPath, c, 'utf8');
  console.log('Localized teacher/assignments/page.tsx');
}

// 5. teacher/attendance/page.tsx
const attTeacherPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/attendance/page.tsx');
if (fs.existsSync(attTeacherPath)) {
  let c = fs.readFileSync(attTeacherPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function AttendancePage() {',
      'export default function AttendancePage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title=\{selectedClass \? "Marking" : "Take"\}/g, 'title={selectedClass ? (isAr ? "تسجيل" : "Marking") : (isAr ? "تسجيل" : "Take")}');
  c = c.replace(/highlight=\{selectedClass \? "Attendance" : "Attendance"\}/g, 'highlight={isAr ? "الحضور" : "Attendance"}');
  c = c.replace(/subtitle=\{selectedClass \? `\$\{currentClassDetails\?\.name\}` : "Select a class to record student attendance\."\}/g,
    'subtitle={selectedClass ? `${currentClassDetails?.name}` : (isAr ? "اختر فصلاً دراسياً لتسجيل حضور وغياب الطلاب." : "Select a class to record student attendance.")}'
  );
  c = c.replace(/Exit Sheet/g, "{isAr ? 'خروج' : 'Exit Sheet'}");
  c = c.replace(/Open Sheet/g, "{isAr ? 'فتح الكشف' : 'Open Sheet'}");
  c = c.replace(/Standard Session/g, "{isAr ? 'جلسة اعتيادية' : 'Standard Session'}");
  c = c.replace(/Classes & Attendance/g, "{isAr ? 'الفصول والحضور' : 'Classes & Attendance'}");
  c = c.replace(/← Back to Selection/g, "{isAr ? '← العودة إلى الاختيار' : '← Back to Selection'}");
  c = c.replace(/Mark All Present/g, "{isAr ? 'تحضير الكل' : 'Mark All Present'}");
  c = c.replace(/\{isSaving \? "Saving\.\.\." : isDatePast\(selectedDate\) \? "Read Only" : "Save Attendance"\}/g,
    '{isSaving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : isDatePast(selectedDate) ? (isAr ? "للقراءة فقط" : "Read Only") : (isAr ? "حفظ الحضور" : "Save Attendance")}'
  );
  c = c.replace(/Attendance for/g, "{isAr ? 'حضور' : 'Attendance for'}");
  c = c.replace(/Record daily attendance below\./g, "{isAr ? 'سجل الحضور اليومي للطلاب أدناه.' : 'Record daily attendance below.'}");
  c = c.replace(/placeholder="Search student\.\.\."/g, 'placeholder={isAr ? "البحث عن طالب..." : "Search student..."}');
  c = c.replace(/Security Rule: Attendance records can only be edited on the same day they are created\. Records from previous dates are read-only for teachers\./g,
    "{isAr ? 'قاعدة الأمان: يمكن تعديل سجلات الحضور في نفس يوم تسجيلها فقط. سجلات التواريخ السابقة متاحة للقراءة فقط.' : 'Security Rule: Attendance records can only be edited on the same day they are created. Records from previous dates are read-only for teachers.'}"
  );
  c = c.replace(/>Present<\/button>/g, '>{isAr ? "حاضر" : "Present"}</button>');
  c = c.replace(/>Late<\/button>/g, '>{isAr ? "متأخر" : "Late"}</button>');
  c = c.replace(/>Absent<\/button>/g, '>{isAr ? "غائب" : "Absent"}</button>');
  c = c.replace(/No students found matching your search\./g, "{isAr ? 'لم يتم العثور على طلاب يطابقون بحثك.' : 'No students found matching your search.'}");
  fs.writeFileSync(attTeacherPath, c, 'utf8');
  console.log('Localized teacher/attendance/page.tsx');
}

// 6. teacher/create-exam/page.jsx
const createExamPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/create-exam/page.jsx');
if (fs.existsSync(createExamPath)) {
  let c = fs.readFileSync(createExamPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useAuth } from '@/hooks/useAuth';",
      "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const CreateExam = () => {',
      'const CreateExam = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Create Exam Room<\/h1>/g, '>{isAr ? "إنشاء قاعة اختبار" : "Create Exam Room"}</h1>');
  c = c.replace(/>Setup questions and access code<\/p>/g, '>{isAr ? "إعداد الأسئلة ورمز الدخول" : "Setup questions and access code"}</p>');
  c = c.replace(/>Room Title<\/label>/g, '>{isAr ? "عنوان قاعة الاختبار" : "Room Title"}</label>');
  c = c.replace(/placeholder="e\.g\. Science Midterm 2026"/g, 'placeholder={isAr ? "مثال: اختبار العلوم النصفي 2026" : "e.g. Science Midterm 2026"}');
  c = c.replace(/>Duration \(Min\)<\/label>/g, '>{isAr ? "المدة (بالدقائق)" : "Duration (Min)"}</label>');
  c = c.replace(/>MINS<\/span>/g, '>{isAr ? "دقيقة" : "MINS"}</span>');
  c = c.replace(/>Category<\/label>/g, '>{isAr ? "المادة / التصنيف" : "Category"}</label>');
  c = c.replace(/>Class<\/label>/g, '>{isAr ? "الصف الدراسي" : "Class"}</label>');
  c = c.replace(/Class \{i \+ 1\}/g, "{isAr ? `الصف ${i + 1}` : `Class ${i + 1}`}");
  c = c.replace(/>ROOM ACCESS CODE<\/p>/g, '>{isAr ? "رمز دخول القاعة" : "ROOM ACCESS CODE"}</p>');
  c = c.replace(/>Generate New Code<\/button>/g, '>{isAr ? "توليد رمز جديد" : "Generate New Code"}</button>');
  c = c.replace(/>Question #\{q\.id\}<\/span>/g, '>{isAr ? `السؤال #${q.id}` : `Question #${q.id}`}</span>');
  c = c.replace(/placeholder="Type question description here\.\.\."/g, 'placeholder={isAr ? "اكتب نص السؤال هنا..." : "Type question description here..."}');
  c = c.replace(/>Add Next Question<\/button>/g, '>{isAr ? "إضافة سؤال جديد" : "Add Next Question"}</button>');
  c = c.replace(/>Publish Exam Room<\/button>/g, '>{isAr ? "نشر قاعة الاختبار" : "Publish Exam Room"}</button>');
  fs.writeFileSync(createExamPath, c, 'utf8');
  console.log('Localized teacher/create-exam/page.jsx');
}

// 7. teacher/my-exams/page.jsx
const myExamsPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/my-exams/page.jsx');
if (fs.existsSync(myExamsPath)) {
  let c = fs.readFileSync(myExamsPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useAuth } from '@/hooks/useAuth';",
      "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const AllExamsByTheTeacher = () => {',
      'const AllExamsByTheTeacher = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>My Exam Rooms<\/h1>/g, '>{isAr ? "قاعات اختباراتي" : "My Exam Rooms"}</h1>');
  c = c.replace(/>Manage and monitor active assessments<\/p>/g, '>{isAr ? "إدارة ومتابعة تقييمات الطلاب النشطة" : "Manage and monitor active assessments"}</p>');
  c = c.replace(/>Create New Room<\/span>/g, '>{isAr ? "إنشاء قاعة جديدة" : "Create New Room"}</span>');
  c = c.replace(/>Room Code<\/th>/g, '>{isAr ? "رمز القاعة" : "Room Code"}</th>');
  c = c.replace(/>Exam Title & Category<\/th>/g, '>{isAr ? "عنوان الاختبار والتصنيف" : "Exam Title & Category"}</th>');
  c = c.replace(/>Class & Duration<\/th>/g, '>{isAr ? "الصف والمدة" : "Class & Duration"}</th>');
  c = c.replace(/>Status<\/th>/g, '>{isAr ? "الحالة" : "Status"}</th>');
  c = c.replace(/>Actions<\/th>/g, '>{isAr ? "الإجراءات" : "Actions"}</th>');
  c = c.replace(/>View Results<\/Link>/g, '>{isAr ? "عرض النتائج" : "View Results"}</Link>');
  c = c.replace(/>ACTIVE<\/span>/g, '>{isAr ? "نشط" : "ACTIVE"}</span>');
  c = c.replace(/>PAUSED<\/span>/g, '>{isAr ? "متوقف" : "PAUSED"}</span>');
  fs.writeFileSync(myExamsPath, c, 'utf8');
  console.log('Localized teacher/my-exams/page.jsx');
}

// 8. teacher/my-exams/exam-result/page.jsx
const examResPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/my-exams/exam-result/page.jsx');
if (fs.existsSync(examResPath)) {
  let c = fs.readFileSync(examResPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useAuth } from '@/hooks/useAuth';",
      "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const ExamResultContent = () => {',
      'const ExamResultContent = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Exam Submission Results<\/h1>/g, '>{isAr ? "نتائج تسليم الاختبار" : "Exam Submission Results"}</h1>');
  c = c.replace(/>Performance ledger and gradebook<\/p>/g, '>{isAr ? "سجل درجات وأداء الطلاب" : "Performance ledger and gradebook"}</p>');
  c = c.replace(/placeholder="Search student\.\.\."/g, 'placeholder={isAr ? "البحث عن طالب..." : "Search student..."}');
  c = c.replace(/>Student Information<\/th>/g, '>{isAr ? "بيانات الطالب" : "Student Information"}</th>');
  c = c.replace(/>Score<\/th>/g, '>{isAr ? "الدرجة" : "Score"}</th>');
  c = c.replace(/>Percentage<\/th>/g, '>{isAr ? "النسبة المئوية" : "Percentage"}</th>');
  c = c.replace(/>Submitted At<\/th>/g, '>{isAr ? "تاريخ التسليم" : "Submitted At"}</th>');
  c = c.replace(/Back to Exams/g, "{isAr ? 'العودة للاختبارات' : 'Back to Exams'}");
  fs.writeFileSync(examResPath, c, 'utf8');
  console.log('Localized teacher/my-exams/exam-result/page.jsx');
}

// 9. teacher/mcq-results/page.jsx
const mcqResPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/mcq-results/page.jsx');
if (fs.existsSync(mcqResPath)) {
  let c = fs.readFileSync(mcqResPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useEffect, useMemo, useState } from 'react';",
      "import { useEffect, useMemo, useState } from 'react';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const TeacherMcqResultsPage = () => {',
      'const TeacherMcqResultsPage = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>MCQ Results Ledger<\/h1>/g, '>{isAr ? "سجل نتائج اختبارات الاختيار من متعدد" : "MCQ Results Ledger"}</h1>');
  c = c.replace(/>View student scores across completed online exams<\/p>/g, '>{isAr ? "عرض درجات الطلاب في الاختبارات الإلكترونية المكتملة" : "View student scores across completed online exams"}</p>');
  c = c.replace(/placeholder="Search by student name, email, subject, or room code\.\.\."/g,
    'placeholder={isAr ? "البحث باسم الطالب أو البريد أو المادة أو رمز القاعة..." : "Search by student name, email, subject, or room code..."}'
  );
  c = c.replace(/>Student<\/th>/g, '>{isAr ? "الطالب" : "Student"}</th>');
  c = c.replace(/>Subject & Room<\/th>/g, '>{isAr ? "المادة والقاعة" : "Subject & Room"}</th>');
  c = c.replace(/>Score<\/th>/g, '>{isAr ? "الدرجة" : "Score"}</th>');
  c = c.replace(/>Date & Time<\/th>/g, '>{isAr ? "التاريخ والوقت" : "Date & Time"}</th>');
  fs.writeFileSync(mcqResPath, c, 'utf8');
  console.log('Localized teacher/mcq-results/page.jsx');
}

// 10. teacher/feedback/page.tsx
const fbTeacherPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/feedback/page.tsx');
if (fs.existsSync(fbTeacherPath)) {
  let c = fs.readFileSync(fbTeacherPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function FeedbackPage() {',
      'export default function FeedbackPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title="Student"/g, 'title={isAr ? "ملاحظات" : "Student"}');
  c = c.replace(/highlight="Feedback"/g, 'highlight={isAr ? "الطلاب" : "Feedback"}');
  c = c.replace(/subtitle="Evaluate student academic and behavioral progress\."/g, 'subtitle={isAr ? "تقييم المستوى الأكاديمي والسلوكي للطلاب." : "Evaluate student academic and behavioral progress."}');
  c = c.replace(/>Select Class<\/label>/g, '>{isAr ? "اختر الفصل" : "Select Class"}</label>');
  c = c.replace(/>Select Student<\/label>/g, '>{isAr ? "اختر الطالب" : "Select Student"}</label>');
  c = c.replace(/>Academic Performance<\/label>/g, '>{isAr ? "الأداء الأكاديمي" : "Academic Performance"}</label>');
  c = c.replace(/>Behavior & Conduct<\/label>/g, '>{isAr ? "السلوك والانضباط" : "Behavior & Conduct"}</label>');
  c = c.replace(/>Class Participation<\/label>/g, '>{isAr ? "المشاركة الصفية" : "Class Participation"}</label>');
  c = c.replace(/>Detailed Remarks<\/label>/g, '>{isAr ? "ملاحظات تفصيلية" : "Detailed Remarks"}</label>');
  c = c.replace(/placeholder="Write thoughtful evaluation and constructive feedback\.\.\."/g,
    'placeholder={isAr ? "اكتب تقييماً وملاحظات بنّاءة حول الطالب..." : "Write thoughtful evaluation and constructive feedback..."}'
  );
  c = c.replace(/>Submit Feedback<\/button>/g, '>{isAr ? "إرسال الملاحظات" : "Submit Feedback"}</button>');
  c = c.replace(/>Previous Remarks<\/h3>/g, '>{isAr ? "الملاحظات السابقة" : "Previous Remarks"}</h3>');
  fs.writeFileSync(fbTeacherPath, c, 'utf8');
  console.log('Localized teacher/feedback/page.tsx');
}

// 11. teacher/notices/page.tsx
const notTeacherPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/notices/page.tsx');
if (fs.existsSync(notTeacherPath)) {
  let c = fs.readFileSync(notTeacherPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function NoticesPage() {',
      'export default function NoticesPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title="Faculty"/g, 'title={isAr ? "لوحة" : "Faculty"}');
  c = c.replace(/highlight="Notices"/g, 'highlight={isAr ? "الإعلانات" : "Notices"}');
  c = c.replace(/subtitle="Broadcast announcements and circulars\."/g, 'subtitle={isAr ? "بث الإعلانات والتعميمات الدراسية." : "Broadcast announcements and circulars."}');
  c = c.replace(/Post Notice/g, "{isAr ? 'نشر إعلان' : 'Post Notice'}");
  c = c.replace(/placeholder="Search notices\.\.\."/g, 'placeholder={isAr ? "البحث في الإعلانات..." : "Search notices..."}');
  c = c.replace(/>All Notices<\/button>/g, '>{isAr ? "جميع الإعلانات" : "All Notices"}</button>');
  c = c.replace(/>New Notice<\/h3>/g, '>{isAr ? "إعلان جديد" : "New Notice"}</h3>');
  c = c.replace(/>Notice Title<\/label>/g, '>{isAr ? "عنوان الإعلان" : "Notice Title"}</label>');
  c = c.replace(/>Target Audience<\/label>/g, '>{isAr ? "الفئة المستهدفة" : "Target Audience"}</label>');
  c = c.replace(/>Publish Notice<\/button>/g, '>{isAr ? "نشر الإعلان" : "Publish Notice"}</button>');
  fs.writeFileSync(notTeacherPath, c, 'utf8');
  console.log('Localized teacher/notices/page.tsx');
}

// 12. teacher/profile/page.tsx
const profTeacherPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/profile/page.tsx');
if (fs.existsSync(profTeacherPath)) {
  let c = fs.readFileSync(profTeacherPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function ProfilePage() {',
      'export default function ProfilePage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title="My"/g, 'title={isAr ? "ملفي" : "My"}');
  c = c.replace(/highlight="Profile"/g, 'highlight={isAr ? "الشخصي" : "Profile"}');
  c = c.replace(/subtitle="View and manage your professional teacher profile\."/g, 'subtitle={isAr ? "عرض وإدارة ملف المعلم المهني الخاص بك." : "View and manage your professional teacher profile."}');
  c = c.replace(/>Personal Information<\/h3>/g, '>{isAr ? "البيانات الشخصية" : "Personal Information"}</h3>');
  c = c.replace(/>Academic & Department Details<\/h3>/g, '>{isAr ? "البيانات الأكاديمية والقسم" : "Academic & Department Details"}</h3>');
  c = c.replace(/>Full Name<\/label>/g, '>{isAr ? "الاسم الكامل" : "Full Name"}</label>');
  c = c.replace(/>Email Address<\/label>/g, '>{isAr ? "البريد الإلكتروني" : "Email Address"}</label>');
  c = c.replace(/>Phone Number<\/label>/g, '>{isAr ? "رقم الهاتف" : "Phone Number"}</label>');
  c = c.replace(/>Designation<\/label>/g, '>{isAr ? "المسمى الوظيفي" : "Designation"}</label>');
  c = c.replace(/>Department<\/label>/g, '>{isAr ? "القسم" : "Department"}</label>');
  c = c.replace(/>Qualification<\/label>/g, '>{isAr ? "المؤهل العلمي" : "Qualification"}</label>');
  c = c.replace(/>Save Changes<\/button>/g, '>{isAr ? "حفظ التغييرات" : "Save Changes"}</button>');
  fs.writeFileSync(profTeacherPath, c, 'utf8');
  console.log('Localized teacher/profile/page.tsx');
}

// 13. teacher/schedule/page.tsx
const schedTeacherPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/schedule/page.tsx');
if (fs.existsSync(schedTeacherPath)) {
  let c = fs.readFileSync(schedTeacherPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function TeacherSchedulePage() {',
      'export default function TeacherSchedulePage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";\n    const dayMap: Record<string, string> = { Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء", Wednesday: "الأربعاء", Thursday: "الخميس" };'
    );
  }
  c = c.replace(/title="Class"/g, 'title={isAr ? "الجدول" : "Class"}');
  c = c.replace(/highlight="Schedule"/g, 'highlight={isAr ? "الدراسي" : "Schedule"}');
  c = c.replace(/subtitle="Manage timetable and classroom periods\."/g, 'subtitle={isAr ? "إدارة جدول الحصص والفترات الدراسية." : "Manage timetable and classroom periods."}');
  c = c.replace(/Add Routine Period/g, "{isAr ? 'إضافة حصة' : 'Add Routine Period'}");
  c = c.replace(/>Select Class<\/label>/g, '>{isAr ? "اختر الفصل" : "Select Class"}</label>');
  c = c.replace(/\{day\}<\/button>/g, '{isAr ? (dayMap[day] || day) : day}</button>');
  c = c.replace(/>Period Time<\/th>/g, '>{isAr ? "وقت الحصة" : "Period Time"}</th>');
  c = c.replace(/>Subject<\/th>/g, '>{isAr ? "المادة" : "Subject"}</th>');
  c = c.replace(/>Assigned Teacher<\/th>/g, '>{isAr ? "المعلم المعين" : "Assigned Teacher"}</th>');
  c = c.replace(/>Actions<\/th>/g, '>{isAr ? "الإجراءات" : "Actions"}</th>');
  fs.writeFileSync(schedTeacherPath, c, 'utf8');
  console.log('Localized teacher/schedule/page.tsx');
}

// 14. teacher/study-materials/page.tsx
const studyMatPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/teacher/study-materials/page.tsx');
if (fs.existsSync(studyMatPath)) {
  let c = fs.readFileSync(studyMatPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { TeacherHeader } from "../TeacherHeader";',
      'import { TeacherHeader } from "../TeacherHeader";\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function StudyMaterialsPage() {',
      'export default function StudyMaterialsPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/title="Study"/g, 'title={isAr ? "المواد" : "Study"}');
  c = c.replace(/highlight="Materials"/g, 'highlight={isAr ? "التعليمية" : "Materials"}');
  c = c.replace(/subtitle="Upload and distribute learning resources\."/g, 'subtitle={isAr ? "رفع ومشاركة الموارد التعليمية والملفات مع الطلاب." : "Upload and distribute learning resources."}');
  c = c.replace(/Upload Material/g, "{isAr ? 'رفع ملف تعليمي' : 'Upload Material'}");
  c = c.replace(/placeholder="Search resources\.\.\."/g, 'placeholder={isAr ? "البحث في المصادر والملفات..." : "Search resources..."}');
  c = c.replace(/>All Classes<\/option>/g, '>{isAr ? "جميع الفصول" : "All Classes"}</option>');
  c = c.replace(/>All Subjects<\/option>/g, '>{isAr ? "جميع المواد" : "All Subjects"}</option>');
  c = c.replace(/>Download<\/button>/g, '>{isAr ? "تحميل" : "Download"}</button>');
  c = c.replace(/>Upload New Resource<\/h3>/g, '>{isAr ? "رفع مورد تعليمي جديد" : "Upload New Resource"}</h3>');
  c = c.replace(/>Resource Title<\/label>/g, '>{isAr ? "عنوان الملف" : "Resource Title"}</label>');
  c = c.replace(/>Description<\/label>/g, '>{isAr ? "الوصف" : "Description"}</label>');
  c = c.replace(/>Cancel<\/button>/g, '>{isAr ? "إلغاء" : "Cancel"}</button>');
  c = c.replace(/>Save & Upload<\/button>/g, '>{isAr ? "حفظ ورفع" : "Save & Upload"}</button>');
  fs.writeFileSync(studyMatPath, c, 'utf8');
  console.log('Localized teacher/study-materials/page.tsx');
}

console.log('--- Teacher Suite Localization Completed ---');
