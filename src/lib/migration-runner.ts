import { prisma } from './prisma';
import { DEMO_ACCOUNTS, DEMO_SCHOOL_ID } from './demo-accounts';
import bcrypt from 'bcryptjs';

// All DDL statements derived from prisma/migrations
export const MIGRATION_STATEMENTS = [
    `CREATE TABLE IF NOT EXISTS "School" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "schoolEmail" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "duration" TEXT NOT NULL DEFAULT '12',
    "schoolCategory" TEXT NOT NULL,
    "expectedStudents" INTEGER,
    "registrationId" TEXT NOT NULL,
    "facebookUrl" TEXT,
    "websiteUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'arabic',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
)`,
    `CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "transactionId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'YER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planName" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "method" TEXT,
    "valId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'all',
    "targetClass" TEXT,
    "category" TEXT NOT NULL DEFAULT 'academic',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "attachmentUrl" TEXT,
    "publishDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'published',
    "schoolId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Announcement_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registrationNo" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "religion" TEXT,
    "currentClass" TEXT,
    "sectionName" TEXT,
    "sectionId" TEXT,
    "rollNo" INTEGER NOT NULL,
    "session" TEXT NOT NULL,
    "admissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "guardianPhone" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "email" TEXT,
    "presentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "students_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "students_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "students" TEXT NOT NULL,
    "teachers" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "modules" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
)`,
    `CREATE TABLE IF NOT EXISTS "SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'low',
    "status" TEXT NOT NULL DEFAULT 'open',
    "schoolId" TEXT,
    "userEmail" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupportTicket_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "teachers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "religion" TEXT,
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "joiningDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "salary" REAL,
    "presentAddress" TEXT NOT NULL,
    "permanentAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedClasses" TEXT NOT NULL DEFAULT '',
    "assignedSections" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "teachers_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "teachers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "AcademicYear" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AcademicYear_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Class" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "numericName" INTEGER NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 40,
    "classId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Section_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Subject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'theory',
    "classId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subject_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "academicYearId" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "classId" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "totalMarks" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "Exam_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Exam_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Exam_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "ExamSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "examDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "roomNo" TEXT,
    "maxMarks" REAL NOT NULL DEFAULT 100,
    "passMarks" REAL NOT NULL DEFAULT 40,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExamSchedule_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExamSchedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "FeeType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeeType_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "FeeStructure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classId" TEXT NOT NULL,
    "feeTypeId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FeeStructure_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeeStructure_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeeStructure_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "FeeType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FeeStructure_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Fee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNo" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "feeStructureId" TEXT,
    "amount" REAL NOT NULL,
    "discount" REAL NOT NULL DEFAULT 0,
    "fine" REAL NOT NULL DEFAULT 0,
    "paidAmount" REAL NOT NULL DEFAULT 0,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Fee_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "FeeStructure" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Fee_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Fee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "LeaveApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvedById" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LeaveApplication_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LeaveApplication_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeaveApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "StudyMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudyMaterial_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudyMaterial_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudyMaterial_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StudyMaterial_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "TeacherNotice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "classId" TEXT,
    "sectionId" TEXT,
    "schoolId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeacherNotice_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TeacherNotice_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeacherNotice_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TeacherNotice_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authUserId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "schoolId" TEXT,
    "avatarUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "studentId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Attendance_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "marks" REAL NOT NULL,
    "grade" TEXT NOT NULL,
    "remarks" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Result_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Result_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Result_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "feeId" TEXT,
    "transactionId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "paidDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "Fee" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Payment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE SET NULL ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "TeacherSubject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeacherSubject_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Parent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "occupation" TEXT,
    "annualIncome" REAL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Parent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "ParentStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "relation" TEXT NOT NULL DEFAULT 'guardian',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ParentStudent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ParentStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "transactionAt" DATETIME NOT NULL,
    "recordedBy" TEXT,
    "receiptUrl" TEXT,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Expense_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER,
    "sentiment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Feedback_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Feedback_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
)`,
    `CREATE TABLE IF NOT EXISTS "QuizRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomCode" TEXT NOT NULL,
    "examId" TEXT,
    "teacherEmail" TEXT NOT NULL,
    "schoolId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
    `CREATE TABLE IF NOT EXISTS "QuizSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomCode" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "teacherEmail" TEXT NOT NULL,
    "selectedAnswer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "schoolId" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)`,
    `CREATE TABLE IF NOT EXISTS "SchoolApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "applicationNo" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "instituteCode" TEXT,
    "passwordHash" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "reviewedAt" DATETIME,
    "reviewedBy" TEXT,
    "reviewNotes" TEXT,
    "schoolId" TEXT,
    CONSTRAINT "SchoolApplication_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE SET NULL ON UPDATE CASCADE
)`,
    // Unique and Secondary Indexes
    `CREATE UNIQUE INDEX IF NOT EXISTS "School_slug_key" ON "School"("slug")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "School_schoolEmail_key" ON "School"("schoolEmail")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_transactionId_key" ON "Subscription"("transactionId")`,
    `CREATE INDEX IF NOT EXISTS "Subscription_schoolId_idx" ON "Subscription"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Announcement_schoolId_idx" ON "Announcement"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Announcement_publishDate_idx" ON "Announcement"("publishDate")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "students_registrationNo_key" ON "students"("registrationNo")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "students_userId_key" ON "students"("userId")`,
    `CREATE INDEX IF NOT EXISTS "students_schoolId_idx" ON "students"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "students_currentClass_idx" ON "students"("currentClass")`,
    `CREATE INDEX IF NOT EXISTS "teachers_teacherId_key" ON "teachers"("teacherId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "teachers_userId_key" ON "teachers"("userId")`,
    `CREATE INDEX IF NOT EXISTS "teachers_schoolId_idx" ON "teachers"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Class_schoolId_idx" ON "Class"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Section_classId_idx" ON "Section"("classId")`,
    `CREATE INDEX IF NOT EXISTS "Section_schoolId_idx" ON "Section"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Subject_schoolId_idx" ON "Subject"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Subject_classId_idx" ON "Subject"("classId")`,
    `CREATE INDEX IF NOT EXISTS "Exam_schoolId_idx" ON "Exam"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "ExamSchedule_examId_idx" ON "ExamSchedule"("examId")`,
    `CREATE INDEX IF NOT EXISTS "ExamSchedule_subjectId_idx" ON "ExamSchedule"("subjectId")`,
    `CREATE INDEX IF NOT EXISTS "FeeType_schoolId_idx" ON "FeeType"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "FeeStructure_schoolId_idx" ON "FeeStructure"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "FeeStructure_classId_idx" ON "FeeStructure"("classId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Fee_invoiceNo_key" ON "Fee"("invoiceNo")`,
    `CREATE INDEX IF NOT EXISTS "Fee_schoolId_idx" ON "Fee"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Fee_studentId_idx" ON "Fee"("studentId")`,
    `CREATE INDEX IF NOT EXISTS "LeaveApplication_schoolId_idx" ON "LeaveApplication"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "LeaveApplication_userId_idx" ON "LeaveApplication"("userId")`,
    `CREATE INDEX IF NOT EXISTS "StudyMaterial_schoolId_idx" ON "StudyMaterial"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "StudyMaterial_classId_idx" ON "StudyMaterial"("classId")`,
    `CREATE INDEX IF NOT EXISTS "StudyMaterial_subjectId_idx" ON "StudyMaterial"("subjectId")`,
    `CREATE INDEX IF NOT EXISTS "TeacherNotice_schoolId_idx" ON "TeacherNotice"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "TeacherNotice_teacherId_idx" ON "TeacherNotice"("teacherId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_authUserId_key" ON "User"("authUserId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
    `CREATE INDEX IF NOT EXISTS "User_schoolId_idx" ON "User"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Attendance_studentId_idx" ON "Attendance"("studentId")`,
    `CREATE INDEX IF NOT EXISTS "Attendance_schoolId_idx" ON "Attendance"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Attendance_date_idx" ON "Attendance"("date")`,
    `CREATE INDEX IF NOT EXISTS "Result_studentId_idx" ON "Result"("studentId")`,
    `CREATE INDEX IF NOT EXISTS "Result_schoolId_idx" ON "Result"("schoolId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Payment_transactionId_key" ON "Payment"("transactionId")`,
    `CREATE INDEX IF NOT EXISTS "Payment_schoolId_idx" ON "Payment"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Payment_studentId_idx" ON "Payment"("studentId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "TeacherSubject_teacherId_subjectId_key" ON "TeacherSubject"("teacherId", "subjectId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "Parent_userId_key" ON "Parent"("userId")`,
    `CREATE INDEX IF NOT EXISTS "ParentStudent_studentId_idx" ON "ParentStudent"("studentId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "ParentStudent_parentId_studentId_key" ON "ParentStudent"("parentId", "studentId")`,
    `CREATE INDEX IF NOT EXISTS "Expense_schoolId_transactionAt_idx" ON "Expense"("schoolId", "transactionAt")`,
    `CREATE INDEX IF NOT EXISTS "Feedback_studentId_idx" ON "Feedback"("studentId")`,
    `CREATE INDEX IF NOT EXISTS "Feedback_teacherId_idx" ON "Feedback"("teacherId")`,
    `CREATE INDEX IF NOT EXISTS "Feedback_schoolId_idx" ON "Feedback"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "QuizRoom_roomCode_key" ON "QuizRoom"("roomCode")`,
    `CREATE INDEX IF NOT EXISTS "QuizRoom_teacherEmail_idx" ON "QuizRoom"("teacherEmail")`,
    `CREATE INDEX IF NOT EXISTS "QuizRoom_createdAt_idx" ON "QuizRoom"("createdAt")`,
    `CREATE INDEX IF NOT EXISTS "QuizSubmission_questionID_idx" ON "QuizSubmission"("questionID")`,
    `CREATE INDEX IF NOT EXISTS "QuizSubmission_studentEmail_idx" ON "QuizSubmission"("studentEmail")`,
    `CREATE INDEX IF NOT EXISTS "QuizSubmission_teacherEmail_idx" ON "QuizSubmission"("teacherEmail")`,
    `CREATE INDEX IF NOT EXISTS "QuizSubmission_schoolId_idx" ON "QuizSubmission"("schoolId")`,
    `CREATE INDEX IF NOT EXISTS "QuizSubmission_submittedAt_idx" ON "QuizSubmission"("submittedAt")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "QuizSubmission_roomCode_studentEmail_key" ON "QuizSubmission"("roomCode", "studentEmail")`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "SchoolApplication_applicationNo_key" ON "SchoolApplication"("applicationNo")`,
    `CREATE INDEX IF NOT EXISTS "SchoolApplication_status_idx" ON "SchoolApplication"("status")`,
    `CREATE INDEX IF NOT EXISTS "SchoolApplication_email_idx" ON "SchoolApplication"("email")`
];

import { createClient } from '@libsql/client';

export async function applyDatabaseMigrations() {
    let executedCount = 0;
    const errors: string[] = [];

    const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.DATABASE_URL || 'file:./dev.db';
    const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
    const client = createClient({ url, ...(authToken ? { authToken } : {}) });

    // 1. Run DDL statements directly via libSQL client
    for (const stmt of MIGRATION_STATEMENTS) {
        try {
            await client.execute(stmt);
            executedCount++;
        } catch (err: unknown) {
            const msg = (err as Error).message || String(err);
            if (!msg.includes('already exists') && !msg.includes('duplicate column')) {
                errors.push(msg);
            }
        }
    }

    // Ensure User table has profileImage and password columns
    try {
        await client.execute('ALTER TABLE "User" ADD COLUMN "profileImage" TEXT');
    } catch {
        // column may already exist
    }
    try {
        await client.execute('ALTER TABLE "User" ADD COLUMN "password" TEXT');
    } catch {
        // column may already exist
    }

    // 2. Fetch created tables directly from libSQL
    const tablesRes = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name ASC"
    );
    const tableNames = tablesRes.rows.map(r => String(r.name));

    // 3. Seed demo school and users if tables are empty
    let demoSeeded = false;
    try {
        const schoolCheck = await client.execute('SELECT COUNT(*) as count FROM "School"');
        const schoolCount = Number(schoolCheck.rows[0]?.count || 0);
        if (schoolCount === 0) {
            await client.execute({
                sql: `INSERT INTO "School" (id, schoolName, slug, schoolEmail, phone, address, plan, duration, schoolCategory, expectedStudents, registrationId, language, createdAt, updatedAt)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                args: [
                    DEMO_SCHOOL_ID,
                    'مدرسة مثقال النموذجية الحديثة',
                    'methqal-model-school',
                    'contact@methqal.tech',
                    '+967 1 234 567',
                    'صنعاء، الجمهورية اليمنية',
                    'pro',
                    '12',
                    'combined',
                    450,
                    'MTH-SCH-2026-001',
                    'arabic'
                ]
            });
        }

        const userCheck = await client.execute('SELECT COUNT(*) as count FROM "User"');
        const userCount = Number(userCheck.rows[0]?.count || 0);
        if (userCount === 0) {
            const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

            for (const acc of Object.values(DEMO_ACCOUNTS)) {
                await client.execute({
                    sql: `INSERT INTO "User" (id, authUserId, email, name, role, schoolId, status, password, createdAt, updatedAt)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                    args: [
                        acc.id,
                        acc.authUserId,
                        acc.email,
                        acc.name,
                        acc.role,
                        acc.schoolId || null,
                        'active',
                        defaultPasswordHash
                    ]
                });
            }
            demoSeeded = true;
        }
    } catch (err: unknown) {
        errors.push(`Seeding note: ${(err as Error).message}`);
    }

    return {
        success: errors.length === 0,
        executedStatements: executedCount,
        tableCount: tableNames.length,
        tables: tableNames,
        demoSeeded,
        errors: errors.length > 0 ? errors : undefined,
    };
}
