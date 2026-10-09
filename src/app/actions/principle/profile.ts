"use server"
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



export async function getMyProfileData() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, error: "সেশন পাওয়া যায়নি। দয়া করে আবার লগইন করুন।" };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "সার্ভার এরর।" };
  }
}

// ... আগের getMyProfileData এখানে থাকবে ...

export async function updateMyProfileData(formData: { fullName: string }) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return { success: false, error: "সেশন পাওয়া যায়নি।" };
    }

    // ডাটাবেস আপডেট (বর্তমানে শুধুমাত্র নাম আপডেট করা হচ্ছে)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: formData.fullName,
      },
    });

    return { success: true, message: "প্রোফাইল সফলভাবে আপডেট হয়েছে!" };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "সার্ভার এরর। আপডেট করা সম্ভব হয়নি।" };
  }
}




//--------------------teacher der jnno profile setup



// ১. ডাটা লোড করার ফাংশন
export async function getMyTeacherProfile() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    const teacher = await prisma.teacher.findUnique({
      where: { userId: currentUser.id },
      include: { user: true }
    });

    return { success: true, data: teacher };
  } catch (error) {
    return { success: false, error: "Failed to fetch profile" };
  }
}

// ২. ডাটা আপডেট করার ফাংশন (এটি নতুন যোগ করুন)
export async function updateTeacherProfile(data: any) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    await prisma.$transaction([
      // ইউজার টেবিলে নাম আপডেট
      prisma.user.update({
        where: { id: currentUser.id },
        data: { name: data.name }
      }),
      // টিচার টেবিলে বাকি সব আপডেট
      prisma.teacher.update({
        where: { userId: currentUser.id },
        data: {
          phone: data.phone,
          designation: data.designation,
          department: data.department,
          qualification: data.qualification,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          religion: data.religion,
          presentAddress: data.presentAddress,
          permanentAddress: data.permanentAddress,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        }
      })
    ]);

    revalidatePath("/profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Update failed" };
  }
}
