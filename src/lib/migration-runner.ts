import { prisma } from './prisma';
import { DEMO_ACCOUNTS, DEMO_SCHOOL_ID } from './demo-accounts';
import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

// Canonical DDL statements generated directly from Prisma migrations
export const CANONICAL_MIGRATION_STATEMENTS = [
    "CREATE TABLE IF NOT EXISTS \"School\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"schoolName\" TEXT NOT NULL,\n    \"slug\" TEXT NOT NULL,\n    \"schoolEmail\" TEXT NOT NULL,\n    \"phone\" TEXT,\n    \"address\" TEXT,\n    \"plan\" TEXT NOT NULL DEFAULT 'basic',\n    \"duration\" TEXT NOT NULL DEFAULT '12',\n    \"schoolCategory\" TEXT NOT NULL,\n    \"expectedStudents\" INTEGER,\n    \"registrationId\" TEXT NOT NULL,\n    \"facebookUrl\" TEXT,\n    \"websiteUrl\" TEXT,\n    \"language\" TEXT NOT NULL DEFAULT 'arabic',\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL\n)",
    "CREATE TABLE IF NOT EXISTS \"Subscription\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"transactionId\" TEXT NOT NULL,\n    \"amount\" REAL NOT NULL,\n    \"currency\" TEXT NOT NULL DEFAULT 'YER',\n    \"status\" TEXT NOT NULL DEFAULT 'PENDING',\n    \"planName\" TEXT NOT NULL,\n    \"duration\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"method\" TEXT,\n    \"valId\" TEXT,\n    \"customerName\" TEXT NOT NULL,\n    \"customerEmail\" TEXT NOT NULL,\n    \"customerPhone\" TEXT,\n    \"startDate\" DATETIME,\n    \"endDate\" DATETIME,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Subscription_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Announcement\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"content\" TEXT NOT NULL,\n    \"audience\" TEXT NOT NULL DEFAULT 'all',\n    \"targetClass\" TEXT,\n    \"category\" TEXT NOT NULL DEFAULT 'academic',\n    \"priority\" TEXT NOT NULL DEFAULT 'normal',\n    \"attachmentUrl\" TEXT,\n    \"publishDate\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"expiryDate\" DATETIME,\n    \"status\" TEXT NOT NULL DEFAULT 'published',\n    \"schoolId\" TEXT NOT NULL,\n    \"authorId\" TEXT,\n    \"authorName\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Announcement_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"User\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE,\n    CONSTRAINT \"Announcement_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"students\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"registrationNo\" TEXT NOT NULL,\n    \"firstName\" TEXT NOT NULL DEFAULT '',\n    \"lastName\" TEXT NOT NULL DEFAULT '',\n    \"dateOfBirth\" DATETIME NOT NULL,\n    \"gender\" TEXT NOT NULL,\n    \"bloodGroup\" TEXT,\n    \"religion\" TEXT,\n    \"currentClass\" TEXT,\n    \"sectionName\" TEXT,\n    \"sectionId\" TEXT,\n    \"rollNo\" INTEGER NOT NULL,\n    \"session\" TEXT NOT NULL,\n    \"admissionDate\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"fatherName\" TEXT NOT NULL,\n    \"motherName\" TEXT NOT NULL,\n    \"guardianPhone\" TEXT NOT NULL,\n    \"emergencyContact\" TEXT,\n    \"email\" TEXT,\n    \"presentAddress\" TEXT NOT NULL,\n    \"permanentAddress\" TEXT,\n    \"isActive\" BOOLEAN NOT NULL DEFAULT true,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    CONSTRAINT \"students_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"students_sectionId_fkey\" FOREIGN KEY (\"sectionId\") REFERENCES \"Section\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE,\n    CONSTRAINT \"students_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Plan\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"name\" TEXT NOT NULL,\n    \"price\" TEXT NOT NULL,\n    \"duration\" TEXT NOT NULL,\n    \"icon\" TEXT,\n    \"color\" TEXT,\n    \"students\" TEXT NOT NULL,\n    \"teachers\" TEXT NOT NULL,\n    \"storage\" TEXT NOT NULL,\n    \"modules\" TEXT NOT NULL DEFAULT '',\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL\n)",
    "CREATE TABLE IF NOT EXISTS \"SupportTicket\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"subject\" TEXT NOT NULL,\n    \"description\" TEXT NOT NULL,\n    \"priority\" TEXT NOT NULL DEFAULT 'low',\n    \"status\" TEXT NOT NULL DEFAULT 'open',\n    \"schoolId\" TEXT,\n    \"userEmail\" TEXT NOT NULL,\n    \"attachmentUrl\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"SupportTicket_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"teachers\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"teacherId\" TEXT NOT NULL,\n    \"phone\" TEXT,\n    \"dateOfBirth\" DATETIME NOT NULL,\n    \"gender\" TEXT NOT NULL,\n    \"bloodGroup\" TEXT,\n    \"religion\" TEXT,\n    \"designation\" TEXT NOT NULL,\n    \"department\" TEXT NOT NULL,\n    \"qualification\" TEXT NOT NULL,\n    \"joiningDate\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"salary\" REAL,\n    \"presentAddress\" TEXT NOT NULL,\n    \"permanentAddress\" TEXT,\n    \"isActive\" BOOLEAN NOT NULL DEFAULT true,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    \"userId\" TEXT NOT NULL,\n    \"assignedClasses\" TEXT NOT NULL DEFAULT '',\n    CONSTRAINT \"teachers_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"teachers_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"User\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"authUserId\" TEXT NOT NULL,\n    \"schoolId\" TEXT,\n    \"role\" TEXT NOT NULL DEFAULT 'student',\n    \"status\" TEXT NOT NULL DEFAULT 'active',\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    \"email\" TEXT NOT NULL,\n    \"name\" TEXT NOT NULL,\n    \"profileImage\" TEXT,\n    CONSTRAINT \"User_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"StudyMaterial\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"type\" TEXT NOT NULL,\n    \"subject\" TEXT NOT NULL,\n    \"class\" TEXT NOT NULL,\n    \"description\" TEXT,\n    \"attachmentUrl\" TEXT NOT NULL,\n    \"size\" TEXT,\n    \"schoolId\" TEXT NOT NULL,\n    \"teacherId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"StudyMaterial_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"StudyMaterial_teacherId_fkey\" FOREIGN KEY (\"teacherId\") REFERENCES \"teachers\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"TeacherNotice\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"content\" TEXT NOT NULL,\n    \"audience\" TEXT NOT NULL DEFAULT 'students',\n    \"targetClass\" TEXT,\n    \"category\" TEXT NOT NULL DEFAULT 'academic',\n    \"priority\" TEXT NOT NULL DEFAULT 'normal',\n    \"status\" TEXT NOT NULL DEFAULT 'published',\n    \"schoolId\" TEXT NOT NULL,\n    \"authorId\" TEXT,\n    \"authorName\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"TeacherNotice_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"User\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE,\n    CONSTRAINT \"TeacherNotice_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Class\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"name\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Class_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Section\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"name\" TEXT NOT NULL,\n    \"classId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Section_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Attendance\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"date\" DATETIME NOT NULL,\n    \"status\" TEXT NOT NULL DEFAULT 'PRESENT',\n    \"studentId\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"teacherId\" TEXT,\n    \"classId\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Attendance_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE,\n    CONSTRAINT \"Attendance_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Attendance_studentId_fkey\" FOREIGN KEY (\"studentId\") REFERENCES \"students\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Attendance_teacherId_fkey\" FOREIGN KEY (\"teacherId\") REFERENCES \"teachers\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Result\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"examType\" TEXT,\n    \"subject\" TEXT,\n    \"marks\" REAL NOT NULL,\n    \"studentId\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"teacherId\" TEXT,\n    \"classId\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    \"examId\" TEXT,\n    \"subjectId\" TEXT,\n    CONSTRAINT \"Result_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE,\n    CONSTRAINT \"Result_examId_fkey\" FOREIGN KEY (\"examId\") REFERENCES \"Exam\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Result_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Result_studentId_fkey\" FOREIGN KEY (\"studentId\") REFERENCES \"students\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Result_subjectId_fkey\" FOREIGN KEY (\"subjectId\") REFERENCES \"Subject\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Result_teacherId_fkey\" FOREIGN KEY (\"teacherId\") REFERENCES \"teachers\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Payment\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"transactionId\" TEXT NOT NULL,\n    \"amount\" REAL NOT NULL,\n    \"currency\" TEXT NOT NULL DEFAULT 'YER',\n    \"status\" TEXT NOT NULL DEFAULT 'PENDING',\n    \"studentId\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"feeCategory\" TEXT NOT NULL,\n    \"method\" TEXT,\n    \"valId\" TEXT,\n    \"customerName\" TEXT NOT NULL,\n    \"customerEmail\" TEXT NOT NULL,\n    \"customerPhone\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    \"feeId\" TEXT,\n    CONSTRAINT \"Payment_feeId_fkey\" FOREIGN KEY (\"feeId\") REFERENCES \"Fee\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE,\n    CONSTRAINT \"Payment_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Payment_studentId_fkey\" FOREIGN KEY (\"studentId\") REFERENCES \"students\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"SupportOption\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"description\" TEXT NOT NULL,\n    \"iconName\" TEXT NOT NULL,\n    \"status\" TEXT NOT NULL,\n    \"accentColor\" TEXT NOT NULL,\n    \"actionLabel\" TEXT NOT NULL DEFAULT 'Contact Now',\n    \"link\" TEXT NOT NULL DEFAULT '#',\n    \"order\" INTEGER NOT NULL DEFAULT 0,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL\n)",
    "CREATE TABLE IF NOT EXISTS \"SupportFAQ\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"question\" TEXT NOT NULL,\n    \"answer\" TEXT NOT NULL,\n    \"order\" INTEGER NOT NULL DEFAULT 0\n)",
    "CREATE TABLE IF NOT EXISTS \"Subject\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"name\" TEXT NOT NULL,\n    \"code\" TEXT,\n    \"classId\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT \"Subject_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Subject_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"TeacherSubject\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"teacherId\" TEXT NOT NULL,\n    \"subjectId\" TEXT NOT NULL,\n    CONSTRAINT \"TeacherSubject_subjectId_fkey\" FOREIGN KEY (\"subjectId\") REFERENCES \"Subject\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"TeacherSubject_teacherId_fkey\" FOREIGN KEY (\"teacherId\") REFERENCES \"teachers\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Exam\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"name\" TEXT NOT NULL,\n    \"examType\" TEXT NOT NULL,\n    \"classId\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"startDate\" DATETIME NOT NULL,\n    \"endDate\" DATETIME NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT \"Exam_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Exam_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Fee\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"amount\" REAL NOT NULL,\n    \"classId\" TEXT,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT \"Fee_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Fee_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"ClassSchedule\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"classId\" TEXT NOT NULL,\n    \"subjectId\" TEXT NOT NULL,\n    \"teacherId\" TEXT NOT NULL,\n    \"day\" TEXT NOT NULL,\n    \"startTime\" TEXT NOT NULL,\n    \"endTime\" TEXT NOT NULL,\n    CONSTRAINT \"ClassSchedule_classId_fkey\" FOREIGN KEY (\"classId\") REFERENCES \"Class\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"ClassSchedule_subjectId_fkey\" FOREIGN KEY (\"subjectId\") REFERENCES \"Subject\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"ClassSchedule_teacherId_fkey\" FOREIGN KEY (\"teacherId\") REFERENCES \"teachers\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Parent\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"name\" TEXT NOT NULL,\n    \"phone\" TEXT,\n    \"email\" TEXT,\n    \"studentId\" TEXT,\n    \"userId\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT \"Parent_studentId_fkey\" FOREIGN KEY (\"studentId\") REFERENCES \"students\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Parent_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"ParentStudent\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"parentId\" TEXT NOT NULL,\n    \"studentId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    CONSTRAINT \"ParentStudent_parentId_fkey\" FOREIGN KEY (\"parentId\") REFERENCES \"Parent\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"ParentStudent_studentId_fkey\" FOREIGN KEY (\"studentId\") REFERENCES \"students\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Expense\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"category\" TEXT NOT NULL,\n    \"amount\" REAL NOT NULL,\n    \"transactionAt\" DATETIME NOT NULL,\n    \"note\" TEXT,\n    \"status\" TEXT NOT NULL DEFAULT 'Paid',\n    \"attachmentUrl\" TEXT,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdById\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Expense_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Feedback\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"academic\" INTEGER NOT NULL DEFAULT 0,\n    \"behavior\" INTEGER NOT NULL DEFAULT 0,\n    \"participation\" INTEGER NOT NULL DEFAULT 0,\n    \"comment\" TEXT,\n    \"studentId\" TEXT NOT NULL,\n    \"teacherId\" TEXT NOT NULL,\n    \"schoolId\" TEXT NOT NULL,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Feedback_studentId_fkey\" FOREIGN KEY (\"studentId\") REFERENCES \"students\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Feedback_teacherId_fkey\" FOREIGN KEY (\"teacherId\") REFERENCES \"teachers\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE,\n    CONSTRAINT \"Feedback_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"Notification\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"title\" TEXT NOT NULL,\n    \"message\" TEXT NOT NULL,\n    \"type\" TEXT NOT NULL DEFAULT 'system',\n    \"userId\" TEXT NOT NULL,\n    \"isRead\" BOOLEAN NOT NULL DEFAULT false,\n    \"link\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    CONSTRAINT \"Notification_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\" (\"id\") ON DELETE CASCADE ON UPDATE CASCADE\n)",
    "CREATE TABLE IF NOT EXISTS \"QuizRoom\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"roomCode\" TEXT NOT NULL,\n    \"roomTitle\" TEXT NOT NULL,\n    \"teacherEmail\" TEXT NOT NULL,\n    \"category\" TEXT,\n    \"currentClass\" TEXT,\n    \"duration\" TEXT,\n    \"exam\" BOOLEAN NOT NULL DEFAULT false,\n    \"schoolId\" TEXT,\n    \"questions\" JSONB NOT NULL DEFAULT [],\n    \"payload\" JSONB,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL\n)",
    "CREATE TABLE IF NOT EXISTS \"QuizSubmission\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"questionID\" TEXT NOT NULL,\n    \"studentName\" TEXT NOT NULL,\n    \"studentEmail\" TEXT NOT NULL,\n    \"schoolId\" TEXT,\n    \"examSubject\" TEXT,\n    \"teacherEmail\" TEXT,\n    \"roomCode\" TEXT NOT NULL,\n    \"totalMark\" INTEGER NOT NULL,\n    \"totalQuestions\" INTEGER NOT NULL,\n    \"studentAnswers\" JSONB,\n    \"submittedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP\n)",
    "CREATE TABLE IF NOT EXISTS \"SystemConfig\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY DEFAULT 'system_config',\n    \"siteName\" TEXT,\n    \"siteSubtitle\" TEXT,\n    \"siteLogo\" TEXT,\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL\n)",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"Subscription_transactionId_key\" ON \"Subscription\"(\"transactionId\")",
    "CREATE INDEX IF NOT EXISTS \"Subscription_schoolId_idx\" ON \"Subscription\"(\"schoolId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"students_userId_key\" ON \"students\"(\"userId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"teachers_teacherId_key\" ON \"teachers\"(\"teacherId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"teachers_userId_key\" ON \"teachers\"(\"userId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"User_authUserId_key\" ON \"User\"(\"authUserId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"User_email_key\" ON \"User\"(\"email\")",
    "CREATE INDEX IF NOT EXISTS \"StudyMaterial_schoolId_idx\" ON \"StudyMaterial\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"TeacherNotice_schoolId_idx\" ON \"TeacherNotice\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"Class_schoolId_idx\" ON \"Class\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"Section_classId_idx\" ON \"Section\"(\"classId\")",
    "CREATE INDEX IF NOT EXISTS \"Attendance_studentId_idx\" ON \"Attendance\"(\"studentId\")",
    "CREATE INDEX IF NOT EXISTS \"Attendance_schoolId_idx\" ON \"Attendance\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"Attendance_date_idx\" ON \"Attendance\"(\"date\")",
    "CREATE INDEX IF NOT EXISTS \"Result_studentId_idx\" ON \"Result\"(\"studentId\")",
    "CREATE INDEX IF NOT EXISTS \"Result_schoolId_idx\" ON \"Result\"(\"schoolId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"Payment_transactionId_key\" ON \"Payment\"(\"transactionId\")",
    "CREATE INDEX IF NOT EXISTS \"Payment_schoolId_idx\" ON \"Payment\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"Payment_studentId_idx\" ON \"Payment\"(\"studentId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"TeacherSubject_teacherId_subjectId_key\" ON \"TeacherSubject\"(\"teacherId\", \"subjectId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"Parent_userId_key\" ON \"Parent\"(\"userId\")",
    "CREATE INDEX IF NOT EXISTS \"ParentStudent_studentId_idx\" ON \"ParentStudent\"(\"studentId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"ParentStudent_parentId_studentId_key\" ON \"ParentStudent\"(\"parentId\", \"studentId\")",
    "CREATE INDEX IF NOT EXISTS \"Expense_schoolId_transactionAt_idx\" ON \"Expense\"(\"schoolId\", \"transactionAt\")",
    "CREATE INDEX IF NOT EXISTS \"Feedback_studentId_idx\" ON \"Feedback\"(\"studentId\")",
    "CREATE INDEX IF NOT EXISTS \"Feedback_teacherId_idx\" ON \"Feedback\"(\"teacherId\")",
    "CREATE INDEX IF NOT EXISTS \"Feedback_schoolId_idx\" ON \"Feedback\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"Notification_userId_idx\" ON \"Notification\"(\"userId\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"QuizRoom_roomCode_key\" ON \"QuizRoom\"(\"roomCode\")",
    "CREATE INDEX IF NOT EXISTS \"QuizRoom_teacherEmail_idx\" ON \"QuizRoom\"(\"teacherEmail\")",
    "CREATE INDEX IF NOT EXISTS \"QuizRoom_createdAt_idx\" ON \"QuizRoom\"(\"createdAt\")",
    "CREATE INDEX IF NOT EXISTS \"QuizSubmission_questionID_idx\" ON \"QuizSubmission\"(\"questionID\")",
    "CREATE INDEX IF NOT EXISTS \"QuizSubmission_studentEmail_idx\" ON \"QuizSubmission\"(\"studentEmail\")",
    "CREATE INDEX IF NOT EXISTS \"QuizSubmission_teacherEmail_idx\" ON \"QuizSubmission\"(\"teacherEmail\")",
    "CREATE INDEX IF NOT EXISTS \"QuizSubmission_schoolId_idx\" ON \"QuizSubmission\"(\"schoolId\")",
    "CREATE INDEX IF NOT EXISTS \"QuizSubmission_submittedAt_idx\" ON \"QuizSubmission\"(\"submittedAt\")",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"QuizSubmission_roomCode_studentEmail_key\" ON \"QuizSubmission\"(\"roomCode\", \"studentEmail\")",
    "ALTER TABLE \"User\" ADD COLUMN \"password\" TEXT",
    "ALTER TABLE \"User\" ADD COLUMN \"profileImage\" TEXT",
    "CREATE TABLE IF NOT EXISTS \"SchoolApplication\" (\n    \"id\" TEXT NOT NULL PRIMARY KEY,\n    \"applicationNo\" TEXT NOT NULL,\n    \"schoolName\" TEXT NOT NULL,\n    \"adminName\" TEXT NOT NULL,\n    \"email\" TEXT NOT NULL,\n    \"phone\" TEXT NOT NULL,\n    \"instituteCode\" TEXT,\n    \"passwordHash\" TEXT,\n    \"message\" TEXT,\n    \"status\" TEXT NOT NULL DEFAULT 'PENDING',\n    \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"updatedAt\" DATETIME NOT NULL,\n    \"reviewedAt\" DATETIME,\n    \"reviewedBy\" TEXT,\n    \"reviewNotes\" TEXT,\n    \"schoolId\" TEXT,\n    CONSTRAINT \"SchoolApplication_schoolId_fkey\" FOREIGN KEY (\"schoolId\") REFERENCES \"School\" (\"id\") ON DELETE SET NULL ON UPDATE CASCADE\n)",
    "CREATE UNIQUE INDEX IF NOT EXISTS \"SchoolApplication_applicationNo_key\" ON \"SchoolApplication\"(\"applicationNo\")",
    "CREATE INDEX IF NOT EXISTS \"SchoolApplication_status_idx\" ON \"SchoolApplication\"(\"status\")",
    "CREATE INDEX IF NOT EXISTS \"SchoolApplication_email_idx\" ON \"SchoolApplication\"(\"email\")"
];

// Prisma models and their scalar fields for column-level synchronization
export const EXPECTED_SCHEMA_COLUMNS: Record<string, Record<string, string>> = {
    School: {
        id: 'TEXT',
        schoolName: 'TEXT',
        slug: 'TEXT',
        schoolEmail: 'TEXT',
        phone: 'TEXT',
        address: 'TEXT',
        plan: 'TEXT',
        duration: 'TEXT',
        schoolCategory: 'TEXT',
        expectedStudents: 'INTEGER',
        registrationId: 'TEXT',
        facebookUrl: 'TEXT',
        websiteUrl: 'TEXT',
        language: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Subscription: {
        id: 'TEXT',
        transactionId: 'TEXT',
        amount: 'REAL',
        currency: 'TEXT',
        status: 'TEXT',
        planName: 'TEXT',
        duration: 'TEXT',
        schoolId: 'TEXT',
        method: 'TEXT',
        valId: 'TEXT',
        customerName: 'TEXT',
        customerEmail: 'TEXT',
        customerPhone: 'TEXT',
        startDate: 'DATETIME',
        endDate: 'DATETIME',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Announcement: {
        id: 'TEXT',
        title: 'TEXT',
        content: 'TEXT',
        audience: 'TEXT',
        targetClass: 'TEXT',
        category: 'TEXT',
        priority: 'TEXT',
        attachmentUrl: 'TEXT',
        publishDate: 'DATETIME',
        expiryDate: 'DATETIME',
        status: 'TEXT',
        schoolId: 'TEXT',
        authorId: 'TEXT',
        authorName: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    students: {
        id: 'TEXT',
        registrationNo: 'TEXT',
        firstName: 'TEXT',
        lastName: 'TEXT',
        dateOfBirth: 'DATETIME',
        gender: 'TEXT',
        bloodGroup: 'TEXT',
        religion: 'TEXT',
        currentClass: 'TEXT',
        sectionName: 'TEXT',
        sectionId: 'TEXT',
        rollNo: 'INTEGER',
        session: 'TEXT',
        admissionDate: 'DATETIME',
        fatherName: 'TEXT',
        motherName: 'TEXT',
        guardianPhone: 'TEXT',
        emergencyContact: 'TEXT',
        email: 'TEXT',
        presentAddress: 'TEXT',
        permanentAddress: 'TEXT',
        isActive: 'BOOLEAN',
        schoolId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
        userId: 'TEXT',
    },
    Plan: {
        id: 'TEXT',
        name: 'TEXT',
        price: 'TEXT',
        duration: 'TEXT',
        icon: 'TEXT',
        color: 'TEXT',
        students: 'TEXT',
        teachers: 'TEXT',
        storage: 'TEXT',
        modules: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    SupportTicket: {
        id: 'TEXT',
        subject: 'TEXT',
        description: 'TEXT',
        priority: 'TEXT',
        status: 'TEXT',
        schoolId: 'TEXT',
        userEmail: 'TEXT',
        attachmentUrl: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    teachers: {
        id: 'TEXT',
        teacherId: 'TEXT',
        phone: 'TEXT',
        dateOfBirth: 'DATETIME',
        gender: 'TEXT',
        bloodGroup: 'TEXT',
        religion: 'TEXT',
        designation: 'TEXT',
        department: 'TEXT',
        qualification: 'TEXT',
        joiningDate: 'DATETIME',
        salary: 'REAL',
        presentAddress: 'TEXT',
        permanentAddress: 'TEXT',
        isActive: 'BOOLEAN',
        schoolId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
        userId: 'TEXT',
        assignedClasses: 'TEXT',
    },
    User: {
        id: 'TEXT',
        authUserId: 'TEXT',
        schoolId: 'TEXT',
        role: 'TEXT',
        status: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
        email: 'TEXT',
        name: 'TEXT',
        profileImage: 'TEXT',
        password: 'TEXT',
    },
    StudyMaterial: {
        id: 'TEXT',
        title: 'TEXT',
        type: 'TEXT',
        subject: 'TEXT',
        class: 'TEXT',
        description: 'TEXT',
        attachmentUrl: 'TEXT',
        size: 'TEXT',
        schoolId: 'TEXT',
        teacherId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    TeacherNotice: {
        id: 'TEXT',
        title: 'TEXT',
        content: 'TEXT',
        audience: 'TEXT',
        targetClass: 'TEXT',
        category: 'TEXT',
        priority: 'TEXT',
        status: 'TEXT',
        schoolId: 'TEXT',
        authorId: 'TEXT',
        authorName: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Class: {
        id: 'TEXT',
        name: 'TEXT',
        schoolId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Section: {
        id: 'TEXT',
        name: 'TEXT',
        classId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Attendance: {
        id: 'TEXT',
        date: 'DATETIME',
        status: 'TEXT',
        studentId: 'TEXT',
        schoolId: 'TEXT',
        teacherId: 'TEXT',
        classId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Result: {
        id: 'TEXT',
        examType: 'TEXT',
        subject: 'TEXT',
        marks: 'REAL',
        studentId: 'TEXT',
        schoolId: 'TEXT',
        teacherId: 'TEXT',
        classId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
        examId: 'TEXT',
        subjectId: 'TEXT',
    },
    Payment: {
        id: 'TEXT',
        transactionId: 'TEXT',
        amount: 'REAL',
        currency: 'TEXT',
        status: 'TEXT',
        studentId: 'TEXT',
        schoolId: 'TEXT',
        feeCategory: 'TEXT',
        method: 'TEXT',
        valId: 'TEXT',
        customerName: 'TEXT',
        customerEmail: 'TEXT',
        customerPhone: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
        feeId: 'TEXT',
    },
    SupportOption: {
        id: 'TEXT',
        title: 'TEXT',
        description: 'TEXT',
        iconName: 'TEXT',
        status: 'TEXT',
        accentColor: 'TEXT',
        actionLabel: 'TEXT',
        link: 'TEXT',
        order: 'INTEGER',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    SupportFAQ: {
        id: 'TEXT',
        question: 'TEXT',
        answer: 'TEXT',
        order: 'INTEGER',
    },
    Subject: {
        id: 'TEXT',
        name: 'TEXT',
        code: 'TEXT',
        classId: 'TEXT',
        schoolId: 'TEXT',
        createdAt: 'DATETIME',
    },
    TeacherSubject: {
        id: 'TEXT',
        teacherId: 'TEXT',
        subjectId: 'TEXT',
    },
    Exam: {
        id: 'TEXT',
        name: 'TEXT',
        examType: 'TEXT',
        classId: 'TEXT',
        schoolId: 'TEXT',
        startDate: 'DATETIME',
        endDate: 'DATETIME',
        createdAt: 'DATETIME',
    },
    Fee: {
        id: 'TEXT',
        title: 'TEXT',
        amount: 'REAL',
        classId: 'TEXT',
        schoolId: 'TEXT',
        createdAt: 'DATETIME',
    },
    ClassSchedule: {
        id: 'TEXT',
        classId: 'TEXT',
        subjectId: 'TEXT',
        teacherId: 'TEXT',
        day: 'TEXT',
        startTime: 'TEXT',
        endTime: 'TEXT',
    },
    Parent: {
        id: 'TEXT',
        name: 'TEXT',
        phone: 'TEXT',
        email: 'TEXT',
        studentId: 'TEXT',
        userId: 'TEXT',
        createdAt: 'DATETIME',
    },
    ParentStudent: {
        id: 'TEXT',
        parentId: 'TEXT',
        studentId: 'TEXT',
        createdAt: 'DATETIME',
    },
    Expense: {
        id: 'TEXT',
        title: 'TEXT',
        category: 'TEXT',
        amount: 'REAL',
        transactionAt: 'DATETIME',
        note: 'TEXT',
        status: 'TEXT',
        attachmentUrl: 'TEXT',
        schoolId: 'TEXT',
        createdById: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Feedback: {
        id: 'TEXT',
        academic: 'INTEGER',
        behavior: 'INTEGER',
        participation: 'INTEGER',
        comment: 'TEXT',
        studentId: 'TEXT',
        teacherId: 'TEXT',
        schoolId: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    Notification: {
        id: 'TEXT',
        title: 'TEXT',
        message: 'TEXT',
        type: 'TEXT',
        userId: 'TEXT',
        isRead: 'BOOLEAN',
        link: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    QuizRoom: {
        id: 'TEXT',
        roomCode: 'TEXT',
        roomTitle: 'TEXT',
        teacherEmail: 'TEXT',
        category: 'TEXT',
        currentClass: 'TEXT',
        duration: 'TEXT',
        exam: 'BOOLEAN',
        schoolId: 'TEXT',
        questions: 'TEXT',
        payload: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    QuizSubmission: {
        id: 'TEXT',
        questionID: 'TEXT',
        studentName: 'TEXT',
        studentEmail: 'TEXT',
        schoolId: 'TEXT',
        examSubject: 'TEXT',
        teacherEmail: 'TEXT',
        roomCode: 'TEXT',
        totalMark: 'INTEGER',
        totalQuestions: 'INTEGER',
        studentAnswers: 'TEXT',
        submittedAt: 'DATETIME',
        createdAt: 'DATETIME',
    },
    SystemConfig: {
        id: 'TEXT',
        siteName: 'TEXT',
        siteSubtitle: 'TEXT',
        siteLogo: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
    },
    SchoolApplication: {
        id: 'TEXT',
        applicationNo: 'TEXT',
        schoolName: 'TEXT',
        adminName: 'TEXT',
        email: 'TEXT',
        phone: 'TEXT',
        instituteCode: 'TEXT',
        passwordHash: 'TEXT',
        message: 'TEXT',
        status: 'TEXT',
        createdAt: 'DATETIME',
        updatedAt: 'DATETIME',
        reviewedAt: 'DATETIME',
        reviewedBy: 'TEXT',
        reviewNotes: 'TEXT',
        schoolId: 'TEXT',
    },
};

export async function applyDatabaseMigrations() {
    let executedCount = 0;
    const errors: string[] = [];
    const addedColumns: string[] = [];

    const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.DATABASE_URL || 'file:./dev.db';
    const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
    const client = createClient({ url, ...(authToken ? { authToken } : {}) });

    // 1. Run all canonical DDL statements (CREATE TABLE IF NOT EXISTS & CREATE INDEX IF NOT EXISTS)
    for (const stmt of CANONICAL_MIGRATION_STATEMENTS) {
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

    // 2. Column-level synchronization for pre-existing tables that may lack columns (e.g. Parent.name)
    const tablesRes = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'"
    );
    const existingTables = new Set(tablesRes.rows.map(r => String(r.name)));

    for (const [tableName, expectedCols] of Object.entries(EXPECTED_SCHEMA_COLUMNS)) {
        if (!existingTables.has(tableName)) continue;

        try {
            const colInfoRes = await client.execute(`PRAGMA table_info("${tableName}")`);
            const actualCols = new Set(colInfoRes.rows.map(r => String(r.name)));

            for (const [colName, colType] of Object.entries(expectedCols)) {
                if (!actualCols.has(colName)) {
                    try {
                        await client.execute(`ALTER TABLE "${tableName}" ADD COLUMN "${colName}" ${colType}`);
                        addedColumns.push(`${tableName}.${colName} (${colType})`);
                    } catch (alterErr: unknown) {
                        const alterMsg = (alterErr as Error).message || String(alterErr);
                        if (!alterMsg.includes('duplicate column')) {
                            errors.push(`ALTER TABLE ${tableName} ADD ${colName}: ${alterMsg}`);
                        }
                    }
                }
            }
        } catch (tableErr: unknown) {
            errors.push(`PRAGMA ${tableName}: ${(tableErr as Error).message}`);
        }
    }

    // 3. Verify created tables count directly from libSQL
    const finalTablesRes = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name ASC"
    );
    const tableNames = finalTablesRes.rows.map(r => String(r.name));

    // 4. Seed demo school and users if tables are empty
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
        addedColumnsCount: addedColumns.length,
        addedColumns,
        tableCount: tableNames.length,
        tables: tableNames,
        demoSeeded,
        errors: errors.length > 0 ? errors : undefined,
    };
}
