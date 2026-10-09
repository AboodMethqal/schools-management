"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getDueStudents(filters: { classId?: string; sectionId?: string }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "accountant" || !user.schoolId) return { success: false, error: "Unauthorized" };

        const schoolId = user.schoolId;

        const where: any = {
            schoolId,
            status: "PENDING"
        };

        if (filters.classId && filters.classId !== "All") {
            // Find students in this class
            where.student = {
                OR: [
                    { section: { classId: filters.classId } },
                    { currentClass: filters.classId }
                ]
            };
        }

        if (filters.sectionId && filters.sectionId !== "All") {
            where.student = { ...where.student, sectionId: filters.sectionId };
        }

        const duePayments = await prisma.payment.findMany({
            where,
            include: {
                student: {
                    include: {
                        section: {
                            include: { class: true }
                        }
                    }
                },
                fee: true
            },
            orderBy: { createdAt: "desc" }
        });

        // Group by student
        const studentGroups: Record<string, any> = {};

        duePayments.forEach(payment => {
            const student = payment.student!;
            const studentId = student.id;

            if (!studentGroups[studentId]) {
                studentGroups[studentId] = {
                    id: student.registrationNo || student.id,
                    dbId: student.id,
                    name: `${student.firstName} ${student.lastName}`.trim(),
                    class: student.section?.class.name || student.currentClass || "N/A",
                    roll: student.rollNo?.toString() || "-",
                    totalDue: 0,
                    pendingCount: 0,
                    categories: new Set<string>(),
                    oldestDueAt: payment.createdAt
                };
            }

            studentGroups[studentId].totalDue += payment.amount;
            studentGroups[studentId].pendingCount += 1;
            studentGroups[studentId].categories.add(payment.feeCategory || payment.fee?.title || "Fee");
            
            if (new Date(payment.createdAt) < new Date(studentGroups[studentId].oldestDueAt)) {
                studentGroups[studentId].oldestDueAt = payment.createdAt;
            }
        });

        const data = Object.values(studentGroups).map(group => {
            const diffTime = Math.abs(new Date().getTime() - new Date(group.oldestDueAt).getTime());
            const dueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                ...group,
                categories: Array.from(group.categories).join(", "),
                dueDays: dueDays,
                month: new Date(group.oldestDueAt).toLocaleString('default', { month: 'long' }), // Oldest month
                status: "Pending"
            };
        });

        // Sort by totalDue descending
        data.sort((a, b) => b.totalDue - a.totalDue);

        return { success: true, data };

        return { success: true, data };
    } catch (error: any) {
        console.error("Due List Error:", error);
        return { success: false, error: error.message };
    }
}
