# مثقال تك | Methqal Tech — School Management Platform

منصة مدرسية متكاملة لإدارة المؤسسات التعليمية، الطلاب، المعلمين، أولياء الأمور، والمالية.  
A comprehensive, multi-tenant school management system built for scalable institutional administration.

---

## الأدوار المعتمدة والحسابات التجريبية (Demo Accounts)

تتضمن المنصة 6 أدوار رئيسية مع حسابات تجريبية مهيأة مسبقاً في قاعدة البيانات المحلية:

| الدور (Role) | البريد الإلكتروني (Email) | كلمة المرور (Password) | الصلاحيات والواجهة |
|---|---|---|---|
| **المشرف العام (Super Admin)** | `superadmin@methqal.tech` | `Admin@123456` | إدارة المدارس، فحص واعتماد طلبات الانضمام، الخطط، المعاملات، وإعدادات المنصة. |
| **مدير المدرسة (Principal)** | `principal@methqal.tech` | `Principal@123456` | إدارة المعلمين، الطلاب، الفصول، الحضور، النتائج، الإعلانات، وتقارير المدرسة. |
| **المعلم (Teacher)** | `teacher@methqal.tech` | `Teacher@123456` | رصد الحضور والغياب، إدخال الدرجات والنتائج، المواد الدراسية، والواجبات. |
| **الطالب (Student)** | `student@methqal.tech` | `Student@123456` | الجدول الدراسي، سجل الحضور، بطاقة النتائج والدرجات، وسداد الرسوم. |
| **ولي الأمر (Parent)** | `parent@methqal.tech` | `Parent@123456` | متابعة الأبناء (دعم التبديل بين أكثر من طالب)، طلبات الإجازة، النتائج، والرسوم. |
| **المحاسب (Accountant)** | `accountant@methqal.tech` | `Accountant@123456` | سندات القبض، إدارة المصروفات، متابعة المستحقات، وتقارير التدفق المالي. |

---

## مسار تسجيل المدارس الجديدة (New School Application Workflow)

1. **تقديم الطلب:** ينتقل الزائر إلى صفحة تسجيل الدخول ثم يضغط على "طلب انضمام مدرسة جديدة" (`/login/apply`).
2. **التحقق والحفظ:** يتم التحقق من صحة البيانات server-side، تشفير كلمة المرور بـ `bcrypt`، وتوليد رقم مرجع مميز (`APP-YYYY-XXXXX`).
3. **صندوق المشرف العام:** يظهر الطلب تلقائياً في صندوق طلبات المشرف العام (`/dashboard/super-admin/applications`).
4. **الموافقة والاعتماد:** عند اعتماد الطلب، يتم إنشاء سجل المدرسة وحساب المسؤول في عملية ذرية واحدة (`prisma.$transaction`).

---

## التشغيل المحلي (Local Development Setup)

1. **تثبيت الحزم:**
   ```bash
   npm install
   ```
2. **إعداد البيئة المحلية (`.env`):**
   ```env
   DATABASE_URL="file:./dev.db"
   NODE_ENV="development"
   ```
3. **توليد العميل ومزامنة قاعدة البيانات:**
   ```bash
   npm run db:generate
   npx prisma db push
   npm run seed
   ```
4. **تشغيل خادم التطوير:**
   ```bash
   npm run dev
   ```
   يفتح التطبيق على `http://localhost:3000`.

---

## التحقق والاختبارات الآلية (Verification & Tests)

- **فحص توافق اللغات والترجمة (1,249 زوج مترجم):**
  ```bash
  npm run check:translations
  ```
- **تشغيل اختبارات سير العمل الشاملة (12 اختباراً متكاملاً):**
  ```bash
  npm run test:workflows
  ```
- **بناء حزمة الإنتاج (Production Build):**
  ```bash
  npm run build
  ```

---

## بيئة التشغيل وقواعد البيانات (Database & Deployment Architecture)

- **محلياً (Local Development):**
  - يستخدم التطبيق محرك SQLite (`file:./dev.db`) تلقائياً عند غياب متغيرات Turso.
  - يعمل محلياً بكفاءة وسرعة دون الحاجة لأي اتصال خارجي.
  - لا يتأثر بأي تعديلات في السحابة.

- **سحابياً على Vercel مع Turso Cloud (Production Integration):**
  - قاعدة البيانات السحابية: **Turso libSQL (`database-cordovan-kettle`)**.
  - التكامل: Vercel Storage integration يربط تلقائياً `TURSO_DATABASE_URL` و `TURSO_AUTH_TOKEN`.
  - المحول والسائق: `@prisma/adapter-libsql` v7.10.0 مع `@libsql/client` v0.18.0.
  - المزامنة الآلية: يتم تطبيق الترحيلات ومخطط الجداول (32 جدولاً وفهرساً) تلقائياً أثناء خطوة الـ build عبر `scripts/migrate-turso.ts` بالإضافة إلى الفحص الذاتي أثناء التشغيل (`ensureDb`).
  - الاستمرارية (Persistence): كافة العمليات والبيانات مسجلة ومحفوظة بشكل دائم على السحابة، متوافقة تماماً مع معمارية Serverless بدون أي فقدان للبيانات.

---

## حقوق وهوية المنتج
- اسم المنتج: **مثقال تك — Methqal Tech**
- المصدر والرخص: راجع `SOURCE_NOTICE.md`.


