"use server"

import { getCurrentUser } from "@/lib/getCurrentUser"
import { prisma } from "@/lib/prisma"
// import { email, success } from "zod"

import { supabaseAdmin } from "@/lib/supabase/admin"

export async function addTeacher(formData: any) {
  console.log("📥 Receiving teacher request:", formData.teacherId);

  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role as string) !== 'admin') {
    console.error("❌ Unauthorized access attempt by:", currentUser?.email || "Unknown")
    return { success: false, error: "Unauthorized: Principal access required." }
  }

  let authUserId: string | null = null;
  try {
    const schoolId = currentUser.schoolId
    if (!schoolId) {
      return { success: false, error: "System Error: Your account is not linked to any school." };
    }

    // Attempt Supabase Admin user creation if service role key exists, otherwise use local ID
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("dummy")) {
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: formData.email,
          password: "Teacher@1234",
          email_confirm: true,
          user_metadata: { role: 'teacher' }
        });
        if (!authError && authData?.user) {
          authUserId = authData.user.id;
        }
      } catch (e) {
        console.warn("Supabase user creation bypassed for local demo");
      }
    }

    if (!authUserId) {
      authUserId = `local-tch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const assignedClassesStr = Array.isArray(formData.assignedClasses)
      ? formData.assignedClasses.join(',')
      : (formData.assignedClasses || '');

    // 2️⃣ Create database records inside a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const birthDate = new Date(formData.dateOfBirth)
      if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date format provided for Date of Birth.")
      }

      // A. Update or Create Core User
      const user = await tx.user.upsert({
        where: { authUserId: authUserId as string },
        update: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          role: "teacher",
          schoolId: schoolId,
          status: "active"
        },
        create: {
          authUserId: authUserId as string,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          role: "teacher",
          schoolId: schoolId,
          status: "active"
        }
      })

      // B. Create Teacher Record
      const newTeacher = await tx.teacher.create({
        data: {
          teacherId: formData.teacherId,
          phone: formData.phone,
          dateOfBirth: birthDate,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup || null,
          religion: formData.religion || null,
          designation: formData.designation,
          department: formData.department,
          qualification: formData.qualification,
          presentAddress: formData.presentAddress,
          permanentAddress: formData.permanentAddress || null,
          assignedClasses: assignedClassesStr,
          salary: formData.salary ? parseFloat(formData.salary.toString()) : null,
          schoolId: schoolId,
          userId: user.id
        }
      })

      return newTeacher
    })

    console.log("✅ Teacher created successfully:", result.id)
    return { success: true, data: result }

  } catch (error: any) {
    console.error("❌ addTeacher CRITICAL ERROR:", error);

    // Rollback Auth User if Prisma fails
    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId).catch(err =>
        console.error("Failed to rollback auth account:", err)
      );
    }

    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      return {
        success: false,
        error: `This ${field} is already in use. Please use a unique one.`,
      };
    }

    const errorMessage = error.message || (typeof error === 'string' ? error : "Unknown Server Error");
    return { success: false, error: `Database Transaction Failed: ${errorMessage}` }
  }
}



export async function getTeachers() {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role as string) !== 'admin') {
    return { success: false, error: "Unauthorized access." }
  }

  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        user: {
          schoolId: currentUser.schoolId
        }
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })

    const mapped = teachers.map(t => ({
      ...t,
      assignedClasses: Array.isArray(t.assignedClasses)
        ? t.assignedClasses
        : (typeof t.assignedClasses === 'string'
            ? t.assignedClasses.split(',').map(s => s.trim()).filter(Boolean)
            : [])
    }))

    return { success: true, data: mapped }
  } catch (error: any) {
    console.error("❌ Get Teachers Error:", error.message)
    return { success: false, error: "Database Error: Could not load teacher list." }
  }
}

export async function updateTeacher(id: string, formData: any) {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role as string) !== 'admin') {
    return { success: false, error: "Unauthorized: Principal access required." }
  }

  try {
    const birthDate = formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined;
    if (birthDate && isNaN(birthDate.getTime())) {
      return { success: false, error: "Invalid date format for Date of Birth." }
    }

    const assignedClassesStr = Array.isArray(formData.assignedClasses)
      ? formData.assignedClasses.join(',')
      : (formData.assignedClasses || '');

    const result = await prisma.$transaction(async (tx: any) => {
      // 0. Find the teacher to get their internal IDs
      let teacher = await tx.teacher.findFirst({
        where: { teacherId: id },
        select: { id: true, userId: true }
      });

      if (!teacher) {
        teacher = await tx.teacher.findUnique({
          where: { id: id },
          select: { id: true, userId: true }
        });
      }

      if (!teacher) throw new Error("Teacher not found in directory.");

      // 1. Update Core User info
      await tx.user.update({
        where: { id: teacher.userId },
        data: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email
        }
      })

      // 2. Update Teacher profile
      const updated = await tx.teacher.update({
        where: { id: teacher.id },
        data: {
          phone: formData.phone,
          dateOfBirth: birthDate,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup || null,
          religion: formData.religion || null,
          designation: formData.designation,
          department: formData.department,
          qualification: formData.qualification,
          presentAddress: formData.presentAddress,
          permanentAddress: formData.permanentAddress || null,
          assignedClasses: assignedClassesStr,
          salary: formData.salary ? parseFloat(formData.salary.toString()) : null,
        }
      });
      return updated
    })

    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ Update Teacher Error:", error);
    return { success: false, error: `Update Failed: ${error.message}` };
  }
}

export async function deleteTeacher(id: string) {
  const currentUser = await getCurrentUser()
  if (!currentUser || (currentUser.role as string) !== 'admin') {
    return { success: false, error: "Unauthorized: Principal access required." }
  }

  try {
    // Find the record first to get internal ID
    let teacher = await prisma.teacher.findFirst({
      where: { teacherId: id },
      select: { id: true }
    })

    if (!teacher) {
      teacher = await prisma.teacher.findUnique({
        where: { id: id },
        select: { id: true }
      });
    }

    if (!teacher) return { success: false, error: "Teacher not found." }

    await prisma.teacher.delete({
      where: { id: teacher.id }
    });
    return { success: true };
  } catch (error: any) {
    console.error("❌ Delete Teacher Error:", error.message);
    return { success: false, error: `Deletion Failed: ${error.message}` };
  }
}

export async function getTeacher(id: string) {
  console.log("🔍 Fetching teacher with ID:", id);
  try {
    // Try finding by public teacherId first
    let teacher = await prisma.teacher.findFirst({
      where: { teacherId: id },
      include: { user: true }
    });

    // If not found, try finding by UUID
    if (!teacher) {
      teacher = await prisma.teacher.findUnique({
        where: { id: id },
        include: { user: true }
      });
    }

    if (!teacher) {
      return { success: false, error: "Teacher profile not found in directory." };
    }

    const mapped = {
      ...teacher,
      assignedClasses: Array.isArray(teacher.assignedClasses)
        ? teacher.assignedClasses
        : (typeof teacher.assignedClasses === 'string'
            ? teacher.assignedClasses.split(',').map(s => s.trim()).filter(Boolean)
            : [])
    };

    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("❌ getTeacher Error:", error.message);
    return { success: false, error: "Failed to communicate with faculty database." };
  }
}
