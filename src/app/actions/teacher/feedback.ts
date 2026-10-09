"use server"

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export async function addFeedback(data: {
    studentId: string;
    academic: number;
    behavior: number;
    participation: number;
    comment: string;
}) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || (currentUser.role as string) !== 'teacher') {
            return { success: false, error: "Unauthorized: Teacher access required." };
        }

        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id },
            select: { id: true, schoolId: true }
        });

        if (!teacher) {
            return { success: false, error: "Teacher profile not found." };
        }

        const feedback = await prisma.feedback.create({
            data: {
                academic: data.academic,
                behavior: data.behavior,
                participation: data.participation,
                comment: data.comment,
                studentId: data.studentId,
                teacherId: teacher.id,
                schoolId: teacher.schoolId
            }
        });

        revalidatePath("/dashboard/teacher/feedback");
        return { success: true, data: feedback };
    } catch (error: any) {
        console.error("❌ addFeedback Error:", error);
        return { success: false, error: "Failed to save feedback." };
    }
}

export async function getStudentFeedback(studentId: string) {
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: { studentId },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: feedbacks };
    } catch (error: any) {
        console.error("❌ getStudentFeedback Error:", error);
        return { success: false, error: "Failed to fetch feedback history." };
    }
}
