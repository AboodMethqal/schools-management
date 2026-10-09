"use server";

import { prisma } from "@/lib/prisma";

export async function getHeroStats() {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const [allTime, daily, weekly, monthly, schoolCount, userCount] = await Promise.all([
            prisma.subscription.aggregate({
                where: { status: "SUCCESS" },
                _sum: { amount: true }
            }),
            prisma.subscription.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: today } },
                _sum: { amount: true }
            }),
            prisma.subscription.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: weekAgo } },
                _sum: { amount: true }
            }),
            prisma.subscription.aggregate({
                where: { status: "SUCCESS", createdAt: { gte: monthAgo } },
                _sum: { amount: true }
            }),
            prisma.school.count(),
            prisma.user.count({ where: { status: "active" } })
        ]);

        return {
            revenue: {
                allTime: allTime._sum.amount || 0,
                daily: daily._sum.amount || 0,
                weekly: weekly._sum.amount || 0,
                monthly: monthly._sum.amount || 0
            },
            schools: schoolCount,
            users: userCount,
            success: true
        };
    } catch (error) {
        console.error("Error fetching hero stats:", error);
        return {
            revenue: { allTime: 0, daily: 0, weekly: 0, monthly: 0 },
            schools: 0,
            users: 0,
            success: false
        };
    }
}
