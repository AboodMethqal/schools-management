import fs from 'fs';
import path from 'path';

const transPath = path.resolve(process.cwd(), 'src/translations/index.ts');
let content = fs.readFileSync(transPath, 'utf8');

const missingPairs: Record<string, string> = {
  'email': 'البريد الإلكتروني',
  'password': 'كلمة المرور',
  'Notifications Center': 'مركز الإشعارات',
  'Stay updated with school activities': 'ابقَ على اطلاع بأنشطة المدرسة',
  'All': 'الكل',
  'Unread': 'غير مقروءة',
  'Select a student to view academic profile, attendance, results, and evaluations.': 'اختر طالباً لعرض ملفه الأكاديمي وسجل الحضور والنتائج والتقييمات.',
  'Error': 'خطأ',
  'View all': 'عرض الكل',
  'total_students': 'إجمالي الطلاب',
  'loading': 'جارٍ التحميل',
  'Success': 'تم بنجاح',
  'Failed': 'فشل',
  'Automated Transactions': 'المعاملات الآلية',
  'Secure Checkout': 'دفع آمن',
  'Assigned Fees': 'الرسوم المقررة',
  'Custom Amount': 'مبلغ مخصص',
  'Detail Summary': 'ملخص التفاصيل',
  'Reference ID': 'الرقم المرجعي',
  'Total Payable': 'إجمالي المستحق',
  'Enter Custom Amount': 'أدخل مبلغاً مخصصاً',
  'Input the specific amount you wish to pay now.': 'أدخل المبلغ المحدد الذي ترغب في دفعه الآن.',
  'Please double check the amount before proceeding': 'يرجى التحقق من المبلغ قبل المتابعة',
  'Initiating Gateway...': 'جارٍ تهيئة بوابة الدفع...',
  'Payment Success!': 'تم الدفع بنجاح!',
  'Your transaction has been processed securely.': 'تمت معالجة معاملتك بأمان.',
  'Amount Paid': 'المبلغ المدفوع',
  'Download Receipt': 'تحميل الإيصال',
  'Payment Failed': 'فشلت عملية الدفع',
  'Retry Payment': 'إعادة المحاولة'
};

let arAdditions = '';
for (const [key, arVal] of Object.entries(missingPairs)) {
  const arPattern = `'${key.replace(/'/g, "\\'")}':`;
  // Check if it's in the second half of the file (arTranslations)
  const arSection = content.slice(content.indexOf('export const arTranslations'));
  if (!arSection.includes(arPattern)) {
    arAdditions += `  '${key.replace(/'/g, "\\'")}': '${arVal}',\n`;
  }
}

if (arAdditions) {
  content = content.replace(
    "'View and manage school subscriptions and financial transactions within the platform.': 'عرض وإدارة اشتراكات المدارس والمعاملات المالية داخل المنصة.',\n};",
    `'View and manage school subscriptions and financial transactions within the platform.': 'عرض وإدارة اشتراكات المدارس والمعاملات المالية داخل المنصة.',\n${arAdditions}};`
  );
}

fs.writeFileSync(transPath, content, 'utf8');
console.log('Inserted Arabic pairs successfully.');
