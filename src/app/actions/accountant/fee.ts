"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";
import { createBulkNotifications } from "../notification";

export async function getAccountantClasses() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.schoolId) return { success: false, error: "Unauthorized" };

    const classes = await prisma.class.findMany({
      where: { schoolId: user.schoolId },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: classes };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getSectionsByClass(classId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.schoolId) return { success: false, error: "Unauthorized" };

    const sections = await prisma.section.findMany({
      where: { classId },
      orderBy: { name: 'asc' }
    });
    return { success: true, data: sections };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignClassFee(data: {
  classId: string;
  sectionId?: string;
  fees: { title: string; amount: number }[];
}) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.schoolId) return { success: false, error: "Unauthorized" };

    const { classId, sectionId, fees } = data;
    const schoolId = user.schoolId;

    if (!fees || fees.length === 0) {
      return { success: false, error: "No fees provided for assignment." };
    }

    const cls = await prisma.class.findUnique({
      where: { id: classId },
      select: { name: true }
    });

    if (!cls) return { success: false, error: "Class not found" };

    const students = await prisma.student.findMany({
      where: {
        schoolId,
        AND: [
          sectionId ? { sectionId } : {},
          {
            OR: [
              { section: { classId: classId } },
              { currentClass: cls.name }
            ]
          }
        ]
      },
      select: {
        id: true,
        userId: true,
        firstName: true,
        lastName: true,
        guardianPhone: true,
        email: true,
      }
    });

    if (students.length === 0) {
      return { success: false, error: "No students found in this class/section." };
    }

    // Process each fee title provided
    let totalAssignments = 0;

    // Use a transaction if possible, or sequential creation
    for (const feeItem of fees) {
      if (feeItem.amount <= 0) continue;

      const feeRecord = await prisma.fee.create({
        data: {
          title: feeItem.title,
          amount: feeItem.amount,
          classId,
          schoolId
        }
      });

      const paymentRecords = students.map((student, idx) => ({
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}-${idx}`,
        amount: feeItem.amount,
        currency: "YER",
        status: "PENDING",
        studentId: student.id,
        schoolId,
        feeCategory: feeItem.title,
        feeId: feeRecord.id,
        customerName: `${student.firstName} ${student.lastName}`.trim() || 'Student',
        customerEmail: student.email || 'student@school.com',
        customerPhone: student.guardianPhone || '01XXXXXXXXX'
      }));

      await prisma.payment.createMany({
        data: paymentRecords,
      });

      // --- Notification Logic ---
      const studentUserIds = students.map(s => s.userId).filter(Boolean) as string[];
      if (studentUserIds.length > 0) {
        await createBulkNotifications({
          userIds: studentUserIds,
          title: `New Fee Assigned: ${feeItem.title}`,
          message: `A new fee of ر.ي ${feeItem.amount} has been assigned to your class. Please review it in your dues section.`,
          type: "payment",
          link: `/dashboard/student/fees`
        });
      }
      // --- End Notification Logic ---

      totalAssignments += 1;
    }

    if (totalAssignments === 0) {
        return { success: false, error: "No valid fee amounts were provided." };
    }

    revalidatePath("/dashboard/accountant/fee-collection");
    revalidatePath("/dashboard/accountant/due-list");

    return { 
      success: true, 
      message: `Successfully assigned ${totalAssignments} fee type(s) to ${students.length} student(s).` 
    };

  } catch (error: any) {
    console.error("Action assignClassFee error:", error);
    return { success: false, error: "Failed to assign fees", details: error.message };
  }
}
