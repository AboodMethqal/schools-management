import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/accountant/settings/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

if (!c.includes('useLanguage')) {
  c = c.replace(
    "import { useAuth } from '@/hooks/useAuth';",
    "import { useAuth } from '@/hooks/useAuth';\nimport { useLanguage } from '@/context/LanguageProvider';"
  );
  c = c.replace(
    "export default function AccountantSettingsPage() {",
    "export default function AccountantSettingsPage() {\n    const { language } = useLanguage();\n    const isAr = language === 'ar';"
  );
}

// Translations
c = c.replace(
  /<ShieldCheck size=\{16\} \/>\s*Accountant/g,
  "<ShieldCheck size={16} />\n                        {isAr ? 'محاسب' : 'Accountant'}"
);
c = c.replace(
  />General Information<\/h3>/g,
  ">{isAr ? 'المعلومات العامة' : 'General Information'}</h3>"
);
c = c.replace(
  /label="Full Name"/g,
  'label={isAr ? "الاسم الكامل" : "Full Name"}'
);
c = c.replace(
  /label="Email Address"/g,
  'label={isAr ? "البريد الإلكتروني" : "Email Address"}'
);
c = c.replace(
  /tooltip="Email cannot be changed directly\."/g,
  'tooltip={isAr ? "لا يمكن تغيير البريد الإلكتروني مباشرة." : "Email cannot be changed directly."}'
);
c = c.replace(
  /\{updating \? "Saving Changes\.\.\." : "Save Changes"\}/g,
  '{updating ? (isAr ? "جارٍ الحفظ..." : "Saving Changes...") : (isAr ? "حفظ التغييرات" : "Save Changes")}'
);
c = c.replace(
  />Security & Password<\/h3>/g,
  ">{isAr ? 'الأمان وكلمة المرور' : 'Security & Password'}</h3>"
);
c = c.replace(
  /label="New Password"/g,
  'label={isAr ? "كلمة المرور الجديدة" : "New Password"}'
);
c = c.replace(
  /placeholder="Enter new password \(min 6 chars\)"/g,
  'placeholder={isAr ? "أدخل كلمة المرور الجديدة (6 أحرف على الأقل)" : "Enter new password (min 6 chars)"}'
);
c = c.replace(
  /label="Confirm New Password"/g,
  'label={isAr ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}'
);
c = c.replace(
  /placeholder="Re-enter to confirm"/g,
  'placeholder={isAr ? "أعد إدخال كلمة المرور للتأكيد" : "Re-enter to confirm"}'
);
c = c.replace(
  /\{updatingPassword \? "Updating\.\.\." : "Update Password"\}/g,
  '{updatingPassword ? (isAr ? "جارٍ التحديث..." : "Updating...") : (isAr ? "تحديث كلمة المرور" : "Update Password")}'
);

fs.writeFileSync(filePath, c, 'utf8');
console.log('Successfully localized accountant/settings/page.tsx');
