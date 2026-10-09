"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function addStudent(formData: {
    registrationNo: string
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    bloodGroup?: string
    religion?: string
    currentClass: string
    section: string
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
    parentEmail?: string
    parentPassword?: string
}) {
    console.log("📥 Receiving student request:", formData.registrationNo);

    const currentUser = await getCurrentUser()
    console.log("🛠️ [addStudent] Current User status:", !!currentUser, "Role:", currentUser?.role)

    if (!currentUser || (currentUser.role as string) !== 'admin') {
        return { success: false, error: "Unauthorized: Principal access required." }
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

        // 1. Attempt Supabase Auth accounts if admin key is present
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("dummy")) {
            try {
                const { data: authData } = await supabaseAdmin.auth.admin.createUser({
                    email: safeEmail,
                    password: formData.password || "Student@1234",
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
                    password: formData.parentPassword || "Parent@1234",
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
            const schoolId = currentUser.schoolId; // Always use principal's school
            if (!schoolId) throw new Error("Unauthorized: School ID not found for this user.");

            // 3. Create/Update Student User record
            const newUser = await tx.user.upsert({
                where: { authUserId: authUserId as string },
                update: {
                    name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Unknown Student',
                    email: safeEmail,
                    schoolId: schoolId,
                    role: 'student',
                    status: 'active'
                },
                create: {
                    authUserId: authUserId as string,
                    name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Unknown Student',
                    email: safeEmail,
                    schoolId: schoolId,
                    role: 'student',
                    status: 'active'
                }
            });

            // 4. Create Parent User record
            const newParentUser = await tx.user.upsert({
                where: { authUserId: parentAuthUserId as string },
                update: {
                    name: `${formData.fatherName || 'Parent'}`.trim(),
                    email: parentSafeEmail,
                    schoolId: schoolId,
                    role: 'parent',
                    status: 'active'
                },
                create: {
                    authUserId: parentAuthUserId as string,
                    name: `${formData.fatherName || 'Parent'}`.trim(),
                    email: parentSafeEmail,
                    schoolId: schoolId,
                    role: 'parent',
                    status: 'active'
                }
            });

            // 5. Create the student linked to user
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

            // 6. Create the Parent record linked to User and Student
            await tx.parent.create({
                data: {
                    name: formData.fatherName,
                    phone: formData.guardianPhone,
                    email: parentSafeEmail,
                    studentId: createdStudent.id,
                    userId: newParentUser.id
                }
            });
        });

        console.log("✅ Student and Parent successfully created:", createdStudent?.id);
        return { success: true, data: createdStudent };

    } catch (error: any) {
        console.error("❌ Student/Parent Create Database Error:", error);

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
                return { success: false, error: "এই Registration No টি আগেই ব্যবহার করা হয়েছে!" };
            }
            if (fields.includes('email')) {
                return { success: false, error: "এই Email টি আগেই ব্যবহার করা হয়েছে!" };
            }
            return { success: false, error: "এই তথ্যটি আগে থেকেই ডাটাবেসে আছে!" };
        }

        return { success: false, error: `সার্ভার এরর: ${error.message || "Database error occurred"}` }
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
        console.error("âŒ Get Students Error:", error.message)
        return { success: false, error: "à¦›à¦¾à¦¤à§à¦°-à¦›à¦¾à¦¤à§à¦°à§€à¦¦à§‡à¦° à¦¤à¦¥à§à¦¯ à¦²à§‹à¦¡ à¦•à¦°à¦¤à§‡ à¦¸à¦®à¦¸à§à¦¯à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤" }
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
        return { success: false, error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" };
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
        return { success: false, error: "মুছে ফেলতে সমস্যা হয়েছে।" };
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
        return { success: false, error: `সার্ভার এরর: ${error.message || "Database error occurred"}` };
    }
}
