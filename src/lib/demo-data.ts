/**
 * Methqal Tech - Complete Demo Dataset with Real Relationships
 * بيانات تجريبية واقعية متكاملة العلاقات لمنصة مثقال تك
 */

import { DEMO_ACCOUNTS, DEMO_SCHOOL_ID } from './demo-accounts';

export const DEMO_SCHOOL = {
  id: DEMO_SCHOOL_ID,
  schoolName: 'مدرسة مثقال النموذجية الحديثة',
  slug: 'methqal-model-school',
  schoolEmail: 'contact@methqal-school.edu.ye',
  phone: '+967 1 234 567',
  address: 'صنعاء، الجمهورية اليمنية',
  plan: 'pro',
  duration: '12',
  schoolCategory: 'combined',
  expectedStudents: 450,
  registrationId: 'MTH-SCH-2026-001',
  language: 'arabic',
};

export const DEMO_CLASSES = [
  { id: 'class-10-a', name: 'Class 10 - A', schoolId: DEMO_SCHOOL_ID, grade: 'الصف العاشر' },
  { id: 'class-9-b', name: 'Class 9 - B', schoolId: DEMO_SCHOOL_ID, grade: 'الصف التاسع' },
  { id: 'class-8-b', name: 'Class 8 - B', schoolId: DEMO_SCHOOL_ID, grade: 'الصف الثامن' },
];

export const DEMO_SUBJECTS = [
  { id: 'sub-math-10', name: 'Mathematics (الرياضيات)', code: 'MATH-10', classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
  { id: 'sub-phys-10', name: 'Physics (الفيزياء)', code: 'PHYS-10', classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
  { id: 'sub-arab-10', name: 'Arabic Language (اللغة العربية)', code: 'ARAB-10', classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
  { id: 'sub-eng-10', name: 'English (اللغة الإنجليزية)', code: 'ENG-10', classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
  { id: 'sub-chem-10', name: 'Chemistry (الكيمياء)', code: 'CHEM-10', classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
];

export const DEMO_STUDENTS = [
  {
    id: 'student-omar-01',
    userId: DEMO_ACCOUNTS.student.id,
    registrationNo: 'REG-2026-101',
    firstName: 'عمر',
    lastName: 'أحمد خالد',
    dateOfBirth: new Date('2009-04-15'),
    gender: 'ذكر',
    bloodGroup: 'O+',
    religion: 'الإسلام',
    currentClass: 'Class 10 - A',
    sectionName: 'أ',
    rollNo: 101,
    session: '2025/2026',
    admissionDate: new Date('2022-09-01'),
    fatherName: 'أحمد خالد العلي',
    motherName: 'فاطمة محمد',
    guardianPhone: '+967 777 000 111',
    email: 'student@methqal.com',
    presentAddress: 'شارع حدة، صنعاء',
    schoolId: DEMO_SCHOOL_ID,
    isActive: true,
  },
  {
    id: 'student-sara-02',
    userId: 'demo-user-sara',
    registrationNo: 'REG-2026-102',
    firstName: 'سارة',
    lastName: 'أحمد خالد',
    dateOfBirth: new Date('2011-08-20'),
    gender: 'أنثى',
    bloodGroup: 'A+',
    religion: 'الإسلام',
    currentClass: 'Class 8 - B',
    sectionName: 'ب',
    rollNo: 102,
    session: '2025/2026',
    admissionDate: new Date('2023-09-01'),
    fatherName: 'أحمد خالد العلي',
    motherName: 'فاطمة محمد',
    guardianPhone: '+967 777 000 111',
    email: 'sara@methqal.com',
    presentAddress: 'شارع حدة، صنعاء',
    schoolId: DEMO_SCHOOL_ID,
    isActive: true,
  },
];

export const DEMO_TEACHER = {
  id: 'teacher-mohammed-01',
  teacherId: 'TCH-2026-05',
  phone: '+967 777 222 333',
  dateOfBirth: new Date('1988-06-12'),
  gender: 'ذكر',
  designation: 'معلم أول الرياضيات والفيزياء',
  department: 'قسم العلوم الطبيعية',
  qualification: 'ماجستير في طرق تدريس الرياضيات',
  joiningDate: new Date('2021-09-01'),
  salary: 450000,
  presentAddress: 'حي الاندلس، صنعاء',
  schoolId: DEMO_SCHOOL_ID,
  userId: DEMO_ACCOUNTS.teacher.id,
  assignedClasses: ['Class 10 - A', 'Class 9 - B'],
};

export const DEMO_PARENT = {
  id: 'parent-ahmed-01',
  name: 'أحمد خالد العلي',
  phone: '+967 777 000 111',
  email: 'parent@methqal.com',
  userId: DEMO_ACCOUNTS.parent.id,
  children: [
    { studentId: 'student-omar-01' },
    { studentId: 'student-sara-02' },
  ],
};

export const DEMO_ATTENDANCES = [
  { id: 'att-1', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-01'), status: 'PRESENT' },
  { id: 'att-2', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-02'), status: 'PRESENT' },
  { id: 'att-3', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-03'), status: 'PRESENT' },
  { id: 'att-4', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-04'), status: 'LATE' },
  { id: 'att-5', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-05'), status: 'PRESENT' },
  { id: 'att-6', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-01'), status: 'PRESENT' },
  { id: 'att-7', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-02'), status: 'PRESENT' },
  { id: 'att-8', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-03'), status: 'PRESENT' },
  { id: 'att-9', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-04'), status: 'PRESENT' },
  { id: 'att-10', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, date: new Date('2026-10-05'), status: 'PRESENT' },
];

export const DEMO_RESULTS = [
  { id: 'res-1', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, subject: 'Mathematics (الرياضيات)', marks: 95, examType: 'اختبار منتصف الفصل' },
  { id: 'res-2', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, subject: 'Physics (الفيزياء)', marks: 88, examType: 'اختبار منتصف الفصل' },
  { id: 'res-3', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, subject: 'Arabic Language (اللغة العربية)', marks: 92, examType: 'اختبار منتصف الفصل' },
  { id: 'res-4', studentId: 'student-omar-01', schoolId: DEMO_SCHOOL_ID, subject: 'English (اللغة الإنجليزية)', marks: 90, examType: 'اختبار منتصف الفصل' },
  { id: 'res-5', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, subject: 'Mathematics (الرياضيات)', marks: 98, examType: 'اختبار منتصف الفصل' },
  { id: 'res-6', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, subject: 'Science (العلوم)', marks: 94, examType: 'اختبار منتصف الفصل' },
  { id: 'res-7', studentId: 'student-sara-02', schoolId: DEMO_SCHOOL_ID, subject: 'Arabic Language (اللغة العربية)', marks: 96, examType: 'اختبار منتصف الفصل' },
];

export const DEMO_FEES = [
  { id: 'fee-1', title: 'القسط الدراسي الأول', amount: 150000, classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
  { id: 'fee-2', title: 'رسوم النقل المدرسي (الحافلة)', amount: 45000, classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
  { id: 'fee-3', title: 'رسوم الأنشطة والمختبرات', amount: 25000, classId: 'class-10-a', schoolId: DEMO_SCHOOL_ID },
];

export const DEMO_PAYMENTS = [
  {
    id: 'pay-1',
    transactionId: 'TXN-MTH-2026-901',
    amount: 150000,
    currency: 'YER',
    status: 'SUCCESS',
    studentId: 'student-omar-01',
    schoolId: DEMO_SCHOOL_ID,
    feeCategory: 'القسط الدراسي الأول',
    customerName: 'أحمد خالد العلي',
    customerEmail: 'parent@methqal.com',
    createdAt: new Date('2026-09-15'),
  },
  {
    id: 'pay-2',
    transactionId: 'TXN-MTH-2026-902',
    amount: 45000,
    currency: 'YER',
    status: 'SUCCESS',
    studentId: 'student-omar-01',
    schoolId: DEMO_SCHOOL_ID,
    feeCategory: 'رسوم النقل المدرسي',
    customerName: 'أحمد خالد العلي',
    customerEmail: 'parent@methqal.com',
    createdAt: new Date('2026-09-20'),
  },
];

export const DEMO_EXPENSES = [
  { id: 'exp-1', title: 'رواتب الكادر التعليمي - سبتمبر', category: 'Salaries', amount: 3200000, transactionAt: new Date('2026-09-30'), schoolId: DEMO_SCHOOL_ID, status: 'Paid' },
  { id: 'exp-2', title: 'صيانة معامل الحاسوب والعلوم', category: 'Maintenance', amount: 350000, transactionAt: new Date('2026-10-02'), schoolId: DEMO_SCHOOL_ID, status: 'Paid' },
  { id: 'exp-3', title: 'فواتير الطاقة والمياه', category: 'Utilities', amount: 180000, transactionAt: new Date('2026-10-04'), schoolId: DEMO_SCHOOL_ID, status: 'Paid' },
];

export const DEMO_NOTICES = [
  {
    id: 'not-1',
    title: 'جدول اختبارات منتصف الفصل الدراسي الأول',
    content: 'نود إحاطة أولياء الأمور والطلاب الكرام بأن الاختبارات ستبدأ يوم الأحد القادم وفق الجدول المعلن.',
    schoolId: DEMO_SCHOOL_ID,
    createdAt: new Date('2026-10-01'),
    priority: 'high',
  },
  {
    id: 'not-2',
    title: 'انطلاق معرض الإبداع العلمي والتقني 2026',
    content: 'يسر المدرسة الإعلان عن تنظيم المعرض السنوي للإبداع والمشاريع التقنية بمشاركة جميع المراحل.',
    schoolId: DEMO_SCHOOL_ID,
    createdAt: new Date('2026-10-03'),
    priority: 'normal',
  },
];
