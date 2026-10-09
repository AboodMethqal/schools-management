import fs from 'fs';
import path from 'path';

console.log('--- Starting Student Suite Localization ---');

// 1. student/attendance/page.tsx
const stuAttPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/attendance/page.tsx');
if (fs.existsSync(stuAttPath)) {
  let c = fs.readFileSync(stuAttPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getMyAttendance } from "@/app/actions/student/attendance"',
      'import { getMyAttendance } from "@/app/actions/student/attendance"\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function AttendancePage() {',
      'export default function AttendancePage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/Loading Attendance Records\.\.\./g, "{isAr ? 'جارٍ تحميل سجلات الحضور...' : 'Loading Attendance Records...'}");
  c = c.replace(/{ title: "Total Days"/g, '{ title: isAr ? "إجمالي الأيام" : "Total Days"');
  c = c.replace(/{ title: "Present"/g, '{ title: isAr ? "حاضر" : "Present"');
  c = c.replace(/{ title: "Absent"/g, '{ title: isAr ? "غائب" : "Absent"');
  c = c.replace(/{ title: "Late"/g, '{ title: isAr ? "متأخر" : "Late"');
  c = c.replace(/>Attendance Record<\/h1>/g, '>{isAr ? "سجل الحضور والغياب" : "Attendance Record"}</h1>');
  c = c.replace(/Your overall attendance rate is/g, "{isAr ? 'نسبة حضورك الإجمالية هي' : 'Your overall attendance rate is'}");
  c = c.replace(/Last Update/g, "{isAr ? 'آخر تحديث' : 'Last Update'}");
  c = c.replace(/>Full Attendance History<\/h3>/g, '>{isAr ? "سجل الحضور والغياب الكامل" : "Full Attendance History"}</h3>');
  c = c.replace(/Get PDF Report/g, "{isAr ? 'تحميل تقرير PDF' : 'Get PDF Report'}");
  c = c.replace(/>Date<\/th>/g, '>{isAr ? "التاريخ" : "Date"}</th>');
  c = c.replace(/>Status<\/th>/g, '>{isAr ? "الحالة" : "Status"}</th>');
  c = c.replace(/>Check In<\/th>/g, '>{isAr ? "وقت الدخول" : "Check In"}</th>');
  c = c.replace(/>Remarks<\/th>/g, '>{isAr ? "الملاحظات" : "Remarks"}</th>');
  c = c.replace(/>08:00 AM \(Fixed\)<\/td>/g, '>{isAr ? "08:00 ص (ثابت)" : "08:00 AM (Fixed)"}</td>');
  c = c.replace(/>Logged by Teacher<\/td>/g, '>{isAr ? "سُجل بواسطة المعلم" : "Logged by Teacher"}</td>');
  c = c.replace(/No attendance records found yet\./g, "{isAr ? 'لا توجد سجلات حضور مسجلة حتى الآن.' : 'No attendance records found yet.'}");
  c = c.replace(/>\s*\{row\.status\}\s*<\/span>/g, '>{isAr ? (row.status === "Present" ? "حاضر" : row.status === "Absent" ? "غائب" : "متأخر") : row.status}</span>');
  fs.writeFileSync(stuAttPath, c, 'utf8');
  console.log('Localized student/attendance/page.tsx');
}

// 2. student/feedback/page.tsx
const stuFbPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/feedback/page.tsx');
if (fs.existsSync(stuFbPath)) {
  let c = fs.readFileSync(stuFbPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import Link from "next/link"',
      'import Link from "next/link"\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function FeedbackPage() {',
      'export default function FeedbackPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/Reading teacher's notes\.\.\./g, "{isAr ? 'جارٍ قراءة ملاحظات المعلمين...' : \"Reading teacher's notes...\"}");
  c = c.replace(/Back to Dashboard/g, "{isAr ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}");
  c = c.replace(/Teacher's Feedback/g, "{isAr ? 'ملاحظات المعلمين' : \"Teacher's Feedback\"}");
  c = c.replace(/Valuable insights and performance reviews from your instructors\./g,
    "{isAr ? 'رؤى وتقييمات تفصيلية لأدائك الأكاديمي والسلوكي من معلميك.' : 'Valuable insights and performance reviews from your instructors.'}"
  );
  c = c.replace(/Total Reviews/g, "{isAr ? 'إجمالي الملاحظات' : 'Total Reviews'}");
  c = c.replace(/\{feedback\.length\} Entries/g, '{feedback.length} {isAr ? "تقييم" : "Entries"}');
  fs.writeFileSync(stuFbPath, c, 'utf8');
  console.log('Localized student/feedback/page.tsx');
}

// 3. student/results/page.tsx
const stuResPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/results/page.tsx');
if (fs.existsSync(stuResPath)) {
  let c = fs.readFileSync(stuResPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getMyResults } from "@/app/actions/student/results"',
      'import { getMyResults } from "@/app/actions/student/results"\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function ResultsPage() {',
      'export default function ResultsPage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/Calculating your GPA\.\.\./g, "{isAr ? 'جارٍ احتساب المعدل التراكمي...' : 'Calculating your GPA...'}");
  c = c.replace(/>Academic Transcript<\/h1>/g, '>{isAr ? "كشف الدرجات والنتائج الأكاديمية" : "Academic Transcript"}</h1>');
  c = c.replace(/>Official Term Report Cards<\/p>/g, '>{isAr ? "كشوف درجات الفصول الرسمية" : "Official Term Report Cards"}</p>');
  c = c.replace(/Download Transcript/g, "{isAr ? 'تحميل كشف الدرجات' : 'Download Transcript'}");
  c = c.replace(/>Cumulative GPA<\/p>/g, '>{isAr ? "المعدل التراكمي العام" : "Cumulative GPA"}</p>');
  c = c.replace(/>Term Assessment Results<\/h3>/g, '>{isAr ? "نتائج تقييم الفصول الدراسية" : "Term Assessment Results"}</h3>');
  c = c.replace(/>Subject<\/th>/g, '>{isAr ? "المادة" : "Subject"}</th>');
  c = c.replace(/>Marks Obtained<\/th>/g, '>{isAr ? "الدرجة المستحقة" : "Marks Obtained"}</th>');
  c = c.replace(/>Grade Point<\/th>/g, '>{isAr ? "النقاط" : "Grade Point"}</th>');
  c = c.replace(/>Letter Grade<\/th>/g, '>{isAr ? "التقدير" : "Letter Grade"}</th>');
  c = c.replace(/>Status<\/th>/g, '>{isAr ? "الحالة" : "Status"}</th>');
  fs.writeFileSync(stuResPath, c, 'utf8');
  console.log('Localized student/results/page.tsx');
}

// 4. student/profile/page.tsx
const stuProfPath2 = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/profile/page.tsx');
if (fs.existsSync(stuProfPath2)) {
  let c = fs.readFileSync(stuProfPath2, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import Swal from "sweetalert2"',
      'import Swal from "sweetalert2"\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function ProfilePage() {',
      'export default function ProfilePage() {\n    const { language } = useLanguage();\n    const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Student Profile<\/h1>/g, '>{isAr ? "الملف الشخصي للطالب" : "Student Profile"}</h1>');
  c = c.replace(/>Manage and view your academic identity<\/p>/g, '>{isAr ? "عرض وإدارة هويتك الأكاديمية وبياناتك" : "Manage and view your academic identity"}</p>');
  c = c.replace(/>Edit Profile<\/button>/g, '>{isAr ? "تعديل الملف" : "Edit Profile"}</button>');
  c = c.replace(/>Personal Information<\/h3>/g, '>{isAr ? "البيانات الشخصية" : "Personal Information"}</h3>');
  c = c.replace(/>Academic Details<\/h3>/g, '>{isAr ? "البيانات الأكاديمية" : "Academic Details"}</h3>');
  c = c.replace(/>Guardian & Contact Information<\/h3>/g, '>{isAr ? "بيانات ولي الأمر والتواصل" : "Guardian & Contact Information"}</h3>');
  c = c.replace(/>Residential Address<\/h3>/g, '>{isAr ? "عنوان الإقامة" : "Residential Address"}</h3>');
  c = c.replace(/>First Name<\/label>/g, '>{isAr ? "الاسم الأول" : "First Name"}</label>');
  c = c.replace(/>Last Name<\/label>/g, '>{isAr ? "اسم العائلة" : "Last Name"}</label>');
  c = c.replace(/>Registration No<\/label>/g, '>{isAr ? "رقم القيد" : "Registration No"}</label>');
  c = c.replace(/>Current Class<\/label>/g, '>{isAr ? "الصف الحالي" : "Current Class"}</label>');
  c = c.replace(/>Section<\/label>/g, '>{isAr ? "الشعبة" : "Section"}</label>');
  c = c.replace(/>Roll No<\/label>/g, '>{isAr ? "رقم الجلوس" : "Roll No"}</label>');
  c = c.replace(/>Father's Name<\/label>/g, '>{isAr ? "اسم الأب" : "Father\'s Name"}</label>');
  c = c.replace(/>Mother's Name<\/label>/g, '>{isAr ? "اسم الأم" : "Mother\'s Name"}</label>');
  c = c.replace(/>Guardian Phone<\/label>/g, '>{isAr ? "هاتف ولي الأمر" : "Guardian Phone"}</label>');
  c = c.replace(/>Cancel<\/button>/g, '>{isAr ? "إلغاء" : "Cancel"}</button>');
  c = c.replace(/>Save Changes<\/button>/g, '>{isAr ? "حفظ التغييرات" : "Save Changes"}</button>');
  fs.writeFileSync(stuProfPath2, c, 'utf8');
  console.log('Localized student/profile/page.tsx');
}

// 5. student/notices/page.tsx
const stuNotPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/notices/page.tsx');
if (fs.existsSync(stuNotPath)) {
  let c = fs.readFileSync(stuNotPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      'import { getCurrentSchoolId } from "@/app/actions/user"',
      'import { getCurrentSchoolId } from "@/app/actions/user"\nimport { useLanguage } from "@/context/LanguageProvider";'
    );
    c = c.replace(
      'export default function NoticesPage() {',
      'export default function NoticesPage() {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Notice Board<\/h1>/g, '>{isAr ? "لوحة الإعلانات" : "Notice Board"}</h1>');
  c = c.replace(/>Stay updated with school announcements and alerts<\/p>/g, '>{isAr ? "ابقَ على اطلاع بأحدث إعلانات وتنبيهات المدرسة" : "Stay updated with school announcements and alerts"}</p>');
  c = c.replace(/placeholder="Search notices\.\.\."/g, 'placeholder={isAr ? "البحث في الإعلانات..." : "Search notices..."}');
  c = c.replace(/>Published: /g, '>{isAr ? "تاريخ النشر: " : "Published: "}');
  c = c.replace(/>Expiry: /g, '>{isAr ? "تاريخ الانتهاء: " : "Expiry: "}');
  c = c.replace(/>Read Full Notice<\/span>/g, '>{isAr ? "قراءة الإعلان كاملاً" : "Read Full Notice"}</span>');
  c = c.replace(/No notices found\./g, "{isAr ? 'لا توجد إعلانات مطابقة حالياً.' : 'No notices found.'}");
  fs.writeFileSync(stuNotPath, c, 'utf8');
  console.log('Localized student/notices/page.tsx');
}

// 6. student/notices/[id]/page.tsx
const stuNotIdPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/notices/[id]/page.tsx');
if (fs.existsSync(stuNotIdPath)) {
  const content = `"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnnouncementById } from "@/app/actions/announcement";
import Link from "next/link";
import { Calendar, Users, ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

export default function NoticeDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getAnnouncementById(id).then((res) => {
        if (res.success && res.data) setNotice(res.data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        {isAr ? "الإعلان غير موجود أو تم حذفه." : "Notice not found"}
      </div>
    );
  }

  const categoryColor =
    notice.category?.toLowerCase() === "academic"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : notice.category?.toLowerCase() === "exam"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : notice.category?.toLowerCase() === "event"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      : notice.category?.toLowerCase() === "emergency"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  const priorityColor =
    notice.priority === "urgent"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : notice.priority === "high"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Link
        href="/dashboard/student/notices"
        className="inline-flex items-center text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 mb-4"
      >
        <ArrowLeft className="h-4 w-4 me-1" />
        {isAr ? "العودة إلى الإعلانات" : "Back to notices"}
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={\`text-xs font-semibold px-3 py-1 rounded-full \${categoryColor}\`}>
            {notice.category || (isAr ? "عام" : "General")}
          </span>
          <span className={\`text-xs font-semibold px-3 py-1 rounded-full \${priorityColor}\`}>
            {notice.priority}
          </span>
          <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Users className="h-3 w-3 me-1" />
            {notice.audience}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3">
          {notice.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 me-1" />
            {isAr ? "نُشر في: " : "Published: "}
            {new Date(notice.publishDate || notice.createdAt).toLocaleDateString()}
          </span>
          {notice.expiryDate && (
            <span className="flex items-center">
              <Calendar className="h-4 w-4 me-1" />
              {isAr ? "ينتهي في: " : "Expiry: "}
              {new Date(notice.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          {notice.content}
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(stuNotIdPath, content, 'utf8');
  console.log('Localized student/notices/[id]/page.tsx');
}

// 7. student/progress/page.jsx & StudentProgressClient.jsx
const stuProgPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/progress/page.jsx');
if (fs.existsSync(stuProgPath)) {
  const content = `"use client";
import StudentProgressClient from './_components/StudentProgressClient';
import { useLanguage } from "@/context/LanguageProvider";

const ProgressPage = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 bg-bg-page">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 rounded-4xl bg-bg-card border border-border-light p-6 md:p-8 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2">
            {isAr ? "لوحة التحكم" : "Dashboard"}
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            {isAr ? "مسار " : "Learning "}<span className="text-primary italic">{isAr ? "التقدم الدراسي" : "Progress"}</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm">
            {isAr ? "تحليل مفصل لأدائك في الاختبارات على مدار العام الدراسي." : "Detailed analysis of your exam performance over time."}
          </p>
        </header>
        <StudentProgressClient />
      </div>
    </main>
  );
};

export default ProgressPage;
`;
  fs.writeFileSync(stuProgPath, content, 'utf8');
  console.log('Localized student/progress/page.jsx');
}

// 8. student/progress/_components/StudentProgressClient.jsx
const progClientPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/progress/_components/StudentProgressClient.jsx');
if (fs.existsSync(progClientPath)) {
  let c = fs.readFileSync(progClientPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useAuth } from '@/hooks/useAuth';",
      "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const StudentProgressClient = () => {',
      'const StudentProgressClient = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/Loading performance insights\.\.\./g, "{isAr ? 'جارٍ تحميل مؤشرات الأداء...' : 'Loading performance insights...'}");
  c = c.replace(/>Average Score<\/p>/g, '>{isAr ? "متوسط الدرجات" : "Average Score"}</p>');
  c = c.replace(/>Highest Mark<\/p>/g, '>{isAr ? "أعلى درجة" : "Highest Mark"}</p>');
  c = c.replace(/>Total Exams Taken<\/p>/g, '>{isAr ? "إجمالي الاختبارات المنجزة" : "Total Exams Taken"}</p>');
  c = c.replace(/>Latest Performance<\/p>/g, '>{isAr ? "آخر اختبار" : "Latest Performance"}</p>');
  c = c.replace(/>Performance Timeline<\/h2>/g, '>{isAr ? "مسار الأداء الزمني" : "Performance Timeline"}</h2>');
  c = c.replace(/>Exam Score Trend<\/p>/g, '>{isAr ? "مؤشر تطور الدرجات" : "Exam Score Trend"}</p>');
  c = c.replace(/>Exam Performance Breakdown<\/h2>/g, '>{isAr ? "تفاصيل درجات الاختبارات" : "Exam Performance Breakdown"}</h2>');
  fs.writeFileSync(progClientPath, c, 'utf8');
  console.log('Localized student/progress/_components/StudentProgressClient.jsx');
}

// 9. student/take-exam/page.jsx
const takeExamPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/take-exam/page.jsx');
if (fs.existsSync(takeExamPath)) {
  let c = fs.readFileSync(takeExamPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useAuth } from '@/hooks/useAuth';",
      "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const ExamsPage = () => {',
      'const ExamsPage = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Exam Hall Access<\/span>/g, '>{isAr ? "الدخول إلى قاعة الاختبار" : "Exam Hall Access"}</span>');
  c = c.replace(/Take Exam From\s*<span className="block text-cyan-200 italic">Your Dashboard<\/span>/g,
    '{isAr ? "أداء الاختبار من " : "Take Exam From "}<span className="block text-cyan-200 italic">{isAr ? "لوحة التحكم الخاصة بك" : "Your Dashboard"}</span>'
  );
  c = c.replace(/Enter your teacher's 6-digit room code to join a live exam\.\s*Your attempts and scores will be saved automatically in My Exams\./g,
    "{isAr ? 'أدخل رمز القاعة المكون من 6 أرقام والمقدّم من معلمك للانضمام إلى الاختبار. سيتم حفظ إجاباتك ونتيجتك تلقائياً في اختباراتي.' : \"Enter your teacher's 6-digit room code to join a live exam. Your attempts and scores will be saved automatically in My Exams.\"}"
  );
  c = c.replace(/<PlayCircle size=\{18\} \/>\s*Enter Room Code/g, '<PlayCircle size={18} /> {isAr ? "إدخال رمز القاعة" : "Enter Room Code"}');
  fs.writeFileSync(takeExamPath, c, 'utf8');
  console.log('Localized student/take-exam/page.jsx');
}

// 10. student/take-exam/_components/JoinModal.jsx
const joinModPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/take-exam/_components/JoinModal.jsx');
if (fs.existsSync(joinModPath)) {
  let c = fs.readFileSync(joinModPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import React, { useRef, useEffect } from 'react';",
      "import React, { useRef, useEffect } from 'react';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const JoinModal = ({',
      'const JoinModal = ({\n  isOpen,\n  onClose,\n  roomCode,\n  setRoomCode,\n  onJoin,\n  loading,\n}) => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
    c = c.replace(
      '  isOpen,\n  onClose,\n  roomCode,\n  setRoomCode,\n  onJoin,\n  loading,\n}) => {',
      ''
    );
  }
  c = c.replace(/>Join Private Exam<\/h2>/g, '>{isAr ? "الانضمام إلى قاعة اختبار" : "Join Private Exam"}</h2>');
  c = c.replace(/Please enter the{' '}\s*<span className="text-primary font-bold">6-digit room code<\/span>{' '}\s*provided by your teacher\./g,
    "{isAr ? 'يرجى إدخال ' : 'Please enter the '}<span className=\"text-primary font-bold\">{isAr ? 'رمز القاعة المكون من 6 أرقام' : '6-digit room code'}</span>{isAr ? ' المقدّم من معلمك.' : ' provided by your teacher.'}"
  );
  c = c.replace(/<>Join Hall<\/>/g, '<>{isAr ? "دخول القاعة" : "Join Hall"}</>');
  fs.writeFileSync(joinModPath, c, 'utf8');
  console.log('Localized student/take-exam/_components/JoinModal.jsx');
}

// 11. student/take-exam/_components/ExamHall.jsx
const hallPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/take-exam/_components/ExamHall.jsx');
if (fs.existsSync(hallPath)) {
  let c = fs.readFileSync(hallPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import Swal from 'sweetalert2';",
      "import Swal from 'sweetalert2';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const ExamHall = ({ examData, user, result, setResult, clearSession }) => {',
      'const ExamHall = ({ examData, user, result, setResult, clearSession }) => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>Back to Dashboard<\/button>/g, '>{isAr ? "العودة إلى لوحة التحكم" : "Back to Dashboard"}</button>');
  c = c.replace(/>Current Session<\/p>/g, '>{isAr ? "الجلسة الحالية" : "Current Session"}</p>');
  c = c.replace(/>Exam Progress<\/p>/g, '>{isAr ? "تقدم الاختبار" : "Exam Progress"}</p>');
  c = c.replace(/Questions Answered<\/p>/g, "{isAr ? 'أسئلة تم إجابتها' : 'Questions Answered'}</p>");
  c = c.replace(/>Question Details<\/span>/g, '>{isAr ? "تفاصيل السؤال" : "Question Details"}</span>');
  c = c.replace(/<ChevronLeft size=\{16\} \/> Previous/g, '<ChevronLeft size={16} /> {isAr ? "السابق" : "Previous"}');
  c = c.replace(/Complete Exam <CheckCircle2 size=\{16\} \/>/g, '{isAr ? "إنهاء وتسليم الاختبار " : "Complete Exam "}<CheckCircle2 size={16} />');
  c = c.replace(/Next Question <ChevronRight size=\{16\} \/>/g, '{isAr ? "السؤال التالي " : "Next Question "}<ChevronRight size={16} />');
  c = c.replace(/>Question Map<\/h3>/g, '>{isAr ? "خريطة الأسئلة" : "Question Map"}</h3>');
  c = c.replace(/Answered<\/div>/g, "{isAr ? 'تمت الإجابة' : 'Answered'}</div>");
  c = c.replace(/Current<\/div>/g, "{isAr ? 'الحالي' : 'Current'}</div>");
  c = c.replace(/Pending<\/div>/g, "{isAr ? 'متبقي' : 'Pending'}</div>");
  fs.writeFileSync(hallPath, c, 'utf8');
  console.log('Localized student/take-exam/_components/ExamHall.jsx');
}

// 12. student/my-exams/page.jsx
const stuMyExamsPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/student/my-exams/page.jsx');
if (fs.existsSync(stuMyExamsPath)) {
  let c = fs.readFileSync(stuMyExamsPath, 'utf8');
  if (!c.includes('useLanguage')) {
    c = c.replace(
      "import { useAuth } from '@/hooks/useAuth';",
      "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
    );
    c = c.replace(
      'const StudentExams = () => {',
      'const StudentExams = () => {\n  const { language } = useLanguage();\n  const isAr = language === "ar";'
    );
  }
  c = c.replace(/>My Exam Ledger<\/h1>/g, '>{isAr ? "سجل اختباراتي" : "My Exam Ledger"}</h1>');
  c = c.replace(/>Track ongoing exam halls and your completed assessments\.<\/p>/g,
    '{isAr ? "متابعة قاعات الاختبارات الحالية والتقييمات المكتملة." : "Track ongoing exam halls and your completed assessments."}</p>'
  );
  c = c.replace(/>Average Score<\/p>/g, '>{isAr ? "متوسط الدرجات" : "Average Score"}</p>');
  c = c.replace(/>Total Completed<\/p>/g, '>{isAr ? "إجمالي الاختبارات المكتملة" : "Total Completed"}</p>');
  c = c.replace(/>Active Rooms<\/p>/g, '>{isAr ? "القاعات المتاحة" : "Active Rooms"}</p>');
  c = c.replace(/>Completed Exams<\/button>/g, '>{isAr ? "الاختبارات المكتملة" : "Completed Exams"}</button>');
  c = c.replace(/>Available Rooms<\/button>/g, '>{isAr ? "القاعات المتاحة" : "Available Rooms"}</button>');
  c = c.replace(/>Room Code<\/th>/g, '>{isAr ? "رمز القاعة" : "Room Code"}</th>');
  c = c.replace(/>Subject & Category<\/th>/g, '>{isAr ? "المادة والتصنيف" : "Subject & Category"}</th>');
  c = c.replace(/>Score<\/th>/g, '>{isAr ? "الدرجة" : "Score"}</th>');
  c = c.replace(/>Percentage<\/th>/g, '>{isAr ? "النسبة المئوية" : "Percentage"}</th>');
  c = c.replace(/>Submitted At<\/th>/g, '>{isAr ? "تاريخ التسليم" : "Submitted At"}</th>');
  fs.writeFileSync(stuMyExamsPath, c, 'utf8');
  console.log('Localized student/my-exams/page.jsx');
}

console.log('--- Student Suite Localization Completed ---');
