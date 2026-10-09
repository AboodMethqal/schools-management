"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/getCurrentUser";
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | string;

export async function saveAttendance(records: {
    studentId: string;
    status: AttendanceStatus;
    date: string;
    classId: string;
}[]) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Authentication required" };
        if (!currentUser.schoolId) return { success: false, error: "Your account is not linked to a school." };
        const schoolId = currentUser.schoolId as string;

        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id }
        });

        if (!teacher) return { success: false, error: "Teacher profile not found" };

        for (const record of records) {
            const attendanceDate = new Date(record.date);
            attendanceDate.setHours(0, 0, 0, 0);

            const existing = await prisma.attendance.findFirst({
                where: {
                    studentId: record.studentId,
                    date: attendanceDate
                }
            });

            if (existing) {
                await prisma.attendance.update({
                    where: { id: existing.id },
                    data: { status: record.status, teacherId: teacher.id }
                });
            } else {
                await prisma.attendance.create({
                    data: {
                        studentId: record.studentId,
                        status: record.status,
                        date: attendanceDate,
                        classId: record.classId,
                        schoolId: schoolId,
                        teacherId: teacher.id
                    }
                });
            }
        }

        revalidatePath("/dashboard/teacher/attendance");
        return { success: true };
    } catch (error) {
        console.error("Error saving attendance:", error);
        return { success: false, error: "Failed to save attendance" };
    }
}

export async function getAttendance(classId: string, date: string) {
    try {
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        const records = await prisma.attendance.findMany({
            where: {
                classId,
                date: attendanceDate
            }
        });
        return { success: true, data: records };
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return { success: false, error: "Failed to fetch attendance" };
    }
}
