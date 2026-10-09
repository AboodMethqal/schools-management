import fs from 'fs';
import path from 'path';

// 1. accountant/expenses/page.tsx
const expPath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/accountant/expenses/page.tsx');
if (fs.existsSync(expPath)) {
  let c = fs.readFileSync(expPath, 'utf8');
  c = c.replace(/placeholder="Search expenses\.\.\."/g, 'placeholder={language === "ar" ? "البحث في المصروفات..." : "Search expenses..."}');
  c = c.replace(/>All Categories<\/option>/g, '>{language === "ar" ? "جميع الفئات" : "All Categories"}</option>');
  c = c.replace(/placeholder="Start"/g, 'placeholder={language === "ar" ? "البداية" : "Start"}');
  c = c.replace(/placeholder="End"/g, 'placeholder={language === "ar" ? "النهاية" : "End"}');
  c = c.replace(/placeholder="e\.g\. Monthly Electricity Bill"/g, 'placeholder={language === "ar" ? "مثال: فاتورة الكهرباء الشهرية" : "e.g. Monthly Electricity Bill"}');
  c = c.replace(/placeholder="Add any additional details\.\.\."/g, 'placeholder={language === "ar" ? "أضف أي تفاصيل إضافية..." : "Add any additional details..."}');
  fs.writeFileSync(expPath, c, 'utf8');
  console.log('Updated accountant/expenses/page.tsx');
}

// 2. accountant/fee-collection/page.tsx
const feePath = path.resolve(process.cwd(), 'src/app/(withDashboarLayout)/dashboard/accountant/fee-collection/page.tsx');
if (fs.existsSync(feePath)) {
  let c = fs.readFileSync(feePath, 'utf8');
  c = c.replace(/>Choose a class\.\.\.<\/option>/g, '>{language === "ar" ? "اختر صفاً..." : "Choose a class..."}</option>');
  c = c.replace(/>All Sections \(Whole Class\)<\/option>/g, '>{language === "ar" ? "جميع الشعب (كامل الصف)" : "All Sections (Whole Class)"}</option>');
  c = c.replace(/placeholder="e\.g\. Picnic Fee"/g, 'placeholder={language === "ar" ? "مثال: رسوم الرحلة المدرسية" : "e.g. Picnic Fee"}');
  c = c.replace(/>Important:<\/span>/g, '>{language === "ar" ? "تنبيه هام:" : "Important:"}</span>');
  fs.writeFileSync(feePath, c, 'utf8');
  console.log('Updated accountant/fee-collection/page.tsx');
}
