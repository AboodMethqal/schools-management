import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { DEMO_ACCOUNTS, DEMO_SCHOOL_ID } from '../src/lib/demo-accounts';

const rawUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.DATABASE_URL || 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
const adapter = new PrismaLibSql({ url: rawUrl, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting Methqal Tech Database Seeding (SQLite Local Demo)...');

  // 1. School
  const school = await prisma.school.upsert({
    where: { id: DEMO_SCHOOL_ID },
    update: {
      schoolName: 'مدرسة مثقال النموذجية الحديثة',
      slug: 'methqal-model-school',
      schoolEmail: 'contact@methqal.tech',
      phone: '+967 1 234 567',
      address: 'صنعاء، الجمهورية اليمنية',
      plan: 'pro',
      duration: '12',
      schoolCategory: 'combined',
      expectedStudents: 450,
      registrationId: 'MTH-SCH-2026-001',
      language: 'arabic',
    },
    create: {
      id: DEMO_SCHOOL_ID,
      schoolName: 'مدرسة مثقال النموذجية الحديثة',
      slug: 'methqal-model-school',
      schoolEmail: 'contact@methqal.tech',
      phone: '+967 1 234 567',
      address: 'صنعاء، الجمهورية اليمنية',
      plan: 'pro',
      duration: '12',
      schoolCategory: 'combined',
      expectedStudents: 450,
      registrationId: 'MTH-SCH-2026-001',
      language: 'arabic',
    },
  });
  console.log('✅ School seeded:', school.schoolName);

  // 2. Demo Users (Super Admin, Principal, Teacher, Student, Parent, Accountant)
  for (const acc of Object.values(DEMO_ACCOUNTS)) {
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        authUserId: acc.authUserId,
        name: acc.name,
        role: acc.role,
        schoolId: acc.schoolId || null,
        status: 'active',
      },
      create: {
        id: acc.id,
        authUserId: acc.authUserId,
        email: acc.email,
        name: acc.name,
        role: acc.role,
        schoolId: acc.schoolId || null,
        status: 'active',
      },
    });
    console.log(`✅ User seeded: [${acc.role}] ${acc.email}`);
  }

  // Child 2 User (Sara Ahmed)
  const userSara = await prisma.user.upsert({
    where: { email: 'sara@methqal.tech' },
    update: {
      name: 'سارة أحمد خالد',
      role: 'student',
      schoolId: DEMO_SCHOOL_ID,
      status: 'active',
    },
    create: {
      id: 'demo-user-sara',
      authUserId: 'demo-auth-sara',
      email: 'sara@methqal.tech',
      name: 'سارة أحمد خالد',
      role: 'student',
      schoolId: DEMO_SCHOOL_ID,
      status: 'active',
    },
  });

  // Additional Students for realistic class rosters
  const classmatesData = [
    { id: 'usr-student-zaid', email: 'zaid@methqal.tech', name: 'زيد وليد الحمادي' },
    { id: 'usr-student-fatima', email: 'fatima@methqal.tech', name: 'فاطمة مروان الصبري' },
    { id: 'usr-student-khalid', email: 'khalid@methqal.tech', name: 'خالد عبد الرحمن النهمي' },
    { id: 'usr-student-reem', email: 'reem@methqal.tech', name: 'ريم طارق الأهدل' },
  ];

  for (const cm of classmatesData) {
    await prisma.user.upsert({
      where: { email: cm.email },
      update: { name: cm.name, role: 'student', schoolId: DEMO_SCHOOL_ID },
      create: {
        id: cm.id,
        authUserId: `auth-${cm.id}`,
        email: cm.email,
        name: cm.name,
        role: 'student',
        schoolId: DEMO_SCHOOL_ID,
        status: 'active',
      },
    });
  }

  // 3. Classes & Sections
  const class10A = await prisma.class.upsert({
    where: { id: 'class-10-a' },
    update: { name: 'Class 10 - A', schoolId: DEMO_SCHOOL_ID },
    create: { id: 'class-10-a', name: 'Class 10 - A', schoolId: DEMO_SCHOOL_ID },
  });

  const class8B = await prisma.class.upsert({
    where: { id: 'class-8-b' },
    update: { name: 'Class 8 - B', schoolId: DEMO_SCHOOL_ID },
    create: { id: 'class-8-b', name: 'Class 8 - B', schoolId: DEMO_SCHOOL_ID },
  });

  const class9A = await prisma.class.upsert({
    where: { id: 'class-9-a' },
    update: { name: 'Class 9 - A', schoolId: DEMO_SCHOOL_ID },
    create: { id: 'class-9-a', name: 'Class 9 - A', schoolId: DEMO_SCHOOL_ID },
  });

  const sec10A = await prisma.section.upsert({
    where: { id: 'sec-10-a' },
    update: { name: 'الشعبة أ', classId: class10A.id },
    create: { id: 'sec-10-a', name: 'الشعبة أ', classId: class10A.id },
  });

  const sec8B = await prisma.section.upsert({
    where: { id: 'sec-8-b' },
    update: { name: 'الشعبة ب', classId: class8B.id },
    create: { id: 'sec-8-b', name: 'الشعبة ب', classId: class8B.id },
  });

  console.log('✅ Classes and Sections seeded');

  // 4. Subjects
  const subjectsData = [
    { id: 'sub-math-10', name: 'الرياضيات (Mathematics)', code: 'MATH-10', classId: class10A.id },
    { id: 'sub-phys-10', name: 'الفيزياء (Physics)', code: 'PHYS-10', classId: class10A.id },
    { id: 'sub-chem-10', name: 'الكيمياء (Chemistry)', code: 'CHEM-10', classId: class10A.id },
    { id: 'sub-eng-10', name: 'اللغة الإنجليزية (English)', code: 'ENG-10', classId: class10A.id },
    { id: 'sub-ar-10', name: 'اللغة العربية (Arabic)', code: 'AR-10', classId: class10A.id },
    { id: 'sub-islamic-10', name: 'التربية الإسلامية (Islamic)', code: 'ISL-10', classId: class10A.id },
    { id: 'sub-cs-10', name: 'تقنية المعلومات (CS)', code: 'CS-10', classId: class10A.id },

    { id: 'sub-math-8', name: 'الرياضيات (Mathematics)', code: 'MATH-8', classId: class8B.id },
    { id: 'sub-sci-8', name: 'العلوم العامة (Science)', code: 'SCI-8', classId: class8B.id },
    { id: 'sub-eng-8', name: 'اللغة الإنجليزية (English)', code: 'ENG-8', classId: class8B.id },
    { id: 'sub-ar-8', name: 'اللغة العربية (Arabic)', code: 'AR-8', classId: class8B.id },
    { id: 'sub-soc-8', name: 'الدراسات الاجتماعية (Social)', code: 'SOC-8', classId: class8B.id },
  ];

  for (const s of subjectsData) {
    await prisma.subject.upsert({
      where: { id: s.id },
      update: { name: s.name, code: s.code, classId: s.classId, schoolId: DEMO_SCHOOL_ID },
      create: { id: s.id, name: s.name, code: s.code, classId: s.classId, schoolId: DEMO_SCHOOL_ID },
    });
  }
  console.log('✅ Subjects seeded');

  // 5. Teacher Profile
  const teacherMohammed = await prisma.teacher.upsert({
    where: { teacherId: 'TCH-2026-05' },
    update: {
      phone: '+967 777 222 333',
      designation: 'معلم أول الرياضيات والفيزياء',
      department: 'قسم العلوم الطبيعية والرياضيات',
      qualification: 'ماجستير في طرق تدريس الرياضيات',
      assignedClasses: 'Class 10 - A,Class 8 - B,Class 9 - A',
      presentAddress: 'حي الأندلس، صنعاء',
    },
    create: {
      id: 'teacher-mohammed-01',
      teacherId: 'TCH-2026-05',
      phone: '+967 777 222 333',
      dateOfBirth: new Date('1988-06-12'),
      gender: 'ذكر',
      designation: 'معلم أول الرياضيات والفيزياء',
      department: 'قسم العلوم الطبيعية والرياضيات',
      qualification: 'ماجستير في طرق تدريس الرياضيات',
      joiningDate: new Date('2021-09-01'),
      salary: 450000,
      presentAddress: 'حي الأندلس، صنعاء',
      schoolId: DEMO_SCHOOL_ID,
      userId: DEMO_ACCOUNTS.teacher.id,
      assignedClasses: 'Class 10 - A,Class 8 - B,Class 9 - A',
    },
  });

  // Link Teacher to Subjects
  await prisma.teacherSubject.upsert({
    where: { teacherId_subjectId: { teacherId: teacherMohammed.id, subjectId: 'sub-math-10' } },
    update: {},
    create: { teacherId: teacherMohammed.id, subjectId: 'sub-math-10' },
  });
  await prisma.teacherSubject.upsert({
    where: { teacherId_subjectId: { teacherId: teacherMohammed.id, subjectId: 'sub-phys-10' } },
    update: {},
    create: { teacherId: teacherMohammed.id, subjectId: 'sub-phys-10' },
  });
  await prisma.teacherSubject.upsert({
    where: { teacherId_subjectId: { teacherId: teacherMohammed.id, subjectId: 'sub-math-8' } },
    update: {},
    create: { teacherId: teacherMohammed.id, subjectId: 'sub-math-8' },
  });
  console.log('✅ Teacher & subjects linked');

  // 6. Students (Omar Ahmed - Grade 10 & Sarah Ahmed - Grade 8)
  const studentOmar = await prisma.student.upsert({
    where: { id: 'student-omar-01' },
    update: {
      currentClass: 'Class 10 - A',
      sectionName: 'أ',
      sectionId: sec10A.id,
      rollNo: 101,
      fatherName: 'أحمد خالد العلي',
      guardianPhone: '+967 777 000 111',
      email: 'student@methqal.tech',
    },
    create: {
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
      sectionId: sec10A.id,
      rollNo: 101,
      session: '2025/2026',
      admissionDate: new Date('2022-09-01'),
      fatherName: 'أحمد خالد العلي',
      motherName: 'فاطمة محمد',
      guardianPhone: '+967 777 000 111',
      email: 'student@methqal.tech',
      presentAddress: 'شارع حدة، صنعاء',
      schoolId: DEMO_SCHOOL_ID,
      isActive: true,
    },
  });

  const studentSara = await prisma.student.upsert({
    where: { id: 'student-sara-02' },
    update: {
      currentClass: 'Class 8 - B',
      sectionName: 'ب',
      sectionId: sec8B.id,
      rollNo: 102,
      fatherName: 'أحمد خالد العلي',
      guardianPhone: '+967 777 000 111',
      email: 'sara@methqal.tech',
    },
    create: {
      id: 'student-sara-02',
      userId: userSara.id,
      registrationNo: 'REG-2026-102',
      firstName: 'سارة',
      lastName: 'أحمد خالد',
      dateOfBirth: new Date('2011-08-20'),
      gender: 'أنثى',
      bloodGroup: 'A+',
      religion: 'الإسلام',
      currentClass: 'Class 8 - B',
      sectionName: 'ب',
      sectionId: sec8B.id,
      rollNo: 102,
      session: '2025/2026',
      admissionDate: new Date('2023-09-01'),
      fatherName: 'أحمد خالد العلي',
      motherName: 'فاطمة محمد',
      guardianPhone: '+967 777 000 111',
      email: 'sara@methqal.tech',
      presentAddress: 'شارع حدة، صنعاء',
      schoolId: DEMO_SCHOOL_ID,
      isActive: true,
    },
  });

  // Classmate student records
  await prisma.student.upsert({
    where: { id: 'student-zaid-03' },
    update: { currentClass: 'Class 10 - A', sectionName: 'أ', sectionId: sec10A.id },
    create: {
      id: 'student-zaid-03',
      userId: 'usr-student-zaid',
      registrationNo: 'REG-2026-103',
      firstName: 'زيد',
      lastName: 'وليد الحمادي',
      dateOfBirth: new Date('2009-01-10'),
      gender: 'ذكر',
      currentClass: 'Class 10 - A',
      sectionName: 'أ',
      sectionId: sec10A.id,
      rollNo: 103,
      session: '2025/2026',
      fatherName: 'وليد الحمادي',
      motherName: 'منى صالح',
      guardianPhone: '+967 777 333 444',
      presentAddress: 'صنعاء',
      schoolId: DEMO_SCHOOL_ID,
      isActive: true,
    },
  });

  await prisma.student.upsert({
    where: { id: 'student-fatima-04' },
    update: { currentClass: 'Class 10 - A', sectionName: 'أ', sectionId: sec10A.id },
    create: {
      id: 'student-fatima-04',
      userId: 'usr-student-fatima',
      registrationNo: 'REG-2026-104',
      firstName: 'فاطمة',
      lastName: 'مروان الصبري',
      dateOfBirth: new Date('2009-07-22'),
      gender: 'أنثى',
      currentClass: 'Class 10 - A',
      sectionName: 'أ',
      sectionId: sec10A.id,
      rollNo: 104,
      session: '2025/2026',
      fatherName: 'مروان الصبري',
      motherName: 'أمل عبد الله',
      guardianPhone: '+967 777 444 555',
      presentAddress: 'صنعاء',
      schoolId: DEMO_SCHOOL_ID,
      isActive: true,
    },
  });
  console.log('✅ Students seeded: Omar (Grade 10) & Sarah (Grade 8)');

  // 7. Parent Profile & ParentStudent Links (TWO CHILDREN)
  const parentAhmed = await prisma.parent.upsert({
    where: { id: 'parent-ahmed-01' },
    update: {
      name: 'أحمد خالد العلي',
      phone: '+967 777 000 111',
      email: 'parent@methqal.tech',
      studentId: studentOmar.id, // legacy link
    },
    create: {
      id: 'parent-ahmed-01',
      name: 'أحمد خالد العلي',
      phone: '+967 777 000 111',
      email: 'parent@methqal.tech',
      userId: DEMO_ACCOUNTS.parent.id,
      studentId: studentOmar.id,
    },
  });

  await prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: parentAhmed.id, studentId: studentOmar.id } },
    update: {},
    create: { parentId: parentAhmed.id, studentId: studentOmar.id },
  });

  await prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: parentAhmed.id, studentId: studentSara.id } },
    update: {},
    create: { parentId: parentAhmed.id, studentId: studentSara.id },
  });
  console.log('✅ Parent linked to 2 children (Omar & Sarah)');

  // 8. Attendance Records
  const attDaysOmar = [
    { date: new Date('2026-10-01'), status: 'PRESENT' },
    { date: new Date('2026-10-02'), status: 'PRESENT' },
    { date: new Date('2026-10-03'), status: 'PRESENT' },
    { date: new Date('2026-10-04'), status: 'LATE' },
    { date: new Date('2026-10-05'), status: 'PRESENT' },
    { date: new Date('2026-10-06'), status: 'PRESENT' },
    { date: new Date('2026-10-07'), status: 'PRESENT' },
    { date: new Date('2026-10-08'), status: 'PRESENT' },
  ];

  for (let i = 0; i < attDaysOmar.length; i++) {
    await prisma.attendance.upsert({
      where: { id: `att-omar-${i + 1}` },
      update: { status: attDaysOmar[i].status, classId: class10A.id },
      create: {
        id: `att-omar-${i + 1}`,
        studentId: studentOmar.id,
        schoolId: DEMO_SCHOOL_ID,
        teacherId: teacherMohammed.id,
        classId: class10A.id,
        date: attDaysOmar[i].date,
        status: attDaysOmar[i].status,
      },
    });
  }

  const attDaysSara = [
    { date: new Date('2026-10-01'), status: 'PRESENT' },
    { date: new Date('2026-10-02'), status: 'PRESENT' },
    { date: new Date('2026-10-03'), status: 'PRESENT' },
    { date: new Date('2026-10-04'), status: 'PRESENT' },
    { date: new Date('2026-10-05'), status: 'ABSENT' },
    { date: new Date('2026-10-06'), status: 'PRESENT' },
    { date: new Date('2026-10-07'), status: 'PRESENT' },
    { date: new Date('2026-10-08'), status: 'PRESENT' },
  ];

  for (let i = 0; i < attDaysSara.length; i++) {
    await prisma.attendance.upsert({
      where: { id: `att-sara-${i + 1}` },
      update: { status: attDaysSara[i].status, classId: class8B.id },
      create: {
        id: `att-sara-${i + 1}`,
        studentId: studentSara.id,
        schoolId: DEMO_SCHOOL_ID,
        classId: class8B.id,
        date: attDaysSara[i].date,
        status: attDaysSara[i].status,
      },
    });
  }
  console.log('✅ Attendance seeded for Omar and Sarah');

  // 9. Exams & Academic Results
  const examMidterm10 = await prisma.exam.upsert({
    where: { id: 'exam-midterm-10' },
    update: { name: 'اختبار منتصف الفصل الأول 2026', examType: 'Midterm', classId: class10A.id },
    create: {
      id: 'exam-midterm-10',
      name: 'اختبار منتصف الفصل الأول 2026',
      examType: 'Midterm',
      classId: class10A.id,
      schoolId: DEMO_SCHOOL_ID,
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-25'),
    },
  });

  const examMidterm8 = await prisma.exam.upsert({
    where: { id: 'exam-midterm-8' },
    update: { name: 'اختبار منتصف الفصل الأول - الصف الثامن', examType: 'Midterm', classId: class8B.id },
    create: {
      id: 'exam-midterm-8',
      name: 'اختبار منتصف الفصل الأول - الصف الثامن',
      examType: 'Midterm',
      classId: class8B.id,
      schoolId: DEMO_SCHOOL_ID,
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-25'),
    },
  });

  // Results for Omar (Grade 10)
  const resultsOmar = [
    { id: 'res-omar-math', subject: 'Mathematics (الرياضيات)', marks: 95, examId: examMidterm10.id, subId: 'sub-math-10' },
    { id: 'res-omar-phys', subject: 'Physics (الفيزياء)', marks: 88, examId: examMidterm10.id, subId: 'sub-phys-10' },
    { id: 'res-omar-chem', subject: 'Chemistry (الكيمياء)', marks: 92, examId: examMidterm10.id, subId: 'sub-chem-10' },
    { id: 'res-omar-eng', subject: 'English (اللغة الإنجليزية)', marks: 90, examId: examMidterm10.id, subId: 'sub-eng-10' },
    { id: 'res-omar-ar', subject: 'Arabic (اللغة العربية)', marks: 96, examId: examMidterm10.id, subId: 'sub-ar-10' },
  ];

  for (const r of resultsOmar) {
    await prisma.result.upsert({
      where: { id: r.id },
      update: { marks: r.marks, examType: 'اختبار منتصف الفصل' },
      create: {
        id: r.id,
        studentId: studentOmar.id,
        schoolId: DEMO_SCHOOL_ID,
        teacherId: teacherMohammed.id,
        classId: class10A.id,
        examId: r.examId,
        subjectId: r.subId,
        subject: r.subject,
        marks: r.marks,
        examType: 'اختبار منتصف الفصل',
      },
    });
  }

  // Results for Sarah (Grade 8)
  const resultsSara = [
    { id: 'res-sara-math', subject: 'Mathematics (الرياضيات)', marks: 98, examId: examMidterm8.id, subId: 'sub-math-8' },
    { id: 'res-sara-sci', subject: 'Science (العلوم العامة)', marks: 94, examId: examMidterm8.id, subId: 'sub-sci-8' },
    { id: 'res-sara-eng', subject: 'English (اللغة الإنجليزية)', marks: 97, examId: examMidterm8.id, subId: 'sub-eng-8' },
    { id: 'res-sara-ar', subject: 'Arabic (اللغة العربية)', marks: 95, examId: examMidterm8.id, subId: 'sub-ar-8' },
    { id: 'res-sara-soc', subject: 'Social Studies (اجتماعيات)', marks: 92, examId: examMidterm8.id, subId: 'sub-soc-8' },
  ];

  for (const r of resultsSara) {
    await prisma.result.upsert({
      where: { id: r.id },
      update: { marks: r.marks, examType: 'اختبار منتصف الفصل' },
      create: {
        id: r.id,
        studentId: studentSara.id,
        schoolId: DEMO_SCHOOL_ID,
        classId: class8B.id,
        examId: r.examId,
        subjectId: r.subId,
        subject: r.subject,
        marks: r.marks,
        examType: 'اختبار منتصف الفصل',
      },
    });
  }
  console.log('✅ Academic results seeded for Omar and Sarah');

  // 10. Class Schedules
  const scheduleData = [
    { id: 'sch-10-sun-1', classId: class10A.id, subjectId: 'sub-math-10', day: 'الأحد (Sunday)', startTime: '08:00', endTime: '09:00' },
    { id: 'sch-10-sun-2', classId: class10A.id, subjectId: 'sub-phys-10', day: 'الأحد (Sunday)', startTime: '09:10', endTime: '10:10' },
    { id: 'sch-10-mon-1', classId: class10A.id, subjectId: 'sub-eng-10', day: 'الإثنين (Monday)', startTime: '08:00', endTime: '09:00' },
    { id: 'sch-10-mon-2', classId: class10A.id, subjectId: 'sub-math-10', day: 'الإثنين (Monday)', startTime: '09:10', endTime: '10:10' },
    { id: 'sch-10-tue-1', classId: class10A.id, subjectId: 'sub-chem-10', day: 'الثلاثاء (Tuesday)', startTime: '08:00', endTime: '09:00' },
    { id: 'sch-10-wed-1', classId: class10A.id, subjectId: 'sub-cs-10', day: 'الأربعاء (Wednesday)', startTime: '08:00', endTime: '09:00' },

    { id: 'sch-8-sun-1', classId: class8B.id, subjectId: 'sub-math-8', day: 'الأحد (Sunday)', startTime: '08:00', endTime: '09:00' },
    { id: 'sch-8-sun-2', classId: class8B.id, subjectId: 'sub-sci-8', day: 'الأحد (Sunday)', startTime: '09:10', endTime: '10:10' },
    { id: 'sch-8-mon-1', classId: class8B.id, subjectId: 'sub-eng-8', day: 'الإثنين (Monday)', startTime: '08:00', endTime: '09:00' },
    { id: 'sch-8-tue-1', classId: class8B.id, subjectId: 'sub-ar-8', day: 'الثلاثاء (Tuesday)', startTime: '08:00', endTime: '09:00' },
  ];

  for (const sc of scheduleData) {
    await prisma.classSchedule.upsert({
      where: { id: sc.id },
      update: { day: sc.day, startTime: sc.startTime, endTime: sc.endTime },
      create: {
        id: sc.id,
        classId: sc.classId,
        subjectId: sc.subjectId,
        teacherId: teacherMohammed.id,
        day: sc.day,
        startTime: sc.startTime,
        endTime: sc.endTime,
      },
    });
  }
  console.log('✅ Class schedules seeded');

  // 11. Fees, Payments & Expenses (Accountant & Parent data)
  const fee10Term1 = await prisma.fee.upsert({
    where: { id: 'fee-10-term1' },
    update: { amount: 150000, title: 'القسط الدراسي الأول - الصف العاشر' },
    create: {
      id: 'fee-10-term1',
      title: 'القسط الدراسي الأول - الصف العاشر',
      amount: 150000,
      classId: class10A.id,
      schoolId: DEMO_SCHOOL_ID,
    },
  });

  const fee8Term1 = await prisma.fee.upsert({
    where: { id: 'fee-8-term1' },
    update: { amount: 130000, title: 'القسط الدراسي الأول - الصف الثامن' },
    create: {
      id: 'fee-8-term1',
      title: 'القسط الدراسي الأول - الصف الثامن',
      amount: 130000,
      classId: class8B.id,
      schoolId: DEMO_SCHOOL_ID,
    },
  });

  const feeBus = await prisma.fee.upsert({
    where: { id: 'fee-bus-term1' },
    update: { amount: 45000, title: 'رسوم النقل المدرسي (الباص) - الفصل الأول' },
    create: {
      id: 'fee-bus-term1',
      title: 'رسوم النقل المدرسي (الباص) - الفصل الأول',
      amount: 45000,
      classId: class10A.id,
      schoolId: DEMO_SCHOOL_ID,
    },
  });

  // Payments
  await prisma.payment.upsert({
    where: { transactionId: 'TXN-MTH-2026-901' },
    update: { amount: 150000, status: 'SUCCESS' },
    create: {
      id: 'pay-omar-01',
      transactionId: 'TXN-MTH-2026-901',
      amount: 150000,
      currency: 'YER',
      status: 'SUCCESS',
      studentId: studentOmar.id,
      schoolId: DEMO_SCHOOL_ID,
      feeId: fee10Term1.id,
      feeCategory: 'القسط الدراسي الأول',
      method: 'سداد نقدي / شيك بنكي',
      customerName: 'أحمد خالد العلي',
      customerEmail: 'parent@methqal.tech',
      customerPhone: '+967 777 000 111',
    },
  });

  await prisma.payment.upsert({
    where: { transactionId: 'TXN-MTH-2026-902' },
    update: { amount: 130000, status: 'SUCCESS' },
    create: {
      id: 'pay-sara-01',
      transactionId: 'TXN-MTH-2026-902',
      amount: 130000,
      currency: 'YER',
      status: 'SUCCESS',
      studentId: studentSara.id,
      schoolId: DEMO_SCHOOL_ID,
      feeId: fee8Term1.id,
      feeCategory: 'القسط الدراسي الأول',
      method: 'تحويل عبر الحساب المدرسي',
      customerName: 'أحمد خالد العلي',
      customerEmail: 'parent@methqal.tech',
      customerPhone: '+967 777 000 111',
    },
  });

  await prisma.payment.upsert({
    where: { transactionId: 'TXN-MTH-2026-903' },
    update: { amount: 45000, status: 'SUCCESS' },
    create: {
      id: 'pay-omar-bus',
      transactionId: 'TXN-MTH-2026-903',
      amount: 45000,
      currency: 'YER',
      status: 'SUCCESS',
      studentId: studentOmar.id,
      schoolId: DEMO_SCHOOL_ID,
      feeId: feeBus.id,
      feeCategory: 'رسوم النقل المدرسي',
      method: 'نقداً',
      customerName: 'أحمد خالد العلي',
      customerEmail: 'parent@methqal.tech',
    },
  });

  // Expenses
  const expensesList = [
    { id: 'exp-salaries-sep', title: 'رواتب الكادر التعليمي والإداري - سبتمبر', category: 'Salaries', amount: 3450000, date: new Date('2026-09-30') },
    { id: 'exp-labs-tech', title: 'تجهيزات معمل الحاسوب والطاقة الشمسية', category: 'Equipment', amount: 1200000, date: new Date('2026-10-02') },
    { id: 'exp-maintenance', title: 'صيانة وتجهيز القاعات والمرافق التعليمية', category: 'Maintenance', amount: 380000, date: new Date('2026-10-05') },
    { id: 'exp-stationery', title: 'قرطاسية ومستلزمات الامتحانات النصفية', category: 'Stationery', amount: 210000, date: new Date('2026-10-06') },
  ];

  for (const exp of expensesList) {
    await prisma.expense.upsert({
      where: { id: exp.id },
      update: { amount: exp.amount, title: exp.title },
      create: {
        id: exp.id,
        title: exp.title,
        category: exp.category,
        amount: exp.amount,
        transactionAt: exp.date,
        schoolId: DEMO_SCHOOL_ID,
        status: 'Paid',
      },
    });
  }
  console.log('✅ Fees, Payments, and Expenses seeded');

  // 12. Announcements
  const announcementsList = [
    {
      id: 'ann-01-welcome',
      title: 'انطلاق فعاليات الفصل الدراسي الجديد 2025 / 2026',
      content: 'ترحب إدارة مدرسة مثقال النموذجية بأبنائها وبناتها الطلاب وتتمنى لهم عاماً دراسياً حافلاً بالتميز والنجاح والابتكار.',
      priority: 'high',
      category: 'general',
      audience: 'all',
    },
    {
      id: 'ann-02-midterm',
      title: 'جدول اختبارات منتصف الفصل الأول لجميع المراحل',
      content: 'نحيطكم علماً بأن الاختبارات النصفية ستبدأ بمشيئة الله يوم الأحد القادم. نرجو من أولياء الأمور الكرام متابعة أبنائهم وجداول المذاكرة.',
      priority: 'urgent',
      category: 'academic',
      audience: 'all',
    },
    {
      id: 'ann-03-parent-meeting',
      title: 'اجتماع مجلس الآباء والمعلمين الدوري',
      content: 'يسر المدرسة دعوة أولياء الأمور الكرام لحضور الاجتماع الدوري لمناقشة مستوى الطلاب وخطط التطوير الأكاديمي والأنشطة المدرسية.',
      priority: 'normal',
      category: 'events',
      audience: 'parents',
    },
  ];

  for (const ann of announcementsList) {
    await prisma.announcement.upsert({
      where: { id: ann.id },
      update: { title: ann.title, content: ann.content },
      create: {
        id: ann.id,
        title: ann.title,
        content: ann.content,
        audience: ann.audience,
        category: ann.category,
        priority: ann.priority,
        schoolId: DEMO_SCHOOL_ID,
        authorName: 'إدارة المدرسة',
        status: 'published',
      },
    });
  }
  console.log('✅ Announcements seeded');

  // 13. Notifications for each role
  const notificationsList = [
    {
      id: 'notif-admin-01',
      userId: DEMO_ACCOUNTS.admin.id,
      title: 'تقرير الحضور اليومي للمدرسة',
      message: 'بلغت نسبة الحضور الإجمالية اليوم 96.4% عبر جميع المراحل الدراسية.',
      type: 'academic',
      link: '/dashboard/principal/attendance',
    },
    {
      id: 'notif-teacher-01',
      userId: DEMO_ACCOUNTS.teacher.id,
      title: 'موعد رصد درجات الاختبار النصفي',
      message: 'يرجى استكمال رصد درجات مادة الرياضيات والفيزياء للصف العاشر قبل نهاية الأسبوع.',
      type: 'academic',
      link: '/dashboard/teacher/results',
    },
    {
      id: 'notif-student-01',
      userId: DEMO_ACCOUNTS.student.id,
      title: 'إعلان نتيجة اختبار الفيزياء',
      message: 'تهانينا يا عمر! لقد حصلت على 88/100 في الاختبار النصفي لمادة الفيزياء.',
      type: 'academic',
      link: '/dashboard/student/result',
    },
    {
      id: 'notif-parent-01',
      userId: DEMO_ACCOUNTS.parent.id,
      title: 'إشعار الحضور والنتائج الأكاديمية',
      message: 'تم تحديث سجل درجات وتقارير الحضور لكل من عمر وسارة للفصل الحالي.',
      type: 'academic',
      link: '/dashboard/parent',
    },
    {
      id: 'notif-accountant-01',
      userId: DEMO_ACCOUNTS.accountant.id,
      title: 'سداد دفعة جديدة للقسط الأول',
      message: 'تم تسجيل سداد إيصال مالي جديد بقيمة 150,000 ريال يمني لحساب الطالب عمر أحمد.',
      type: 'payment',
      link: '/dashboard/accountant/payments',
    },
  ];

  for (const n of notificationsList) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: { title: n.title, message: n.message },
      create: {
        id: n.id,
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        link: n.link,
      },
    });
  }
  console.log('✅ Notifications seeded');

  // 14. Study Materials
  await prisma.studyMaterial.upsert({
    where: { id: 'mat-math-10-ch1' },
    update: { title: 'ملخص وتدريبات الوحدة الأولى - الجبر والتحليل' },
    create: {
      id: 'mat-math-10-ch1',
      title: 'ملخص وتدريبات الوحدة الأولى - الجبر والتحليل',
      type: 'pdf',
      subject: 'Mathematics (الرياضيات)',
      class: 'Class 10 - A',
      description: 'مراجعة شاملة لأسئلة الاختبار النصفي مع نماذج إجابات نموذجية',
      attachmentUrl: '/assets/sample-notes.pdf',
      size: '2.4 MB',
      schoolId: DEMO_SCHOOL_ID,
      teacherId: teacherMohammed.id,
    },
  });

  // 15. System Config
  await prisma.systemConfig.upsert({
    where: { id: 'system_config' },
    update: {
      siteName: 'منصة مثقال تك لإدارة المدارس',
      siteSubtitle: 'النظام السحابي المتكامل للتحول الرقمي التعليمي',
      siteLogo: '/brand/methqal-tech-mark.jpg',
    },
    create: {
      id: 'system_config',
      siteName: 'منصة مثقال تك لإدارة المدارس',
      siteSubtitle: 'النظام السحابي المتكامل للتحول الرقمي التعليمي',
      siteLogo: '/brand/methqal-tech-mark.jpg',
    },
  });

  // 16. Subscription Plans
  const plansData = [
    {
      id: 'plan-basic',
      name: 'الخطة الأساسية (Basic)',
      price: '$150',
      duration: '1 Month',
      icon: 'Zap',
      color: 'blue',
      students: '200',
      teachers: '15',
      storage: '10 GB',
      modules: 'الطلاب,المعلمين,الحضور والغياب,الجداول,الإشعارات',
    },
    {
      id: 'plan-pro',
      name: 'الخطة المتقدمة (Pro)',
      price: '$350',
      duration: '1 Month',
      icon: 'Crown',
      color: 'purple',
      students: '600',
      teachers: '45',
      storage: '50 GB',
      modules: 'الطلاب,المعلمين,الحضور والغياب,الجداول,النتائج والدرجات,الرسوم والمدفوعات,بوابة أولياء الأمور,التقارير التحليلية',
    },
    {
      id: 'plan-enterprise',
      name: 'خطة المؤسسات (Enterprise)',
      price: '$750',
      duration: '1 Month',
      icon: 'Rocket',
      color: 'emerald',
      students: '2000',
      teachers: '150',
      storage: '250 GB',
      modules: 'جميع المميزات,دعم فني مخصص,نسخ احتياطي فوري,ربط API,تخصيص كامل للهوية,إدارة الفروع المتعددة',
    },
  ];

  for (const pl of plansData) {
    await prisma.plan.upsert({
      where: { id: pl.id },
      update: { name: pl.name, price: pl.price, modules: pl.modules },
      create: pl,
    });
  }
  console.log('✅ Subscription Plans seeded');

  console.log('🎉 Methqal Tech Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
