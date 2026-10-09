import fs from 'fs';
import path from 'path';

// 1. Localize super-admin/plans/page.tsx
const plansPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/plans/page.tsx');
if (fs.existsSync(plansPath)) {
  let code = fs.readFileSync(plansPath, 'utf8');
  if (!code.includes('useLanguage')) {
    code = code.replace("import Swal from 'sweetalert2';", "import Swal from 'sweetalert2';\nimport { useLanguage } from '@/context/LanguageProvider';");
    code = code.replace("export default function PlansSetup() {", "export default function PlansSetup() {\n  const { language } = useLanguage();\n  const isAr = language === 'ar';");
  }
  code = code.replace(/Subscription Plans<\/h2>/g, "{isAr ? 'خطط الاشتراك' : 'Subscription Plans'}</h2>");
  code = code.replace(/Manage your SaaS packages by unique ID\.<\/p>/g, "{isAr ? 'إدارة باقات المنصة السحابية والأسعار والميزات.' : 'Manage your SaaS packages by unique ID.'}</p>");
  code = code.replace(/<Plus size=\{18\} \/> Create New Plan/g, "<Plus size={18} /> {isAr ? 'إنشاء خطة جديدة' : 'Create New Plan'}");
  code = code.replace(/No plans found\. Create one to get started\./g, "{isAr ? 'لا توجد خطط متاحة. أنشئ خطة جديدة للبدء.' : 'No plans found. Create one to get started.'}");
  code = code.replace(/title="Edit Plan"/g, 'title={isAr ? "تعديل الخطة" : "Edit Plan"}');
  code = code.replace(/title="Delete Plan"/g, 'title={isAr ? "حذف الخطة" : "Delete Plan"}');
  code = code.replace(/<LayoutGrid size=\{12\} \/> Modules Included/g, "<LayoutGrid size={12} /> {isAr ? 'الوحدات المضمنة' : 'Modules Included'}");
  code = code.replace(/\{plan\.students\} Std/g, "{plan.students} {isAr ? 'طالب' : 'Std'}");
  code = code.replace(/\{plan\.teachers\} Teach/g, "{plan.teachers} {isAr ? 'معلم' : 'Teach'}");
  fs.writeFileSync(plansPath, code, 'utf8');
  console.log('Updated super-admin/plans/page.tsx');
}

// 2. Localize super-admin/schools/page.tsx
const schoolsPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/schools/page.tsx');
if (fs.existsSync(schoolsPath)) {
  let code = fs.readFileSync(schoolsPath, 'utf8');
  if (!code.includes('useLanguage')) {
    code = code.replace("import Swal from 'sweetalert2'", "import Swal from 'sweetalert2'\nimport { useLanguage } from '@/context/LanguageProvider'");
    code = code.replace("export default function SchoolsList() {", "export default function SchoolsList() {\n  const { language } = useLanguage()\n  const isAr = language === 'ar'");
  }
  code = code.replace(/Institutions List<\/h2>/g, "{isAr ? 'قائمة المؤسسات والمدارس' : 'Institutions List'}</h2>");
  code = code.replace(/Review and manage all school instances\.<\/p>/g, "{isAr ? 'مراجعة وإدارة جميع مثيلات وحسابات المدارس.' : 'Review and manage all school instances.'}</p>");
  code = code.replace(/<Plus size=\{18\} \/> Register School/g, "<Plus size={18} /> {isAr ? 'تسجيل مدرسة جديدة' : 'Register School'}");
  code = code.replace(/placeholder="Search by school name or slug\.\.\."/g, 'placeholder={isAr ? "البحث باسم المدرسة أو المعرف..." : "Search by school name or slug..."}');
  code = code.replace(/Institution Info<\/th>/g, "{isAr ? 'بيانات المؤسسة' : 'Institution Info'}</th>");
  code = code.replace(/>Phone<\/th>/g, ">{isAr ? 'الهاتف' : 'Phone'}</th>");
  code = code.replace(/>Category<\/th>/g, ">{isAr ? 'التصنيف' : 'Category'}</th>");
  code = code.replace(/>Plan<\/th>/g, ">{isAr ? 'الباقة' : 'Plan'}</th>");
  code = code.replace(/>Status<\/th>/g, ">{isAr ? 'الحالة' : 'Status'}</th>");
  code = code.replace(/Actions<\/th>/g, "{isAr ? 'الإجراءات' : 'Actions'}</th>");
  code = code.replace(/Data Loading\.\.\./g, "{isAr ? 'جارٍ تحميل البيانات...' : 'Data Loading...'}");
  code = code.replace(/No Institutions Registered/g, "{isAr ? 'لا توجد مؤسسات مسجلة' : 'No Institutions Registered'}");
  code = code.replace(/Edit School/g, "{isAr ? 'تعديل المدرسة' : 'Edit School'}");
  code = code.replace(/Delete/g, "{isAr ? 'حذف' : 'Delete'}");
  fs.writeFileSync(schoolsPath, code, 'utf8');
  console.log('Updated super-admin/schools/page.tsx');
}

// 3. Localize super-admin/support/page.tsx
const supportPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/support/page.tsx');
if (fs.existsSync(supportPath)) {
  let code = fs.readFileSync(supportPath, 'utf8');
  if (!code.includes('useLanguage')) {
    code = code.replace("import Swal from 'sweetalert2';", "import Swal from 'sweetalert2';\nimport { useLanguage } from '@/context/LanguageProvider';");
    code = code.replace("export default function ActivityHelpDesk() {", "export default function ActivityHelpDesk() {\n  const { language } = useLanguage();\n  const isAr = language === 'ar';");
  }
  code = code.replace(/Support <span className="text-primary">Tickets<\/span>/g, "{isAr ? <>تذاكر <span className=\"text-primary\">الدعم الفني</span></> : <>Support <span className=\"text-primary\">Tickets</span></>}");
  code = code.replace(/Active: \{activities\.filter\(\(t\) => t\.status !== 'completed'\)\.length\} \|[\s\n]*Resolved: \{activities\.filter\(\(t\) => t\.status === 'completed'\)\.length\}/g,
    "{isAr ? `النشطة: ${activities.filter((t) => t.status !== 'completed').length} | المكتملة: ${activities.filter((t) => t.status === 'completed').length}` : `Active: ${activities.filter((t) => t.status !== 'completed').length} | Resolved: ${activities.filter((t) => t.status === 'completed').length}`}"
  );
  code = code.replace(/>\s*Subject\s*<\/th>/g, ">{isAr ? 'الموضوع' : 'Subject'}</th>");
  code = code.replace(/>\s*Priority\s*<\/th>/g, ">{isAr ? 'الأولوية' : 'Priority'}</th>");
  code = code.replace(/>\s*Status\s*<\/th>/g, ">{isAr ? 'الحالة' : 'Status'}</th>");
  code = code.replace(/>\s*Actions\s*<\/th>/g, ">{isAr ? 'الإجراءات' : 'Actions'}</th>");
  code = code.replace(/>\s*Ticket Details\s*<\/h3>/g, ">{isAr ? 'تفاصيل التذكرة' : 'Ticket Details'}</h3>");
  code = code.replace(/>\s*Close\s*<\/button>/g, ">{isAr ? 'إغلاق' : 'Close'}</button>");
  code = code.replace(/Mark as Resolved/g, "{isAr ? 'تحديد كمكتملة' : 'Mark as Resolved'}");
  code = code.replace(/Mark as In-Review/g, "{isAr ? 'تحديد كقيد المراجعة' : 'Mark as In-Review'}");
  fs.writeFileSync(supportPath, code, 'utf8');
  console.log('Updated super-admin/support/page.tsx');
}
