"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getFinancialReportsData() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "accountant" || !user.schoolId) return { success: false, error: "Unauthorized" };

        const schoolId = user.schoolId;

        // 1. Revenue vs Expense (Last 6 Months)
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                month: date.toLocaleString('default', { month: 'short' }),
                start: new Date(date),
                end: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            });
        }

        const analytics = await Promise.all(months.map(async (m) => {
            const revenue = await prisma.payment.aggregate({
                where: { schoolId, status: "SUCCESS", createdAt: { gte: m.start, lte: m.end } },
                _sum: { amount: true }
            });
            const expense = await prisma.expense.aggregate({
                where: { schoolId, status: "Paid", transactionAt: { gte: m.start, lte: m.end } },
                _sum: { amount: true }
            });

            return {
                month: m.month,
                revenue: revenue._sum.amount || 0,
                expense: expense._sum.amount || 0
            };
        }));

        // 2. Expense Breakdown (Current Month)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const expenseCategories = await prisma.expense.groupBy({
            by: ['category'],
            where: { schoolId, status: "Paid", transactionAt: { gte: startOfMonth } },
            _sum: { amount: true }
        });

        const totalMonthlyExpense = expenseCategories.reduce((acc, curr) => acc + (curr._sum.amount || 0), 0);
        const breakdownColors: any = {
            "Salary": "#4f46e5",
            "Utility": "#06b6d4",
            "Maintenance": "#f59e0b",
            "Event": "#8b5cf6",
            "Rent": "#6366f1",
            "Others": "#ec4899"
        };

        const breakdown = expenseCategories.map((cat, idx) => ({
            name: cat.category,
            value: totalMonthlyExpense > 0 ? parseFloat(((cat._sum.amount || 0) / totalMonthlyExpense * 100).toFixed(1)) : 0,
            color: breakdownColors[cat.category] || "#94a3b8"
        }));

        // 3. Collection Trend (Last 7 Days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            last7Days.push({
                day: date.toLocaleString('default', { weekday: 'short' }),
                start: new Date(date.setHours(0, 0, 0, 0)),
                end: new Date(date.setHours(23, 59, 59, 999))
            });
        }

        const trends = await Promise.all(last7Days.map(async (d) => {
            const amount = await prisma.payment.aggregate({
                where: { schoolId, status: "SUCCESS", createdAt: { gte: d.start, lte: d.end } },
                _sum: { amount: true }
            });
            return {
                day: d.day,
                amount: amount._sum.amount || 0
            };
        }));

        return {
            success: true,
            data: {
                analytics,
                breakdown,
                trends,
                totalMonthlyExpense
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
