import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addStudent, getStudents, getStudent, updateStudent } from '@/app/actions/student';
import { submitSchoolApplication, getSchoolApplications, approveSchoolApplication } from '@/app/actions/application';
import { saveAttendance, getAttendance } from '@/app/actions/teacher/attendance';
import { saveResults, getResults } from '@/app/actions/teacher/results';
import { assignClassFee } from '@/app/actions/accountant/fee';
import { initiatePayment } from '@/app/actions/payment';

export const dynamic = 'force-dynamic';

export async function GET() {
    const testLog: {
        step: string;
        result: 'PASS' | 'FAIL';
        details: any;
    }[] = [];

    let overallSuccess = true;

    try {
        // Ensure default school exists
        let school = await prisma.school.findFirst();
        if (!school) {
            school = await prisma.school.create({
                data: {
                    schoolName: "مدرسة مثقال النموذجية الحديثة",
                    slug: "methqal-model-school",
                    schoolEmail: "contact@methqal.tech",
                    phone: "+967 1 234 567",
                    address: "صنعاء، الجمهورية اليمنية",
                    plan: "pro",
                    duration: "12",
                    schoolCategory: "combined",
                    expectedStudents: 450,
                    registrationId: "MTH-SCH-2026-001",
                    language: "arabic"
                }
            });
        }

        // Ensure class and section exist for school
        let testClass = await prisma.class.findFirst({ where: { schoolId: school.id } });
        if (!testClass) {
            testClass = await prisma.class.create({
                data: { name: "Class 10 - A", schoolId: school.id }
            });
        }
        let testSection = await prisma.section.findFirst({ where: { classId: testClass.id } });
        if (!testSection) {
            testSection = await prisma.section.create({
                data: { name: "أ", classId: testClass.id }
            });
        }

        // Ensure teacher exists
        let teacherUser = await prisma.user.findFirst({ where: { role: 'teacher', schoolId: school.id } });
        let teacher = teacherUser ? await prisma.teacher.findFirst({ where: { userId: teacherUser.id } }) : null;
        if (!teacher) {
            if (!teacherUser) {
                teacherUser = await prisma.user.create({
                    data: {
                        authUserId: `tch-auth-${Date.now()}`,
                        name: "أ. خليل المنصوري",
                        email: `teacher.${Date.now()}@methqal.tech`,
                        role: "teacher",
                        schoolId: school.id,
                        status: "active"
                    }
                });
            }
            teacher = await prisma.teacher.create({
                data: {
                    teacherId: `TCH-${Date.now().toString().slice(-4)}`,
                    dateOfBirth: new Date("1985-01-01"),
                    gender: "Male",
                    designation: "Senior Math Teacher",
                    department: "Mathematics",
                    qualification: "M.Sc. Mathematics",
                    presentAddress: "Sana'a",
                    assignedClasses: testClass.name,
                    schoolId: school.id,
                    userId: teacherUser.id
                }
            });
        }

        // Ensure principal admin user exists
        let adminUser = await prisma.user.findFirst({ where: { role: 'admin', schoolId: school.id } });
        if (!adminUser) {
            adminUser = await prisma.user.create({
                data: {
                    authUserId: `adm-auth-${Date.now()}`,
                    name: "م. عادل الشميري",
                    email: `principal.${Date.now()}@methqal.tech`,
                    role: "admin",
                    schoolId: school.id,
                    status: "active"
                }
            });
        }

        // =========================================================================
        // TEST 1: STUDENT & PARENT CREATION WORKFLOW (Fix for the reported crash)
        // =========================================================================
        const uniqueId = Date.now().toString().slice(-5);
        const regNo = `STU-2026-${uniqueId}`;
        const parentEmail = `parent.${uniqueId}@methqal-cloud.test`;
        const studentEmail = `student.${uniqueId}@methqal-cloud.test`;

        // Mock current user context via direct transaction or action
        // We will test direct student & parent creation with full model linking
        let studentRecord: any = null;
        let parentRecord: any = null;
        let parentStudentLink: any = null;

        try {
            await prisma.$transaction(async (tx) => {
                // 1. Create Student User
                const sUser = await tx.user.create({
                    data: {
                        authUserId: `stu-auth-${uniqueId}`,
                        name: "سامي أحمد اليمني",
                        email: studentEmail,
                        role: "student",
                        schoolId: school!.id,
                        status: "active"
                    }
                });

                // 2. Create Parent User
                const pUser = await tx.user.create({
                    data: {
                        authUserId: `par-auth-${uniqueId}`,
                        name: "أحمد علي اليمني",
                        email: parentEmail,
                        role: "parent",
                        schoolId: school!.id,
                        status: "active"
                    }
                });

                // 3. Create Student record
                studentRecord = await tx.student.create({
                    data: {
                        registrationNo: regNo,
                        firstName: "سامي",
                        lastName: "اليمني",
                        dateOfBirth: new Date("2010-06-15"),
                        gender: "Male",
                        bloodGroup: "O+",
                        currentClass: testClass!.name,
                        sectionName: testSection!.name,
                        sectionId: testSection!.id,
                        rollNo: 42,
                        session: "2026-2027",
                        fatherName: "أحمد علي اليمني",
                        motherName: "فاطمة صالح",
                        guardianPhone: "+967771998877",
                        email: studentEmail,
                        presentAddress: "صنعاء، شارع حدة",
                        schoolId: school!.id,
                        userId: sUser.id
                    }
                });

                // 4. Create Parent record (VERIFYING column `name` works on Turso!)
                parentRecord = await tx.parent.create({
                    data: {
                        name: "أحمد علي اليمني",
                        phone: "+967771998877",
                        email: parentEmail,
                        studentId: studentRecord.id,
                        userId: pUser.id
                    }
                });

                // 5. Create ParentStudent relation
                parentStudentLink = await tx.parentStudent.create({
                    data: {
                        parentId: parentRecord.id,
                        studentId: studentRecord.id
                    }
                });
            });

            testLog.push({
                step: "TEST 1: Student & Parent Creation with Column `name` in Turso",
                result: "PASS",
                details: {
                    registrationNo: regNo,
                    studentId: studentRecord?.id,
                    parentId: parentRecord?.id,
                    parentName: parentRecord?.name,
                    parentEmail: parentRecord?.email,
                    parentStudentLinkId: parentStudentLink?.id
                }
            });
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 1: Student & Parent Creation with Column `name` in Turso",
                result: "FAIL",
                details: { error: err.message, stack: err.stack }
            });
        }

        // =========================================================================
        // TEST 2: MULTI-CHILD LINKING (Parent linked to Child 1 and Child 2)
        // =========================================================================
        try {
            const secondRegNo = `STU-2026-SIB-${uniqueId}`;
            const secondStudentEmail = `sibling.${uniqueId}@methqal-cloud.test`;

            let secondStudentRecord: any = null;
            await prisma.$transaction(async (tx) => {
                const sUser2 = await tx.user.create({
                    data: {
                        authUserId: `stu2-auth-${uniqueId}`,
                        name: "سارة أحمد اليمني",
                        email: secondStudentEmail,
                        role: "student",
                        schoolId: school!.id,
                        status: "active"
                    }
                });

                secondStudentRecord = await tx.student.create({
                    data: {
                        registrationNo: secondRegNo,
                        firstName: "سارة",
                        lastName: "اليمني",
                        dateOfBirth: new Date("2012-08-20"),
                        gender: "Female",
                        bloodGroup: "O+",
                        currentClass: testClass!.name,
                        sectionName: testSection!.name,
                        sectionId: testSection!.id,
                        rollNo: 43,
                        session: "2026-2027",
                        fatherName: "أحمد علي اليمني",
                        motherName: "فاطمة صالح",
                        guardianPhone: "+967771998877",
                        email: secondStudentEmail,
                        presentAddress: "صنعاء، شارع حدة",
                        schoolId: school!.id,
                        userId: sUser2.id
                    }
                });

                // Link to same parent
                await tx.parentStudent.create({
                    data: {
                        parentId: parentRecord.id,
                        studentId: secondStudentRecord.id
                    }
                });
            });

            // Query Parent with both children
            const parentWithChildren = await prisma.parent.findUnique({
                where: { id: parentRecord.id },
                include: {
                    children: {
                        include: { student: true }
                    }
                }
            });

            const childrenCount = parentWithChildren?.children?.length || 0;
            if (childrenCount === 2) {
                testLog.push({
                    step: "TEST 2: Multi-Child Parent Relationship in Turso",
                    result: "PASS",
                    details: {
                        parentEmail: parentRecord.email,
                        childrenCount,
                        children: parentWithChildren?.children.map(c => ({
                            id: c.student.id,
                            regNo: c.student.registrationNo,
                            name: `${c.student.firstName} ${c.student.lastName}`
                        }))
                    }
                });
            } else {
                throw new Error(`Expected 2 children linked to parent, found ${childrenCount}`);
            }
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 2: Multi-Child Parent Relationship in Turso",
                result: "FAIL",
                details: { error: err.message }
            });
        }

        // =========================================================================
        // TEST 3: STUDENT DETAILS, UPDATE & EDIT PERSISTENCE IN TURSO
        // =========================================================================
        try {
            const updated = await prisma.student.update({
                where: { id: studentRecord.id },
                data: {
                    presentAddress: "صنعاء، حي الأصبحي الجديد",
                    emergencyContact: "+967770003344"
                }
            });

            // Read back fresh from Turso
            const verified = await prisma.student.findUnique({
                where: { id: studentRecord.id }
            });

            if (verified?.presentAddress === "صنعاء، حي الأصبحي الجديد") {
                testLog.push({
                    step: "TEST 3: Student Details Update & Persistence in Turso",
                    result: "PASS",
                    details: {
                        studentId: verified.id,
                        updatedAddress: verified.presentAddress,
                        emergencyContact: verified.emergencyContact
                    }
                });
            } else {
                throw new Error("Updated address did not persist correctly.");
            }
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 3: Student Details Update & Persistence in Turso",
                result: "FAIL",
                details: { error: err.message }
            });
        }

        // =========================================================================
        // TEST 4: TEACHER ATTENDANCE RECORDING IN TURSO
        // =========================================================================
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const attendance = await prisma.attendance.create({
                data: {
                    studentId: studentRecord.id,
                    schoolId: school!.id,
                    teacherId: teacher!.id,
                    classId: testClass!.id,
                    date: today,
                    status: "PRESENT"
                }
            });

            const fetchedAtt = await prisma.attendance.findUnique({
                where: { id: attendance.id }
            });

            if (fetchedAtt && fetchedAtt.status === "PRESENT") {
                testLog.push({
                    step: "TEST 4: Teacher Attendance Recording & Persistence in Turso",
                    result: "PASS",
                    details: {
                        attendanceId: attendance.id,
                        studentId: attendance.studentId,
                        status: attendance.status,
                        date: attendance.date
                    }
                });
            } else {
                throw new Error("Attendance record not found in Turso");
            }
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 4: Teacher Attendance Recording & Persistence in Turso",
                result: "FAIL",
                details: { error: err.message }
            });
        }

        // =========================================================================
        // TEST 5: TEACHER EXAM RESULT RECORDING IN TURSO (Checking Result schema)
        // =========================================================================
        try {
            const resultRecord = await prisma.result.create({
                data: {
                    marks: 95.5,
                    subject: "Mathematics / الرياضيات",
                    examType: "Midterm / منتصف الفصل",
                    classId: testClass!.id,
                    schoolId: school!.id,
                    studentId: studentRecord.id,
                    teacherId: teacher!.id
                }
            });

            const fetchedResult = await prisma.result.findUnique({
                where: { id: resultRecord.id }
            });

            if (fetchedResult && fetchedResult.marks === 95.5) {
                testLog.push({
                    step: "TEST 5: Teacher Exam Result Recording in Turso",
                    result: "PASS",
                    details: {
                        resultId: resultRecord.id,
                        marks: resultRecord.marks,
                        subject: resultRecord.subject,
                        examType: resultRecord.examType
                    }
                });
            } else {
                throw new Error("Result record not found in Turso");
            }
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 5: Teacher Exam Result Recording in Turso",
                result: "FAIL",
                details: { error: err.message }
            });
        }

        // =========================================================================
        // TEST 6: ACCOUNTANT FEE & PAYMENT CREATION (Checking Fee & Payment schema)
        // =========================================================================
        try {
            const fee = await prisma.fee.create({
                data: {
                    title: "الرسوم الدراسية - القسط الأول 2026",
                    amount: 50000.0,
                    classId: testClass!.id,
                    schoolId: school!.id
                }
            });

            const payment = await prisma.payment.create({
                data: {
                    transactionId: `TXN-AUDIT-${uniqueId}`,
                    amount: 50000.0,
                    currency: "YER",
                    status: "COMPLETED",
                    studentId: studentRecord.id,
                    schoolId: school!.id,
                    feeCategory: fee.title,
                    feeId: fee.id,
                    method: "CASH",
                    customerName: "أحمد علي اليمني",
                    customerEmail: parentEmail,
                    customerPhone: "+967771998877"
                }
            });

            testLog.push({
                step: "TEST 6: Accountant Fee & Payment Recording in Turso",
                result: "PASS",
                details: {
                    feeId: fee.id,
                    feeTitle: fee.title,
                    paymentId: payment.id,
                    transactionId: payment.transactionId,
                    amount: payment.amount,
                    currency: payment.currency,
                    status: payment.status
                }
            });
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 6: Accountant Fee & Payment Recording in Turso",
                result: "FAIL",
                details: { error: err.message }
            });
        }

        // =========================================================================
        // TEST 7: SCHOOL APPLICATION & APPROVAL WORKFLOW
        // =========================================================================
        try {
            const appNo = `APP-2026-${uniqueId}`;
            const app = await prisma.schoolApplication.create({
                data: {
                    applicationNo: appNo,
                    schoolName: `مدرسة الإبداع السحابية ${uniqueId}`,
                    adminName: `د. نبيل الورد ${uniqueId}`,
                    email: `admin.app.${uniqueId}@methqal-cloud.test`,
                    phone: "+967770998811",
                    instituteCode: `INST-${uniqueId}`,
                    passwordHash: "$2b$10$abcdefg1234567890dummyhash",
                    message: "Full consistency audit application",
                    status: "PENDING"
                }
            });

            // Approve application
            const approved = await prisma.schoolApplication.update({
                where: { id: app.id },
                data: {
                    status: "APPROVED",
                    reviewedAt: new Date(),
                    reviewedBy: "superadmin@methqal.tech",
                    reviewNotes: "Approved during consistency audit"
                }
            });

            testLog.push({
                step: "TEST 7: School Application & Approval Cycle in Turso",
                result: "PASS",
                details: {
                    applicationNo: approved.applicationNo,
                    status: approved.status,
                    reviewedBy: approved.reviewedBy
                }
            });
        } catch (err: any) {
            overallSuccess = false;
            testLog.push({
                step: "TEST 7: School Application & Approval Cycle in Turso",
                result: "FAIL",
                details: { error: err.message }
            });
        }

    } catch (criticalErr: any) {
        overallSuccess = false;
        testLog.push({
            step: "CRITICAL SUITE ERROR",
            result: "FAIL",
            details: { error: criticalErr.message }
        });
    }

    return NextResponse.json({
        success: overallSuccess,
        totalTests: testLog.length,
        passedTests: testLog.filter(t => t.result === 'PASS').length,
        failedTests: testLog.filter(t => t.result === 'FAIL').length,
        testLog
    });
}
