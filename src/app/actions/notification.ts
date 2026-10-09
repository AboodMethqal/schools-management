"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function getNotifications(limit = 5) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return { success: true, data: notifications, unreadCount };
  } catch (error: any) {
    console.error("❌ getNotifications Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function getAllNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: notifications };
  } catch (error: any) {
    console.error("❌ getAllNotifications Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function markAsRead(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.notification.update({
      where: { id, userId: user.id },
      data: { isRead: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("❌ markAsRead Error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function markAllAsRead() {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("❌ markAllAsRead Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Utility to create a notification for a user
 * Can be called from other server actions (e.g. results, feedback, payments)
 */
export async function createNotification({
  userId,
  title,
  message,
  type = "system",
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
    return { success: true, data: notification };
  } catch (error: any) {
    console.error("❌ createNotification Error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Utility to create notifications for multiple users in bulk
 */
export async function createBulkNotifications({
  userIds,
  title,
  message,
  type = "system",
  link,
}: {
  userIds: string[];
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      title,
      message,
      type,
      link,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return { success: true };
  } catch (error: any) {
    console.error("❌ createBulkNotifications Error:", error.message);
    return { success: false, error: error.message };
  }
}
