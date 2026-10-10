"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

import bcrypt from "bcryptjs";

export async function createSchool(formData: any) {
  console.log("📥 Creating new school and principal:", formData.schoolName);

  const currentUser = await getCurrentUser();
  if (!currentUser || (currentUser.role as string) !== 'super_admin') {
    console.error("❌ Unauthorized access attempt by:", currentUser?.email || "Unknown");
    return { success: false, error: "Unauthorized: Super Admin access required." };
  }

  let adminAuthUserId: string | null = null;
  let accountantAuthUserId: string | null = null;

  try {
    const rawAdminPass = formData.adminPassword || "School@123456";
    const rawAccountantPass = formData.accountantPassword || "Accountant@123456";

    const adminPasswordHash = await bcrypt.hash(rawAdminPass, 10);
    const accountantPasswordHash = await bcrypt.hash(rawAccountantPass, 10);

    // 1️⃣ Create the Principal in Supabase Auth if service role key is present
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("dummy")) {
      try {
        const { data: adminAuthData } = await supabaseAdmin.auth.admin.createUser({
          email: formData.adminEmail,
          password: rawAdminPass,
          email_confirm: true,
          user_metadata: { role: 'admin' }
        });
        if (adminAuthData?.user) adminAuthUserId = adminAuthData.user.id;
      } catch (err) {
        console.warn("Principal Supabase creation bypassed for demo");
      }

      try {
        const { data: accountantAuthData } = await supabaseAdmin.auth.admin.createUser({
          email: formData.accountantEmail,
          password: rawAccountantPass,
          email_confirm: true,
          user_metadata: { role: 'accountant' }
        });
        if (accountantAuthData?.user) accountantAuthUserId = accountantAuthData.user.id;
      } catch (err) {
        console.warn("Accountant Supabase creation bypassed for demo");
      }
    }

    if (!adminAuthUserId) {
      adminAuthUserId = `local-adm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    }
    if (!accountantAuthUserId) {
      accountantAuthUserId = `local-acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 2️⃣ Create School
      const newSchool = await tx.school.create({
        data: {
          schoolName: formData.schoolName,
          slug: formData.slug,
          schoolEmail: formData.schoolEmail,
          phone: formData.phone || null,
          address: formData.address || null,
          plan: formData.plan || "basic",
          duration: formData.duration || "12",
          schoolCategory: formData.schoolCategory,
          expectedStudents: formData.expectedStudents ? Number(formData.expectedStudents) : null,
          registrationId: formData.registrationId,
          facebookUrl: formData.facebookUrl || null,
          websiteUrl: formData.websiteUrl || null,
          language: formData.language || "english",
        },
      });

      // 3️⃣ Update or Create Admin User record
      await tx.user.upsert({
        where: { email: formData.adminEmail },
        update: {
          name: formData.adminName,
          role: "admin",
          schoolId: newSchool.id,
          status: "active",
          password: adminPasswordHash,
          mustChangePassword: true,
        },
        create: {
          authUserId: adminAuthUserId as string,
          name: formData.adminName,
          email: formData.adminEmail,
          role: "admin",
          schoolId: newSchool.id,
          status: "active",
          password: adminPasswordHash,
          mustChangePassword: true,
        },
      });

      // 4️⃣ Create Accountant User record
      await tx.user.upsert({
        where: { email: formData.accountantEmail },
        update: {
          name: formData.accountantName,
          role: "accountant",
          schoolId: newSchool.id,
          status: "active",
          password: accountantPasswordHash,
          mustChangePassword: true,
        },
        create: {
          authUserId: accountantAuthUserId as string,
          name: formData.accountantName,
          email: formData.accountantEmail,
          role: "accountant",
          schoolId: newSchool.id,
          status: "active",
          password: accountantPasswordHash,
          mustChangePassword: true,
        }
      });

      // 5️⃣ Generate Classes
      if (formData.numberOfClasses && formData.numberOfClasses > 0) {
        const classesToCreate = [];
        for (let i = 1; i <= formData.numberOfClasses; i++) {
          classesToCreate.push({
            name: `Class ${i}`,
            schoolId: newSchool.id
          });
        }
        await tx.class.createMany({
          data: classesToCreate
        });
      }

      return newSchool;
    });

    // Revalidate paths for Super Admin and public views
    revalidatePath("/dashboard/super-admin/schools");
    revalidatePath("/schools");
    revalidatePath("/");

    return { success: true, data: result };

  } catch (error: any) {
    console.error("❌ createSchool CRITICAL ERROR:", error);

    // Rollback Auth Users if Prisma fails
    if (adminAuthUserId) {
      await supabaseAdmin.auth.admin.deleteUser(adminAuthUserId).catch(err =>
        console.error("Failed to rollback admin auth string:", err)
      );
    }
    if (accountantAuthUserId) {
      await supabaseAdmin.auth.admin.deleteUser(accountantAuthUserId).catch(err =>
        console.error("Failed to rollback accountant auth string:", err)
      );
    }

    // Unique constraint error check
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "field";
      return {
        success: false,
        error: `This ${field} is already in use. Please use a unique one.`,
      };
    }

    return {
      success: false,
      error: error.message || "Database error occurred.",
    };
  }
}

// 1. Fetch all schools
export async function getAllSchools() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: schools };
  } catch (error) {
    return { success: false, error: "Failed to fetch schools" };
  }
}

// 2. Fetch all users
export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        school: {
          select: {
            schoolName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch users / تعذر تحميل بيانات المستخدمين" };
  }
}
// 1. Update school function
export async function updateSchool(id: string, formData: any) {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.school.update({
        where: { id },
        data: {
          schoolName: formData.schoolName,
          slug: formData.slug,
          schoolEmail: formData.schoolEmail,
          phone: formData.phone || null,
          address: formData.address || null,
          plan: formData.plan,
          duration: formData.duration,
          schoolCategory: formData.schoolCategory,
          expectedStudents: formData.expectedStudents ? Number(formData.expectedStudents) : null,
          registrationId: formData.registrationId,
          facebookUrl: formData.facebookUrl || null,
          websiteUrl: formData.websiteUrl || null,
          language: formData.language,
        },
      });

      // Generate Additional Classes if needed
      if (formData.numberOfClasses && formData.numberOfClasses > 0) {
        const currentClassCount = await tx.class.count({
          where: { schoolId: id }
        });

        if (formData.numberOfClasses > currentClassCount) {
          const classesToCreate = [];
          for (let i = currentClassCount + 1; i <= formData.numberOfClasses; i++) {
            classesToCreate.push({
              name: `Class ${i}`,
              schoolId: id
            });
          }
          await tx.class.createMany({
            data: classesToCreate
          });
        }
      }

      return updated;
    });

    revalidatePath("/schools");
    revalidatePath(`/schools/${id}`);
    revalidatePath("/dashboard/super-admin/schools");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ Update Error:", error.message);
    return { success: false, error: "Update failed: " + error.message };
  }
}

// Fetch school by ID
export async function getSchoolById(id: string) {
  try {
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        _count: {
          select: { classes: true }
        }
      }
    });
    if (!school) return { success: false, error: "School not found" };
    
    // Flatten the result to match the expected format
    const { _count, ...schoolData } = school;
    return { 
      success: true, 
      data: { 
        ...schoolData, 
        numberOfClasses: _count.classes 
      } 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMySchool() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.schoolId) {
      console.log("⚠️ getMySchool: No authorized user or schoolId found");
      return { success: false, error: "Unauthorized" };
    }
    
    console.log(`🔍 getMySchool: Fetching data for schoolId [${user.schoolId}]`);
    
    // Fetch School with Subscriptions
    const school = await prisma.school.findUnique({
      where: { id: user.schoolId },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!school) {
      console.log(`❌ getMySchool: School [${user.schoolId}] not found in DB`);
      return { success: false, error: "School not found" };
    }

    console.log(`📊 getMySchool: Stats for [${school.schoolName}]`);
    console.log(`   - Plan: ${school.plan}`);
    console.log(`   - Subscriptions Found: ${school.subscriptions?.length || 0}`);

    return { success: true, data: JSON.parse(JSON.stringify(school)) };
  } catch (error: any) {
    console.error("🔥 getMySchool CRITICAL ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

// 2. Delete school function
export async function deleteSchool(id: string) {
  try {
    // Transaction to safely delete users and school
    await prisma.$transaction(async (tx: any) => {

      // 1. Delete associated users
      await tx.user.deleteMany({
        where: { schoolId: id },
      });

      // 2. Delete school
      await tx.school.delete({
        where: { id },
      });
    });

    revalidatePath("/dashboard/super-admin/schools");

    return { success: true, message: "School and its users deleted successfully" };
  } catch (error: any) {
    console.error("❌ Delete Error:", error.message);
    return {
      success: false,
      error: "Cannot delete school: Active users or students are associated with it / لا يمكن حذف المدرسة لوجود بيانات مرتبطة بها."
    };
  }
}

// plan chart 
export async function getPlanStats() {
  const plans = await prisma.school.groupBy({
    by: ["plan"],
    _count: {
      plan: true
    }
  })

  return plans
}
