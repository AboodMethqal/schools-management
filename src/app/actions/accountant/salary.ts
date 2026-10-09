"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";
import { createNotification } from "../notification";

export async function getTeacherSalariesData() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "accountant" || !user.schoolId) return { success: false, error: "Unauthorized" };

        const teachers = await prisma.teacher.findMany({
            where: { schoolId: user.schoolId },
            include: { user: true, subjects: { include: { subject: true } } }
        });

        // Fetch salary payments records from Expense model
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const salaryPayments = await prisma.expense.findMany({
            where: {
                schoolId: user.schoolId,
                category: "Salary",
                transactionAt: { gte: startOfMonth }
            }
        });

        const data = teachers.map(teacher => {
            const hasPaid = salaryPayments.find(p => p.createdById === teacher.userId || p.title.includes(teacher.user.name));
            
            return {
                id: teacher.teacherId,
                name: teacher.user.name,
                subject: teacher.subjects?.[0]?.subject?.name || teacher.department || "General",
                monthlySalary: teacher.salary || 0,
                paymentDate: hasPaid ? new Date(hasPaid.transactionAt).toLocaleDateString() : "-",
                status: hasPaid ? "Paid" : "Unpaid"
            };
        });

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function payTeacherSalaryAction(teacherId: string, amount: number, teacherName: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "accountant" || !user.schoolId) return { success: false, error: "Unauthorized" };

        const schoolId = user.schoolId;

        // Fetch teacher to get their userId for notification
        const teacher = await prisma.teacher.findUnique({
            where: { teacherId: teacherId },
            select: { userId: true }
        });

        const expense = await prisma.expense.create({
            data: {
                title: `Salary Payment - ${teacherName} (${new Date().toLocaleString('default', { month: 'long' })})`,
                category: "Salary",
                amount: amount,
                transactionAt: new Date(),
                status: "Paid",
                schoolId: schoolId,
                createdById: user.id
            }
        });

        // Create notification for the teacher
        if (teacher) {
            // New Notification System
            await createNotification({
                userId: teacher.userId,
                title: "Salary Processed",
                message: `Your salary of ر.ي ${amount.toLocaleString()} for ${new Date().toLocaleString('default', { month: 'long' })} has been processed and paid.`,
                type: "payment",
                link: "/dashboard" // Or a specific salary history link if it exists
            });

            // Keep existing TeacherNotice for redundancy/history in that module
            await prisma.teacherNotice.create({
                data: {
                    title: "Salary Paid",
                    content: `Your salary of ر.ي ${amount.toLocaleString()} for ${new Date().toLocaleString('default', { month: 'long' })} has been processed and paid.`,
                    audience: "teacher",
                    priority: "normal",
                    status: "published",
                    schoolId: schoolId,
                    authorId: user.id,
                    authorName: user.name
                }
            });
        }

        revalidatePath("/dashboard/accountant/salary");
        revalidatePath("/dashboard/accountant");

        return { success: true, message: `Successfully paid ر.ي ${amount} to ${teacherName}.` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
