"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { supabaseAdmin } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"
import { applyDatabaseMigrations } from "@/lib/migration-runner"

let isDbReady = false;
async function ensureDb() {
    if (isDbReady) return;
    try {
        await applyDatabaseMigrations();
        isDbReady = true;
    } catch (err) {
        console.warn("ensureDb non-fatal error in student actions:", err);
    }
}

export interface AddStudentFormData {
    registrationNo: string
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    bloodGroup?: string
    religion?: string
    currentClass: string
    section: string
    sectionId?: string
    rollNo: number
    session: string
    fatherName: string
    motherName: string
    guardianPhone: string
    emergencyContact?: string
    email?: string
    presentAddress: string
    permanentAddress?: string
    password?: string
    confirmPassword?: string
    parentEmail?: string
    parentPassword?: string
    confirmParentPassword?: string
}

export async function getAvailableClasses() {
    await ensureDb();
    try {
        const currentUser = await getCurrentUser();
        let schoolId = currentUser?.schoolId;

        let school = schoolId ? await prisma.school.findUnique({ where: { id: schoolId } }) : null;
        if (!school) {
            school = await prisma.school.findFirst();
            schoolId = school?.id;
        }

        if (!schoolId) return { success: true, data: [] };

        let classes = await prisma.class.findMany({
            where: { schoolId },
            include: { sections: true },
            orderBy: { name: 'asc' }
        });

        // Initialize standard grade classes if empty
        if (classes.length === 0) {
            const standardGrades = [
                { name: "Grade 10 / الصف العاشر", sections: ["Section A / الشعبة (أ)", "Section B / الشعبة (ب)"] },
                { name: "Grade 9 / الصف التاسع", sections: ["Section A / الشعبة (أ)", "Section B / الشعبة (ب)"] },
                { name: "Grade 8 / الصف الثامن", sections: ["Section A / الشعبة (أ)", "Section B / الشعبة (ب)"] },
                { name: "Grade 7 / الصف السابع", sections: ["Section A / الشعبة (أ)", "Section B / الشعبة (ب)"] },
            ];

            for (const g of standardGrades) {
                const cls = await prisma.class.create({
                    data: { name: g.name, schoolId }
                });
                for (const secName of g.sections) {
                    await prisma.section.create({
                        data: { name: secName, classId: cls.id }
                    });
                }
            }

            classes = await prisma.class.findMany({
                where: { schoolId },
                include: { sections: true },
                orderBy: { name: 'asc' }
            });
        }

        return { success: true, data: classes };
    } catch (err: any) {
        console.error("❌ getAvailableClasses Error:", err);
        return { success: false, data: [] };
    }
}

export async function addStudent(formData: AddStudentFormData) {
    console.log("📥 Receiving student request:", formData.registrationNo);
    await ensureDb();

    const currentUser = await getCurrentUser()
    console.log("🛠️ [addStudent] Current User status:", !!currentUser, "Role:", currentUser?.role)

    if (!currentUser || (currentUser.role as string) !== 'admin') {
        return { success: false, error: "Unauthorized: Principal access required / غير مصرح: يتطلب صلاحية مدير المدرسة." }
    }

    // Password policy & confirmation validations
    if (formData.password) {
        if (formData.password.length < 6) {
            return { success: false, error: "Student temporary password must be at least 6 characters / يجب أن تتكون كلمة مرور الطالب من 6 خانات على الأقل." };
        }
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
            return { success: false, error: "Student temporary passwords do not match / كلمتا مرور الطالب غير متطابقتين." };
        }
    }

    if (formData.parentPassword) {
        if (formData.parentPassword.length < 6) {
            return { success: false, error: "Parent temporary password must be at least 6 characters / يجب أن تتكون كلمة مرور ولي الأمر من 6 خانات على الأقل." };
        }
        if (formData.confirmParentPassword && formData.parentPassword !== formData.confirmParentPassword) {
            return { success: false, error: "Parent temporary passwords do not match / كلمتا مرور ولي الأمر غير متطابقتين." };
        }
    }

    let authUserId: string | null = null;
    let parentAuthUserId: string | null = null;

    try {
        if (!prisma.student) {
            console.error("❌ Prisma student model is UNDEFINED!");
            return { success: false, error: "Database error: Student model missing." };
        }

        // Date parsing with validation
        const birthDate = new Date(formData.dateOfBirth);
        if (isNaN(birthDate.getTime())) {
            return { success: false, error: "Invalid date format for Date of Birth / تاريخ الميلاد غير صالح" };
        }

        // Sanitize registration number for safe email
        const sanitizedReg = formData.registrationNo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const safeEmail = formData.email?.trim() || `st.${sanitizedReg}@school.site`;
        const parentSafeEmail = formData.parentEmail?.trim() || `pa.${sanitizedReg}@school.site`;

        const studentPass = formData.password?.trim() || "Student@1234";
        const parentPass = formData.parentPassword?.trim() || "Parent@1234";

        const studentPasswordHash = await bcrypt.hash(studentPass, 10);
        const parentPasswordHash = await bcrypt.hash(parentPass, 10);

        // 1. Attempt Supabase Auth accounts if admin key is present
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("dummy")) {
            try {
                const { data: authData } = await supabaseAdmin.auth.admin.createUser({
                    email: safeEmail,
                    password: studentPass,
                    email_confirm: true,
                    user_metadata: { role: 'student' }
                });
                if (authData?.user) authUserId = authData.user.id;
            } catch (err) {
                console.warn("Student Supabase user creation bypassed for demo");
            }

            try {
                const { data: pAuthData } = await supabaseAdmin.auth.admin.createUser({
                    email: parentSafeEmail,
                    password: parentPass,
                    email_confirm: true,
                    user_metadata: { role: 'parent' }
                });
                if (pAuthData?.user) parentAuthUserId = pAuthData.user.id;
            } catch (err) {
                console.warn("Parent Supabase user creation bypassed for demo");
            }
        }

        if (!authUserId) {
            authUserId = `local-std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        }
        if (!parentAuthUserId) {
            parentAuthUserId = `local-par-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        }

        let createdStudent: any;

        await prisma.$transaction(async (tx: any) => {
            // Validate schoolId existence against School table
            let schoolId = currentUser.schoolId;
            let targetSchool = schoolId ? await tx.school.findUnique({ where: { id: schoolId } }) : null;
            if (!targetSchool) {
                targetSchool = await tx.school.findFirst();
                if (!targetSchool) {
                    throw new Error("No school found in the database. Please ensure a school exists.");
                }
                schoolId = targetSchool.id;
            }

            // Resolve Section ID if provided or by name
            let sectionId: string | null = formData.sectionId || null;
            if (!sectionId && formData.section) {
                const sec = await tx.section.findFirst({
                    where: {
                        name: formData.section,
                        class: { schoolId }
                    }
                });
                if (sec) sectionId = sec.id;
            }

            // 3. Create/Update Student User record
            const newUser = await tx.user.upsert({
                where: { email: safeEmail },
                update: {
                    name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Unknown Student',
                    schoolId: schoolId,
                    role: 'student',
                    status: 'active',
                    password: studentPasswordHash,
                    mustChangePassword: true
                },
                create: {
                    authUserId: authUserId as string,
                    name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Unknown Student',
                    email: safeEmail,
                    schoolId: schoolId,
                    role: 'student',
                    status: 'active',
                    password: studentPasswordHash,
                    mustChangePassword: true
                }
            });

            // 4. Create or reuse Parent User record
            let parentUser = await tx.user.findUnique({
                where: { email: parentSafeEmail }
            });
            if (!parentUser) {
                parentUser = await tx.user.create({
                    data: {
                        authUserId: parentAuthUserId as string,
                        name: `${formData.fatherName || 'Parent'}`.trim(),
                        email: parentSafeEmail,
                        schoolId: schoolId,
                        role: 'parent',
                        status: 'active',
                        password: parentPasswordHash,
                        mustChangePassword: true
                    }
                });
            } else if (!parentUser.password) {
                await tx.user.update({
                    where: { id: parentUser.id },
                    data: {
                        password: parentPasswordHash,
                        mustChangePassword: true
                    }
                });
            }

            // 5. Create the student linked to user, school, and section
            createdStudent = await tx.student.create({
                data: {
                    registrationNo: formData.registrationNo,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dateOfBirth: birthDate,
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup?.trim() || null,
                    religion: formData.religion?.trim() || null,
                    currentClass: formData.currentClass,
                    sectionName: formData.section,
                    sectionId: sectionId,
                    rollNo: Number(formData.rollNo),
                    session: formData.session,
                    fatherName: formData.fatherName,
                    motherName: formData.motherName,
                    guardianPhone: formData.guardianPhone,
                    emergencyContact: formData.emergencyContact?.trim() || null,
                    email: safeEmail,
                    presentAddress: formData.presentAddress,
                    permanentAddress: formData.permanentAddress?.trim() || null,
                    schoolId: schoolId,
                    userId: newUser.id
                },
            });

            // 6. Find or create the Parent record
            let parentRecord = await tx.parent.findFirst({
                where: {
                    OR: [
                        { userId: parentUser.id },
                        { email: parentSafeEmail }
                    ]
                }
            });

            if (!parentRecord) {
                parentRecord = await tx.parent.create({
                    data: {
                        name: formData.fatherName || 'Parent',
                        phone: formData.guardianPhone || null,
                        email: parentSafeEmail,
                        studentId: createdStudent.id,
                        userId: parentUser.id
                    }
                });
            } else if (!parentRecord.studentId) {
                await tx.parent.update({
                    where: { id: parentRecord.id },
                    data: { studentId: createdStudent.id }
                });
            }

            // 7. Join table ParentStudent for reliable multi-child relationship
            await tx.parentStudent.upsert({
                where: {
                    parentId_studentId: {
                        parentId: parentRecord.id,
                        studentId: createdStudent.id
                    }
                },
                update: {},
                create: {
                    parentId: parentRecord.id,
                    studentId: createdStudent.id
                }
            });
        });

        console.log("✅ Student and Parent successfully created:", createdStudent?.id);
        return { success: true, data: createdStudent };

    } catch (error: any) {
        console.error("❌ Student/Parent Create Database Error:", {
            code: error.code,
            message: error.message,
            meta: error.meta
        });

        // Rollback Auth Users if Prisma fails
        const rollbacks = [];
        if (authUserId) rollbacks.push(supabaseAdmin.auth.admin.deleteUser(authUserId));
        if (parentAuthUserId) rollbacks.push(supabaseAdmin.auth.admin.deleteUser(parentAuthUserId));
        
        await Promise.allSettled(rollbacks).catch(err =>
            console.error("Failed to rollback auth accounts:", err)
        );

        if (error.code === 'P2002') {
            const fields = error.meta?.target || [];
            if (fields.includes('registrationNo')) {
                return { success: false, error: "This Registration Number is already registered / رقم القيد هذا مسجل مسبقاً" };
            }
            if (fields.includes('email')) {
                return { success: false, error: "This Email is already registered / هذا البريد الإلكتروني مسجل بالفعل" };
            }
            return { success: false, error: "A unique record with this information already exists / يوجد سجل مسجل بهذه البيانات مسبقاً" };
        }

        if (error.code === 'P2003' || String(error.message).includes('FOREIGN KEY')) {
            return {
                success: false,
                error: "Database constraint validation failed: Please verify school, class, and section relationships / تعذر حفظ بيانات الطالب: يرجى التحقق من صحة المدرسة والفصل والشعبة المختارة."
            };
        }

        return { success: false, error: "Unable to save student. Please verify the entered information and try again / تعذر حفظ بيانات الطالب: يرجى التحقق من صحة البيانات والمحاولة مرة أخرى." };
    }
}

export async function getStudents() {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role as string) !== 'admin') {
        return { success: false, error: "Unauthorized: Principal access required." }
    }
    if (!currentUser.schoolId) {
        return { success: false, error: "Your account is not linked to a school." }
    }
    const schoolId = currentUser.schoolId as string;
    try {
        if (!prisma.student) return { success: false, error: "Database error." };
        const students = await prisma.student.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' }
        })
        return { success: true, data: students }
    } catch (error: any) {
        console.error("❌ Get Students Error:", error.message);
        return { success: false, error: "Failed to load students / تعذر تحميل بيانات الطلاب" }
    }
}

export async function updateStudent(id: string, formData: any) {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role as string) !== 'admin') {
        return { success: false, error: "Unauthorized: Principal access required." }
    }
    if (!currentUser.schoolId) {
        return { success: false, error: "Your account is not linked to a school." }
    }
    const schoolId = currentUser.schoolId as string;

    try {
        const birthDate = formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined;

        let student = await prisma.student.findFirst({
            where: { registrationNo: id, schoolId }
        });

        if (!student && id.length > 20) {
            student = await prisma.student.findFirst({
                where: { id, schoolId }
            });
        }

        if (!student) {
            return { success: false, error: "Student not found." };
        }

        const updated = await prisma.student.update({
            where: { id: student.id },
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                bloodGroup: formData.bloodGroup || null,
                religion: formData.religion || null,
                currentClass: formData.currentClass,
                sectionName: formData.section, // Map frontend 'section' to DB 'sectionName'
                rollNo: formData.rollNo ? Number(formData.rollNo) : undefined,
                session: formData.session,
                fatherName: formData.fatherName,
                motherName: formData.motherName,
                guardianPhone: formData.guardianPhone,
                emergencyContact: formData.emergencyContact || null,
                email: formData.email,
                presentAddress: formData.presentAddress,
                permanentAddress: formData.permanentAddress || null,
                dateOfBirth: birthDate,
            }
        });
        return { success: true, data: updated };
    } catch (error: any) {
        console.error("❌ Update Student Error:", error.message);
        return { success: false, error: "Failed to update student / تعذر تحديث بيانات الطالب" };
    }
}

export async function deleteStudent(id: string) {
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role as string) !== 'admin') {
        return { success: false, error: "Unauthorized: Principal access required." }
    }
    try {
        if (!currentUser.schoolId) {
            return { success: false, error: "Your account is not linked to a school." };
        }
        const schoolId = currentUser.schoolId as string;

        let student = await prisma.student.findFirst({
            where: { registrationNo: id, schoolId }
        });

        if (!student && id.length > 20) {
            student = await prisma.student.findFirst({
                where: { id, schoolId }
            });
        }

        if (!student) {
            return { success: false, error: "Student not found." };
        }

        await prisma.student.delete({
            where: { id: student.id }
        });

        if (student.userId) {
            await prisma.user.delete({
                where: { id: student.userId }
            });
        }

        return { success: true };
    } catch (error: any) {
        console.error("❌ Delete Student Error:", error.message);
        return { success: false, error: "Failed to delete student / تعذر حذف بيانات الطالب" };
    }
}

export async function getStudent(id: string) {
    console.log("🔍 Fetching student with ID:", id);
    const currentUser = await getCurrentUser()
    if (!currentUser || (currentUser.role as string) !== 'admin') {
        return { success: false, error: "Unauthorized: Principal access required." }
    }
    if (!currentUser.schoolId) {
        return { success: false, error: "Your account is not linked to a school." }
    }
    const schoolId = currentUser.schoolId as string;
    try {
        let student: any = null;
        
        if (id.length > 20) {
            student = await prisma.student.findFirst({
                where: { id: id, schoolId },
                include: { parents: true }
            });
        }

        if (!student) {
            student = await prisma.student.findFirst({
                where: { registrationNo: id, schoolId },
                include: { parents: true }
            });
        }

        if (!student) {
            return { success: false, error: "Student record not found in database." };
        }

        return { success: true, data: student };
    } catch (error: any) {
        console.error("❌ getStudent Error:", error.message);
        return { success: false, error: "Database communication failed." };
    }
}

export async function addMultipleStudents(studentsData: any[]) {
    console.log(`📥 Receiving bulk student request: ${studentsData.length} records`);

    try {
        if (!prisma.student || !prisma.user) {
            return { success: false, error: "Database error: Models missing." };
        }

        const currentUser = await getCurrentUser();
        const schoolId = currentUser?.schoolId;

        if (!schoolId) {
            return { success: false, error: "Unauthorized: School ID not found." };
        }

        // 1. Filter out already existing registration numbers
        const registrationNos = studentsData.map(s => s.registrationNo).filter(Boolean);
        const existingStudents = await prisma.student.findMany({
            where: {
                registrationNo: { in: registrationNos },
                schoolId: schoolId
            },
            select: { registrationNo: true }
        });

        const existingRegNos = new Set(existingStudents.map(s => s.registrationNo));
        const newStudentsData = studentsData.filter(s => !existingRegNos.has(s.registrationNo));

        if (newStudentsData.length === 0) {
            return {
                success: false,
                error: "All provided registration numbers already exist in the database.",
                skipped: studentsData.length
            };
        }

        // 2. Pre-fetch existing emails to minimize queries inside transaction
        const candidateEmails = new Set(newStudentsData.map(s => s.email?.trim()).filter(Boolean));
        const existingUsers = await prisma.user.findMany({
            where: { email: { in: Array.from(candidateEmails as any) } },
            select: { email: true }
        });
        const existingEmails = new Set(existingUsers.map(u => u.email));

        let createdCount = 0;

        // 3. Perform bulk creation in a single transaction with increased timeout
        await prisma.$transaction(async (tx) => {
            for (const data of newStudentsData) {
                const birthDate = data.dateOfBirth ? new Date(data.dateOfBirth) : new Date();
                const validBirthDate = isNaN(birthDate.getTime()) ? new Date() : birthDate;

                // For bulk, we generate a unique authUserId placeholder
                const authUserId = `auth-${data.registrationNo}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
                const safeEmail = data.email?.trim() || `student_${data.registrationNo}@school.local`;

                // Check against pre-fetched and newly added emails in this transaction
                const finalEmail = existingEmails.has(safeEmail) 
                    ? `student_${data.registrationNo}_${Date.now()}@school.local` 
                    : safeEmail;
                
                // Track newly used email to avoid collision within the same bulk batch
                existingEmails.add(finalEmail);

                const newUser = await tx.user.create({
                    data: {
                        authUserId: authUserId,
                        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown Student',
                        email: finalEmail,
                        schoolId: schoolId,
                        role: 'student',
                        status: 'active'
                    }
                });

                await tx.student.create({
                    data: {
                        registrationNo: data.registrationNo,
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        dateOfBirth: validBirthDate,
                        gender: data.gender || 'Unknown',
                        bloodGroup: data.bloodGroup?.trim() || null,
                        religion: data.religion?.trim() || null,
                        currentClass: data.currentClass || '',
                        sectionName: data.section || '',
                        rollNo: Number(data.rollNo) || 0,
                        session: data.session || '',
                        fatherName: data.fatherName || '',
                        motherName: data.motherName || '',
                        guardianPhone: data.guardianPhone || '',
                        emergencyContact: data.emergencyContact?.trim() || null,
                        email: data.email?.trim() || null,
                        presentAddress: data.presentAddress || '',
                        permanentAddress: data.permanentAddress?.trim() || null,
                        schoolId: schoolId,
                        userId: newUser.id
                    }
                });
                createdCount++;
            }
        }, {
            timeout: 30000 // Increase timeout to 30 seconds
        });

        console.log(`✅ Successfully bulk added ${createdCount} students`);

        return {
            success: true,
            count: createdCount,
            skipped: studentsData.length - createdCount
        };

    } catch (error: any) {
        console.error("❌ Bulk Student Create Error:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "A unique constraint failed during import (Duplicate Email or Registration No)." };
        }
        return { success: false, error: `Failed to import students: ${error.message || "Database error"} / فشل استيراد الطلاب` };
    }
}
