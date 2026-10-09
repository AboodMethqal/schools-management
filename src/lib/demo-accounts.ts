/**
 * Methqal Tech - Official Demo Accounts & Configurations
 * منصة مثقال تك - بيانات الحسابات التجريبية المعتمدة
 */

export interface DemoUserAccount {
  id: string;
  authUserId: string;
  email: string;
  name: string;
  nameEn: string;
  role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'accountant';
  schoolId?: string;
  password?: string;
  designation?: string;
  department?: string;
  details?: Record<string, any>;
}

export const DEMO_SCHOOL_ID = 'school-methqal-demo-01';

export const DEMO_ACCOUNTS: Record<string, DemoUserAccount> = {
  super_admin: {
    id: 'demo-user-super-admin',
    authUserId: 'demo-auth-super-admin',
    email: 'superadmin@methqal.tech',
    name: 'مدير عام المنصة - مثقال تك',
    nameEn: 'Super Admin - Methqal Tech',
    role: 'super_admin',
    password: 'Admin@123456',
    designation: 'مدير النظام السحابي',
    department: 'الإدارة العامة',
  },
  admin: {
    id: 'demo-user-principal',
    authUserId: 'demo-auth-principal',
    email: 'principal@methqal.tech',
    name: 'د. أحمد الشامي',
    nameEn: 'Dr. Ahmed Al-Shami',
    role: 'admin',
    schoolId: DEMO_SCHOOL_ID,
    password: 'Principal@123456',
    designation: 'مدير المدرسة',
    department: 'الإدارة المدرسية',
  },
  teacher: {
    id: 'demo-user-teacher',
    authUserId: 'demo-auth-teacher',
    email: 'teacher@methqal.tech',
    name: 'أ. محمد خالد الزبيري',
    nameEn: 'Mr. Mohammed Khaled',
    role: 'teacher',
    schoolId: DEMO_SCHOOL_ID,
    password: 'Teacher@123456',
    designation: 'معلم أول',
    department: 'قسم الرياضيات والعلوم',
  },
  student: {
    id: 'demo-user-student',
    authUserId: 'demo-auth-student',
    email: 'student@methqal.tech',
    name: 'عمر أحمد خالد',
    nameEn: 'Omar Ahmed Khaled',
    role: 'student',
    schoolId: DEMO_SCHOOL_ID,
    password: 'Student@123456',
    designation: 'طالب',
    department: 'الصف العاشر - أ',
  },
  parent: {
    id: 'demo-user-parent',
    authUserId: 'demo-auth-parent',
    email: 'parent@methqal.tech',
    name: 'أحمد خالد العلي',
    nameEn: 'Ahmed Khaled Al-Ali',
    role: 'parent',
    schoolId: DEMO_SCHOOL_ID,
    password: 'Parent@123456',
    designation: 'ولي أمر',
    department: 'مجلس الآباء',
  },
  accountant: {
    id: 'demo-user-accountant',
    authUserId: 'demo-auth-accountant',
    email: 'accountant@methqal.tech',
    name: 'سالم باعباد المحاسب',
    nameEn: 'Salim Ba-Abbad',
    role: 'accountant',
    schoolId: DEMO_SCHOOL_ID,
    password: 'Accountant@123456',
    designation: 'المسؤول المالي',
    department: 'قسم الحسابات والمالية',
  },
};

/**
 * Compatibility aliases for previous development credentials and domains
 */
export const DEMO_EMAIL_ALIASES: Record<string, string> = {
  'superadmin@methqal.com': 'superadmin@methqal.tech',
  'principal@methqal.com': 'principal@methqal.tech',
  'teacher@methqal.com': 'teacher@methqal.tech',
  'student@methqal.com': 'student@methqal.tech',
  'parent@methqal.com': 'parent@methqal.tech',
  'accountant@methqal.com': 'accountant@methqal.tech',
  'hero69@gmail.com': 'superadmin@methqal.tech',
  'hero@gmail.com': 'principal@methqal.tech',
  'teacher69@gmial.com': 'teacher@methqal.tech',
  'teacher69@gmail.com': 'teacher@methqal.tech',
  'puhujyku@gmail.com': 'student@methqal.tech',
  'parents69@gmail.com': 'parent@methqal.tech',
  'hero2@gmail.com': 'accountant@methqal.tech',
};

export function findDemoAccount(emailOrRole: string): DemoUserAccount | null {
  const normalized = emailOrRole.trim().toLowerCase();
  
  // By role key
  if (DEMO_ACCOUNTS[normalized]) {
    return DEMO_ACCOUNTS[normalized];
  }

  // By primary email
  for (const account of Object.values(DEMO_ACCOUNTS)) {
    if (account.email.toLowerCase() === normalized) {
      return account;
    }
  }

  // By alias email
  const resolvedAlias = DEMO_EMAIL_ALIASES[normalized];
  if (resolvedAlias) {
    for (const account of Object.values(DEMO_ACCOUNTS)) {
      if (account.email.toLowerCase() === resolvedAlias) {
        return account;
      }
    }
  }

  return null;
}
