import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const results: any[] = [];

    // Let's test the exact queries that addStudent executes against Turso!
    const principalUser = await prisma.user.findFirst({
        where: { role: 'admin' }
    });

    if (!principalUser) {
        return NextResponse.json({ error: "No admin user found" });
    }

    const schoolId = principalUser.schoolId;

    // Test 1: Check School foreign key target
    const school = await prisma.school.findUnique({
        where: { id: schoolId! }
    });
    results.push({ step: "Check School exists", schoolId, exists: !!school });

    // Test 2: Try running the exact student creation transaction
    const testReg = `TEST-${Date.now().toString().slice(-6)}`;
    const studentEmail = `stu.${testReg.toLowerCase()}@test.site`;
    const parentEmail = `par.${testReg.toLowerCase()}@test.site`;

    try {
        await prisma.$transaction(async (tx) => {
            // Step 1: User for student
            const studentPasswordHash = await bcrypt.hash("TempPass123!", 10);
            const sUser = await tx.user.create({
                data: {
                    authUserId: `auth-${testReg}`,
                    name: "Test Student",
                    email: studentEmail,
                    schoolId: schoolId,
                    role: 'student',
                    status: 'active',
                    password: studentPasswordHash
                }
            });
            results.push({ step: "1. Create Student User", userId: sUser.id, status: "OK" });

            // Step 2: User for parent
            const pUser = await tx.user.create({
                data: {
                    authUserId: `pauth-${testReg}`,
                    name: "Test Parent",
                    email: parentEmail,
                    schoolId: schoolId,
                    role: 'parent',
                    status: 'active',
                    password: studentPasswordHash
                }
            });
            results.push({ step: "2. Create Parent User", userId: pUser.id, status: "OK" });

            // Step 3: Student record
            const std = await tx.student.create({
                data: {
                    registrationNo: testReg,
                    firstName: "Test",
                    lastName: "Student",
                    dateOfBirth: new Date("2010-01-01"),
                    gender: "Male",
                    currentClass: "Class 10",
                    sectionName: "A",
                    rollNo: 1,
                    session: "2026",
                    fatherName: "Test Father",
                    motherName: "Test Mother",
                    guardianPhone: "123456789",
                    presentAddress: "Test Address",
                    schoolId: schoolId!,
                    userId: sUser.id
                }
            });
            results.push({ step: "3. Create Student record", studentId: std.id, status: "OK" });

            // Step 4: Parent record
            const parentRec = await tx.parent.create({
                data: {
                    name: "Test Father",
                    phone: "123456789",
                    email: parentEmail,
                    studentId: std.id,
                    userId: pUser.id
                }
            });
            results.push({ step: "4. Create Parent record", parentId: parentRec.id, status: "OK" });

            // Step 5: ParentStudent record
            const psLink = await tx.parentStudent.create({
                data: {
                    parentId: parentRec.id,
                    studentId: std.id
                }
            });
            results.push({ step: "5. Create ParentStudent join", psId: psLink.id, status: "OK" });
        });

        results.push({ overall: "SUCCESS" });
    } catch (err: any) {
        results.push({
            overall: "FAILED",
            error: err.message,
            code: err.code,
            meta: err.meta,
            stack: err.stack
        });
    }

    return NextResponse.json({
        principalUser: { id: principalUser.id, email: principalUser.email, schoolId: principalUser.schoolId },
        results
    });
}
