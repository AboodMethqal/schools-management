const fs = require('fs');
const path = require('path');

const providerContent = fs.readFileSync(path.join(__dirname, '../src/context/LanguageProvider.tsx'), 'utf8');
const match = providerContent.match(/export const translations: Record<string, string> = \{([\s\S]*?)\n\};/);
if (!match) {
  console.error('Translations object not found');
  process.exit(1);
}

const dictStr = match[1];
const regex = /'((?:\\\\'|[^'])*)':\s*'((?:\\\\'|[^'])*)'/g;
let m;
const entries = new Map();
while ((m = regex.exec(dictStr)) !== null) {
  const k = m[1];
  const v = m[2];
  entries.set(k, v);
}

const additionalKeys = {
  'Welcome': 'مرحبًا',
  'Track your children\'s academic progress, attendance, results, fees, and teacher notes from a single dashboard.': 'تابع مستوى أبنائك الدراسي، حضورهم، نتائجهم، الرسوم، وملاحظات المعلمين من لوحة واحدة.',
  'Child Switcher': 'التبديل بين الأبناء',
  'Select a student to view live records and statistics from the database': 'اختر الطالب لعرض سجلاته وإحصائياته الحية من قاعدة البيانات',
  'Linked Children': 'الأبناء المرتبطون',
  'Student Attendance': 'حضور الطالب',
  'GPA': 'المعدل',
  'Outstanding Dues': 'المستحقات المتبقية',
  'Outstanding Fees': 'المستحقات المتبقية',
  'Select a student to follow up on their details and complete academic profile.': 'اختر الطالب لمتابعة تفاصيله وملفه الأكاديمي الكامل.',
  'Currently Active': 'النشط حالياً',
  'Class Section': 'الشعبة',
  'View full profile': 'عرض الملف الكامل',
  'Recent Activities': 'آخر النشاطات',
  'Latest updates recorded for your children.': 'أحدث ما تم تسجيله لأبنائك.',
  'No recent activities.': 'لا توجد نشاطات حديثة.',
  'Quick Access': 'الوصول السريع',
  'Results & Performance': 'النتائج والأداء',
  'Attendance & Absence': 'الحضور والغياب',
  'School Communication': 'التواصل مع المدرسة',
  'Fees & Payments': 'الرسوم والمدفوعات',
  'No students linked to this account': 'لا يوجد طلاب مرتبطون بالحساب',
  'Please contact the school administration to link your children to your parent account.': 'اطلب من إدارة المدرسة ربط أبنائك بحساب ولي الأمر.',
  'Roll No': 'رقم القيد',
  'Guardian': 'ولي الأمر',
  'Back to My Children': 'العودة إلى أبنائي',
  'Student Profile': 'ملف الطالب',
  'Academic Information': 'المعلومات الأكاديمية',
  'Class and Section': 'الصف والشعبة',
  'Roll': 'رقم',
  'Date of Birth': 'تاريخ الميلاد',
  'Personal Information': 'المعلومات الشخصية',
  'Blood Group': 'فصيلة الدم',
  'Contact Phone': 'الهاتف',
  'Active Student': 'طالب نشط',
  'Current Address': 'العنوان الحالي',
  'Student not found': 'لم يتم العثور على الطالب',
  'Initiating Payment': 'بدء الدفع',
  'Redirecting to secure gateway...': 'جارٍ التحويل إلى بوابة الدفع الآمنة...',
  'Payment Request Submitted': 'تم تسجيل الطلب',
  'Payment request submitted and will be verified by administration.': 'تم تسجيل طلب الدفع وسيتم تأكيده من إدارة المدرسة.',
  'Payment Error': 'خطأ في الدفع',
  'Unable to submit payment request': 'تعذر تسجيل طلب الدفع',
  'Total Due': 'إجمالي المستحق',
  'Remaining Balance': 'الرصيد المتبقي',
  'Due Date': 'تاريخ الاستحقاق',
  'Pay Now': 'ادفع الآن',
  'Statement': 'كشف حساب',
  'Showing last 6 months of records': 'عرض سجلات آخر 6 أشهر',
  'Order Number': 'رقم الطلب',
  'Secure Payment Request': 'طلب دفع آمن',
  'Payment confirmation is handled by school administration': 'تأكيد الدفع يتم من خلال إدارة المدرسة',
  'Back to Payments': 'العودة إلى المدفوعات',
  'currency.yer': 'ر.ي',
  'currency.sar': 'ر.س',
  'currency.usd': '$',
  'YER': 'ر.ي',
  'SAR': 'ر.س',
  'USD': '$',
  'Half Day': 'نصف يوم',
  'Excused': 'معذور',
  'Male': 'ذكر',
  'Female': 'أنثى',
  'System Administrator': 'مدير عام مثقال تك',
  'Cloud System Administration': 'إدارة النظام السحابي',
  'Salem Baabbad (Accountant)': 'سالم باعباد المحاسب',
  'Accounts & Finance Department': 'قسم الحسابات والمالية',
  'Dr. Ahmed Al-Shami': 'د. أحمد الشامي',
  'School Administration': 'إدارة المدرسة',
  'Mohammed Khaled Al-Zubairi': 'أ. محمد خالد الزبيري',
  'Math & Science Department': 'قسم الرياضيات والعلوم',
  'Ahmed Khaled Al-Ali': 'أحمد خالد العلي',
  'Parent of Omar & Sara': 'ولي أمر عمر وسارة',
  'Omar Ahmed Khaled': 'عمر أحمد خالد',
  'Interactive Demo Portals': 'البوابات التجريبية التفاعلية',
  'Choose your role to explore all the features of the school management system and discover the digital future of education seamlessly with realistic data.': 'اختر دورك لتجربة كافة مميزات نظام إدارة المدارس واستكشاف المستقبل الرقمي للتعليم بكل سلاسة وببيانات واقعية.',
  'All demo accounts are ready and connected to realistic data': 'جميع الحسابات التجريبية جاهزة ومربوطة بالبيانات الواقعية',
  'Want to use Methqal Tech for your school?': 'ترغب في استخدام مثقال تك لمدرستك؟',
  'Apply for your institution now': 'قدم طلب انضمام مؤسستك الآن',
  'or': 'أو',
  'Enter Portal': 'دخول البوابة',
  'Entering...': 'جارٍ الدخول...',
  'Stay updated with the latest educational insights and trends': 'ابقَ على اطلاع بأحدث التطورات والرؤى التعليمية',
  'Empowering your educational journey. We are always here to help.': 'نُمكّن مسيرتكم التعليمية. نحن هنا دائماً لمساعدتكم.',
  'Platform Development': 'تطوير المنصة',
  'Building and developing the Methqal Tech platform and UX for all school roles.': 'بناء وتطوير منصة مثقال تك وتجربة المستخدم لجميع أدوار المدرسة.',
  'User Experience': 'تجربة المستخدم',
  'Modern, responsive interface design for principals, teachers, students, and parents.': 'تصميم واجهات عربية حديثة ومتجاوبة للمدير والمعلم والطالب وولي الأمر.',
  'Data & Security': 'البيانات والأمان',
  'Database management, role-based access control, tenant isolation, and data protection.': 'إدارة قاعدة البيانات والصلاحيات والعزل بين المدارس وحماية البيانات.',
  'Cloud Infrastructure': 'البنية السحابية',
  'Preparing platform for cloud deployment, high performance, backups, and monitoring.': 'تهيئة المنصة للنشر السحابي والأداء والنسخ الاحتياطي والمراقبة.',
  'Security & Permissions': 'الأمان والصلاحيات',
  'Role-based access enforcement ensuring users access only their authorized data.': 'تطبيق الصلاحيات حسب الدور وضمان وصول كل مستخدم إلى بياناته فقط.',
  'Educational Solutions': 'الحلول التعليمية',
  'Translating school requirements into practical tools for monitoring, assessment, and communication.': 'تحويل احتياجات المدرسة إلى أدوات عملية للمتابعة والتقييم والتواصل.',
  'Methqal Tech Team & Methodology': 'فريق ومنهجية مثقال تك',
  'We build digital solutions that unite school administration, student monitoring, and family communication in one platform.': 'نطوّر حلولًا رقمية تجعل إدارة المدرسة ومتابعة الطالب والتواصل مع الأسرة في منصة واحدة.',
  'dashboard.title': 'لوحة التحكم',
  'attendance.present': 'حاضر',
  'attendance.absent': 'غائب',
  'attendance.late': 'متأخر',
  'status.active': 'نشط',
  'status.pending': 'معلق',
  'status.paid': 'مدفوع',
  'status.overdue': 'متأخر',
  'common.save': 'حفظ التغييرات',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.search': 'بحث',
  'common.filter': 'تصفية',
  'common.loading': 'جارٍ التحميل...',
  'common.noData': 'لا توجد بيانات متاحة',
  'View and manage school subscriptions and financial transactions within the platform.': 'عرض وإدارة اشتراكات المدارس والمعاملات المالية داخل المنصة.'
};

for (const [k, v] of Object.entries(additionalKeys)) {
  entries.set(k, v);
}

const targetDir = path.join(__dirname, '../src/translations');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function escapeStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function getEnglishValue(k) {
  if (k === 'dashboard.title') return 'Dashboard';
  if (k === 'attendance.present') return 'Present';
  if (k === 'attendance.absent') return 'Absent';
  if (k === 'attendance.late') return 'Late';
  if (k === 'status.active') return 'Active';
  if (k === 'status.pending') return 'Pending';
  if (k === 'status.paid') return 'Paid';
  if (k === 'status.overdue') return 'Overdue';
  if (k === 'currency.yer') return 'YER';
  if (k === 'currency.sar') return 'SAR';
  if (k === 'currency.usd') return '$';
  if (k === 'common.save') return 'Save Changes';
  if (k === 'common.cancel') return 'Cancel';
  if (k === 'common.delete') return 'Delete';
  if (k === 'common.edit') return 'Edit';
  if (k === 'common.search') return 'Search';
  if (k === 'common.filter') return 'Filter';
  if (k === 'common.loading') return 'Loading...';
  if (k === 'common.noData') return 'No data available';
  return k;
}

let out = `export type Language = 'en' | 'ar';\n\n`;

out += `export const enTranslations: Record<string, string> = {\n`;
for (const [k] of entries.entries()) {
  const enVal = getEnglishValue(k);
  out += `  '${escapeStr(k)}': '${escapeStr(enVal)}',\n`;
}
out += `};\n\n`;

out += `export const arTranslations: Record<string, string> = {\n`;
for (const [k, v] of entries.entries()) {
  out += `  '${escapeStr(k)}': '${escapeStr(v)}',\n`;
}
out += `};\n\n`;

out += `export const arToEnMap: Record<string, string> = {\n`;
for (const [k, v] of entries.entries()) {
  const enVal = getEnglishValue(k);
  out += `  '${escapeStr(v)}': '${escapeStr(enVal)}',\n`;
}
out += `};\n\n`;

out += `export const translations = {\n  en: enTranslations,\n  ar: arTranslations,\n};\n`;

fs.writeFileSync(path.join(targetDir, 'index.ts'), out, 'utf8');
console.log('Successfully created src/translations/index.ts with ' + entries.size + ' bilingual keys!');
