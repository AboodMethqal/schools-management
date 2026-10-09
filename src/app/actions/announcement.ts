"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { createBulkNotifications } from "./notification";

export async function createAnnouncement(formData: any) {
  try {
    // নিশ্চিত করুন schoolId আসছে
    if (!formData.schoolId) return { success: false, error: "School ID is missing!" };

    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: "Authentication required" };

    const newNotice = await prisma.announcement.create({
      data: {
        title: formData.title,
        content: formData.content,
        audience: formData.audience,
        targetClass: formData.audience === "students" ? formData.targetClass : null,
        category: formData.category,
        priority: formData.priority,
        schoolId: currentUser.schoolId || formData.schoolId,
        authorId: currentUser.id,
        authorName: currentUser.name,
        status: "published",
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      },
    });

    // --- Automated Notification Logic ---
    const targetSchoolId = currentUser.schoolId || formData.schoolId;
    
    // 1. Identify Target Roles
    let targetRoles: any[] = [];
    if (formData.audience === "all") {
      targetRoles = ["admin", "teacher", "student", "parent", "accountant"];
    } else if (formData.audience === "students") {
      targetRoles = ["student"];
    } else if (formData.audience === "teachers") {
      targetRoles = ["teacher"];
    } else if (formData.audience === "parents") {
      targetRoles = ["parent"];
    }

    // 2. Build User Filter
    const where: any = {
      schoolId: targetSchoolId,
      role: { in: targetRoles },
    };

    // If it's a student/parent notice for a specific class, filter further
    if (formData.targetClass && formData.targetClass !== "all") {
      where.OR = [
        { role: { notIn: ["student", "parent"] } }, 
        { student: { currentClass: formData.targetClass } },
        { parent: { student: { currentClass: formData.targetClass } } }
      ];
    }

    // 3. Fetch Target Users
    const targetUsers = await prisma.user.findMany({
      where: where,
      select: { id: true }
    });

    if (targetUsers.length > 0) {
      // Group users by role for specific linking
      const usersByRole = await prisma.user.findMany({
        where: { id: { in: targetUsers.map(u => u.id) } },
        select: { id: true, role: true }
      });

      const roleGroups: Record<string, string[]> = {};
      usersByRole.forEach(u => {
        if (!roleGroups[u.role]) roleGroups[u.role] = [];
        roleGroups[u.role].push(u.id);
      });

      for (const [role, userIds] of Object.entries(roleGroups)) {
        let link = "/dashboard";
        if (role === "student") link = `/dashboard/student/notices/${newNotice.id}`;
        else if (role === "teacher") link = `/dashboard/teacher/notices`;
        else if (role === "parent") link = `/dashboard/parent/notices`;
        else if (role === "admin") link = `/dashboard/principal/announcements`;
        else if (role === "accountant") link = `/dashboard/accountant`;

        await createBulkNotifications({
          userIds: userIds,
          title: `Announcement: ${formData.title}`,
          message: formData.content.substring(0, 100) + (formData.content.length > 100 ? "..." : ""),
          type: "academic",
          link: link
        });
      }
    }
    // --- End Notification Logic ---

    // সঠিক পাথ দিন
    revalidatePath("/dashboard/principal/announcements");
    return { success: true, data: newNotice };

  } catch (error: any) {
    console.error("❌ Announcement Error:", error.message);
    return { success: false, error: "Error: " + error.message };
  }
}

export async function getAnnouncements(schoolId: string) {
  if (!schoolId) return { success: false, error: "No School ID provided" };
  try {
    const data = await prisma.announcement.findMany({
      where: { schoolId: schoolId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to fetch announcements" };
  }
}


// get anousment by id 

export async function getAnnouncementById(id: string) {
  if (!id) return { success: false, error: "No Notice ID provided" };
  try {
    // 1. First check Principal Announcements
    let data = await prisma.announcement.findUnique({
      where: { id: id },
    });

    // 2. If not found, check Teacher Notices
    if (!data) {
      data = await (prisma.teacherNotice.findUnique({
        where: { id: id },
      }) as any);
    }

    if (!data) return { success: false, error: "Notice not found" };

    return { success: true, data };
  } catch (error) {
    console.error("❌ getAnnouncementById Error:", error);
    return { success: false, error: "Failed to fetch notice details" };
  }
}
