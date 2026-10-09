"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getMyAttendance() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "student") {
      return { success: false, error: "Authentication required as student" };
    }

    const student = await prisma.student.findUnique({
      where: { userId: currentUser.id },
    });

    if (!student) {
      return { success: false, error: "Student profile not found" };
    }

    const attendance = await prisma.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
    });

    // Calculate Stats
    const totalRecords = attendance.length;
    const presentCount = attendance.filter(
      (a) => a.status === "PRESENT",
    ).length;
    const lateCount = attendance.filter((a) => a.status === "LATE").length;
    const absentCount = attendance.filter((a) => a.status === "ABSENT").length;

    const attendancePercentage =
      totalRecords > 0
        ? (((presentCount + lateCount * 0.5) / totalRecords) * 100).toFixed(1)
        : "0.0";

    const stats = {
      totalDays: totalRecords,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      percentage: attendancePercentage,
    };

    // Format for history table
    const history = attendance.map((a) => ({
      id: a.id,
      date: new Date(a.date).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: a.status.charAt(0) + a.status.slice(1).toLowerCase(), // PRESENT -> Present
    }));

    return {
      success: true,
      data: {
        stats,
        history,
      },
    };
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return { success: false, error: "Failed to fetch attendance" };
  }
}
