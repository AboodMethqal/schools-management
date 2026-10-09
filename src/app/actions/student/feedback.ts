"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getMyFeedback() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== "student") {
            return { success: false, error: "Authentication required as student" };
        }

        const student = await prisma.student.findUnique({
            where: { userId: currentUser.id }
        });

        if (!student) {
            return { success: false, error: "Student profile not found" };
        }

        const feedback = await prisma.feedback.findMany({
            where: { studentId: student.id },
            orderBy: { createdAt: 'desc' },
            include: {
                teacher: {
                    include: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        const formattedFeedback = feedback.map(f => ({
            id: f.id,
            teacherName: f.teacher.user.name,
            academic: f.academic,
            behavior: f.behavior,
            participation: f.participation,
            comment: f.comment,
            date: f.createdAt.toLocaleDateString(),
            averageRating: ((f.academic + f.behavior + f.participation) / 3).toFixed(1)
        }));

        return {
            success: true,
            data: formattedFeedback
        };

    } catch (error) {
        console.error("Error fetching student feedback:", error);
        return { success: false, error: "Failed to fetch feedback" };
    }
}
