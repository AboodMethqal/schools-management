"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getAccountantHistory(filters: { type?: string; status?: string; search?: string }) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.schoolId) return { success: false, error: "Unauthorized" };

        const schoolId = user.schoolId;

        let payments: any[] = [];
        let expenses: any[] = [];

        // Fetch Payments (Income)
        if (!filters.type || filters.type === "All" || filters.type === "Payment") {
            const paymentWhere: any = { schoolId };
            if (filters.status && filters.status !== "All") {
                paymentWhere.status = filters.status;
            }
            if (filters.search) {
                paymentWhere.OR = [
                    { customerName: { contains: filters.search } },
                    { feeCategory: { contains: filters.search } },
                    { student: { firstName: { contains: filters.search } } },
                    { student: { lastName: { contains: filters.search } } },
                    { student: { registrationNo: { contains: filters.search } } }
                ];
            }

            payments = await prisma.payment.findMany({
                where: paymentWhere,
                include: { student: true },
                orderBy: { createdAt: "desc" },
                take: 100
            });
        }

        // Fetch Expenses (Outcome)
        if (!filters.type || filters.type === "All" || filters.type === "Expense") {
            const expenseWhere: any = { schoolId };
            if (filters.status && filters.status !== "All") {
                expenseWhere.status = filters.status === "SUCCESS" ? "Paid" : filters.status;
            }
            if (filters.search) {
                expenseWhere.OR = [
                    { title: { contains: filters.search } },
                    { category: { contains: filters.search } }
                ];
            }

            expenses = await prisma.expense.findMany({
                where: expenseWhere,
                orderBy: { transactionAt: "desc" },
                take: 100
            });
        }

        // Combine and format
        const history = [
            ...payments.map(p => ({
                id: p.id,
                date: p.createdAt,
                title: p.feeCategory || "Student Fee",
                source: p.customerName || `${p.student?.firstName} ${p.student?.lastName}`,
                subText: p.student?.registrationNo ? `Reg: ${p.student.registrationNo}` : "External",
                amount: p.amount,
                type: "Income",
                status: p.status,
                method: "Bank / Cash", // In a real app this would be in payment meta
            })),
            ...expenses.map(e => ({
                id: e.id,
                date: e.transactionAt,
                title: e.title,
                source: e.category,
                subText: "School Expense",
                amount: e.amount,
                type: "Outcome",
                status: e.status === "Paid" ? "SUCCESS" : e.status,
                method: "Direct",
            }))
        ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return { success: true, data: history };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
