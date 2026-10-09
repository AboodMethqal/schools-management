"use server"

import { getCurrentUser } from "@/lib/getCurrentUser"
import { prisma } from "@/lib/prisma"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function addStudent(formData: any) {
  console.log("📥 Receiving student request for:", formData.registrationNo);

  const currentUser = await getCurrentUser()
  // শুধু এডমিন বা প্রিন্সিপাল স্টুডেন্ট এড করতে পারবে
  if (!currentUser || (currentUser.role as string) !== 'admin') {
    return { success: false, error: "Unauthorized: Principal access required." }
  }

  const schoolId = currentUser.schoolId
  if (!schoolId) {
    return { success: false, error: "System Error: Your account is not linked to any school." };
  }

  let authUserId: string | null = null;

  try {
    // ১. Supabase Auth-এ একাউন্ট তৈরি (যাতে এই ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করা যায়)
    console.log("🛠️ Creating Supabase Auth account for student:", formData.email);
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: formData.email,
      password: formData.password || "Student@1234", // পাসওয়ার্ড না দিলে ডিফল্ট পাসওয়ার্ড
      email_confirm: true,
      user_metadata: { role: 'student' }
    });

    if (authError) {
      console.error("❌ Supabase Auth Error:", authError.message);
      return { success: false, error: "Auth Error: " + authError.message };
    }

    authUserId = authData.user.id;

    // ২. ডাটাবেজ ট্রানজ্যাকশন (User এবং Student টেবিলে ডাটা সেভ করা)
    const result = await prisma.$transaction(async (tx: any) => {
      
      // A. User টেবিলে ডাটা সেভ (এখানেই ইমেইল থাকে যা লগইনের জন্য ব্যবহৃত হবে)
      const user = await tx.user.create({
        data: {
          authUserId: authUserId as string,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email, // এই ইমেইল দিয়েই স্টুডেন্ট লগইন করবে
          role: "student",
          schoolId: schoolId,
          status: "active"
        }
      });

      // B. Student টেবিলে স্টুডেন্টের একাডেমিক ডাটা সেভ
      const student = await tx.student.create({
        data: {
          registrationNo: formData.registrationNo,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: new Date(formData.dateOfBirth),
          gender: formData.gender,
          bloodGroup: formData.bloodGroup || null,
          currentClass: formData.currentClass,
          sectionName: formData.section, // তোমার স্কিমা অনুযায়ী
          rollNo: parseInt(formData.rollNo.toString()),
          session: formData.session,
          fatherName: formData.fatherName,
          motherName: formData.motherName,
          guardianPhone: formData.guardianPhone,
          presentAddress: formData.presentAddress,
          schoolId: schoolId,
          userId: user.id, // User টেবিলের সাথে লিংক করা হলো
        }
      });

      return student;
    });

    console.log("✅ Student created successfully:", result.id);
    revalidatePath("/dashboard/principal/students");
    return { success: true, data: result };

  } catch (error: any) {
    // যদি প্রিজমায় কোনো এরর হয়, তাহলে সুপাবেস থেকে তৈরি করা ইউজারটি ডিলিট করে দিতে হবে (রোলব্যাক)
    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId).catch(err =>
        console.error("Failed to rollback auth account:", err)
      );
    }

    console.error("❌ addStudent ERROR:", error);
    return { success: false, error: error.message || "Database Transaction Failed" };
  }
}

// স্টুডেন্ট ডাটা গেট করার ফাংশন (ইমেইলসহ)
export async function getStudent(id: string) {
  try {
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id: id },
          { registrationNo: id }
        ]
      },
      include: {
        user: true // এর ফলে তুমি student.user.email এক্সেস করতে পারবে
      }
    });

    if (!student) return { success: false, error: "Student not found" };
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}



//////////////----------------------------ei kahne hocce from er info gula mane profile thik ace

// লগইন করা স্টুডেন্টের ডাটা পাওয়ার ফাংশন
export async function getMyStudentProfile() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'student') return { success: false, error: "Unauthorized" };

    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      include: { user: true }
    });

    return { success: true, data: student };
  } catch (error) {
    return { success: false, error: "Failed to load profile" };
  }
}

// স্টুডেন্টের প্রোফাইল আপডেট করার ফাংশন
export async function updateMyStudentProfile(formData: any) {
    try {
        const user = await getCurrentUser();
        if (!user) return { success: false, error: "Unauthorized" };

        const updatedStudent = await prisma.student.update({
            where: { userId: user.id },
            data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                guardianPhone: formData.guardianPhone,
                bloodGroup: formData.bloodGroup,
                religion: formData.religion,
                presentAddress: formData.presentAddress,
            },
            // এটি গুরুত্বপূর্ণ: আপডেট হওয়া ডাটা সাথে User ইনফোও নিয়ে আসবে
            include: { user: true } 
        });

        // revalidatePath("/profile"); // এটি অপশনাল যদি আমরা স্টেট আপডেট করি
        return { success: true, message: "Updated!", data: updatedStudent };
    } catch (error) {
        return { success: false, error: "Update failed" };
    }
}



///////////////-------------------------update hobe ei kahne student er profile--------------


