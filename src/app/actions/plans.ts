"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function parseModules(modules: any): string[] {
    if (!modules) return [];
    if (Array.isArray(modules)) return modules;
    if (typeof modules === 'string') {
        try {
            const parsed = JSON.parse(modules);
            if (Array.isArray(parsed)) return parsed;
        } catch {}
        return modules.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
}

export async function getPlans() {
    try {
        const plans = await prisma.plan.findMany({
            orderBy: { createdAt: 'asc' },
        });
        const mapped = plans.map(p => ({
            ...p,
            modules: parseModules(p.modules),
        }));
        return { success: true, data: mapped };
    } catch (error: any) {
        console.error("❌ Prisma Error:", error.message);
        return { success: false, error: "Failed to fetch plans" };
    }
}

export async function getPlan(id: string) {
    try {
        const plan = await prisma.plan.findUnique({
            where: { id },
        });
        if (!plan) return { success: false, error: "Plan not found" };
        return { success: true, data: { ...plan, modules: parseModules(plan.modules) } };
    } catch (error: any) {
        console.error("❌ Prisma Error:", error.message);
        return { success: false, error: "Failed to fetch plan" };
    }
}

export async function createPlan(formData: any) {
    try {
        const newPlan = await prisma.plan.create({
            data: {
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                icon: formData.icon,
                color: formData.color,
                students: formData.students,
                teachers: formData.teachers,
                storage: formData.storage,
            },
        });

        revalidatePath("/dashboard/super-admin/plans");
        return { success: true, data: newPlan };
    } catch (error: any) {
        console.error("❌ Prisma Error:", error.message);
        return { success: false, error: "Failed to create plan" };
    }
}

export async function updatePlan(id: string, formData: any) {
    try {
        const updatedPlan = await prisma.plan.update({
            where: { id },
            data: {
                name: formData.name,
                price: formData.price,
                duration: formData.duration,
                icon: formData.icon,
                color: formData.color,
                students: formData.students,
                teachers: formData.teachers,
                storage: formData.storage,
            },
        });

        revalidatePath("/dashboard/super-admin/plans");
        return { success: true, data: updatedPlan };
    } catch (error: any) {
        console.error("❌ Prisma Error:", error.message);
        return { success: false, error: "Failed to update plan" };
    }
}

export async function deletePlan(id: string) {
    try {
        await prisma.plan.delete({
            where: { id },
        });

        revalidatePath("/dashboard/super-admin/plans");
        return { success: true, message: "Plan deleted successfully" };
    } catch (error: any) {
        console.error("❌ Prisma Error:", error.message);
        return { success: false, error: "Failed to delete plan" };
    }
}
