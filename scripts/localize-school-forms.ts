import fs from 'fs';
import path from 'path';

function localizeSchoolForm(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  if (!code.includes('useLanguage')) {
    code = code.replace("import Swal from 'sweetalert2'", "import Swal from 'sweetalert2'\nimport { useLanguage } from '@/context/LanguageProvider'");
    code = code.replace(/export default function \w+\(\) \{/, (m) => `${m}\n    const { language } = useLanguage()\n    const isAr = language === 'ar'`);
  }

  code = code.replace(/Back to Management/g, "{isAr ? 'العودة إلى الإدارة' : 'Back to Management'}");
  code = code.replace(/Register New School/g, "{isAr ? 'تسجيل مدرسة جديدة' : 'Register New School'}");
  code = code.replace(/Edit School Details/g, "{isAr ? 'تعديل بيانات المدرسة' : 'Edit School Details'}");
  code = code.replace(/Create a new institutional instance/g, "{isAr ? 'إنشاء وتفعيل مدرسة ومؤسسة جديدة' : 'Create a new institutional instance'}");
  code = code.replace(/Update school instance details/g, "{isAr ? 'تحديث وتعديل بيانات المدرسة' : 'Update school instance details'}");
  code = code.replace(/Institutional Profile/g, "{isAr ? 'الملف المؤسسي' : 'Institutional Profile'}");
  code = code.replace(/>School Name<\/label>/g, ">{isAr ? 'اسم المدرسة' : 'School Name'}</label>");
  code = code.replace(/>Sub-domain \/ Slug<\/label>/g, ">{isAr ? 'النطاق الفرعي / المعرف' : 'Sub-domain / Slug'}</label>");
  code = code.replace(/>School Category<\/label>/g, ">{isAr ? 'تصنيف المدرسة' : 'School Category'}</label>");
  code = code.replace(/>Primary School<\/option>/g, ">{isAr ? 'مدرسة ابتدائية' : 'Primary School'}</option>");
  code = code.replace(/>High School<\/option>/g, ">{isAr ? 'مدرسة ثانوية' : 'High School'}</option>");
  code = code.replace(/>College \/ University<\/option>/g, ">{isAr ? 'كلية / جامعة' : 'College / University'}</option>");
  code = code.replace(/>Madrasa<\/option>/g, ">{isAr ? 'مدرسة شرعية / معهد' : 'Madrasa'}</option>");
  code = code.replace(/>Registration ID<\/label>/g, ">{isAr ? 'رقم التسجيل / الترخيص' : 'Registration ID'}</label>");
  code = code.replace(/>Expected Students<\/label>/g, ">{isAr ? 'العدد المتوقع للطلاب' : 'Expected Students'}</label>");
  code = code.replace(/>Number of Classes<\/label>/g, ">{isAr ? 'عدد الفصول الدراسية' : 'Number of Classes'}</label>");
  code = code.replace(/>System Language<\/label>/g, ">{isAr ? 'لغة النظام' : 'System Language'}</label>");
  code = code.replace(/Communication & Web/g, "{isAr ? 'التواصل والموقع الإلكتروني' : 'Communication & Web'}");
  code = code.replace(/>Official Email<\/label>/g, ">{isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'}</label>");
  code = code.replace(/>Phone Number<\/label>/g, ">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>");
  code = code.replace(/>Website URL<\/label>/g, ">{isAr ? 'رابط الموقع الإلكتروني' : 'Website URL'}</label>");
  code = code.replace(/Platform Subscription/g, "{isAr ? 'اشتراك المنصة' : 'Platform Subscription'}");
  code = code.replace(/>Select Plan<\/label>/g, ">{isAr ? 'اختر الباقة' : 'Select Plan'}</label>");
  code = code.replace(/>Subscription Period<\/label>/g, ">{isAr ? 'مدة الاشتراك' : 'Subscription Period'}</label>");
  code = code.replace(/Root Administrative Access/g, "{isAr ? 'بيانات المدير الإداري' : 'Root Administrative Access'}");
  code = code.replace(/>Admin Full Name<\/label>/g, ">{isAr ? 'الاسم الكامل للمدير' : 'Admin Full Name'}</label>");
  code = code.replace(/>Admin Email<\/label>/g, ">{isAr ? 'البريد الإلكتروني للمدير' : 'Admin Email'}</label>");
  code = code.replace(/>Admin Password<\/label>/g, ">{isAr ? 'كلمة مرور المدير' : 'Admin Password'}</label>");
  code = code.replace(/Deploy Institution/g, "{isAr ? 'تفعيل وتسجيل المؤسسة' : 'Deploy Institution'}");
  code = code.replace(/Update School Details/g, "{isAr ? 'حفظ تعديلات المدرسة' : 'Update School Details'}");

  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Updated: ' + filePath);
}

localizeSchoolForm(path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/schools/new/page.tsx'));
localizeSchoolForm(path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/schools/editschool/page.tsx'));
localizeSchoolForm(path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/schools/update/[id]/page.tsx'));
localizeSchoolForm(path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/super-admin/schools/[id]/page.tsx'));
