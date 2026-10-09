"use server"
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

/**
 * Returns the current authenticated user's schoolId from the database.
 * Reliable for ALL user types (including those created via supabaseAdmin).
 */
export async function getCurrentSchoolId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.schoolId ?? null;
}

export async function getSchoolUsers(schoolId: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        schoolId: schoolId, // নির্দিষ্ট স্কুলের ইউজারদের ফিল্টার করবে
      },
      include: {
        // ইউজারের সাথে স্কুলের তথ্যও আসবে
        school: {
          select: {
            schoolName: true,
            slug: true,
          },
        },
        // যদি ইউজারটি Student হয়, তবে তার ডাটা আসবে
        student: true,
        // যদি ইউজারটি Teacher হয়, তবে তার ডাটা আসবে
        teacher: true,
      },
      orderBy: {
        createdAt: "desc", // নতুন ইউজার আগে দেখাবে
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}




//super admin user list 

