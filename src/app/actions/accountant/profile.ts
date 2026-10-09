"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAccountantProfile() {
    try {
        const user = await getCurrentUser();
        
        if (!user || user.role !== "accountant") {
            return { success: false, error: "Unauthorized access" };
        }

        return { success: true, data: user };
    } catch (error: any) {
        return { success: false, error: error.message || "Something went wrong" };
    }
}

export async function updateAccountantProfile(data: { name: string; profileImage?: string | null }) {
    try {
        const user = await getCurrentUser();
        
        if (!user || user.role !== "accountant") {
            return { success: false, error: "Unauthorized access" };
        }

        const updateData: any = {
            name: data.name,
        };

        if (data.profileImage !== undefined) {
            updateData.profileImage = data.profileImage;
        }

        // 1. Update the Prisma DB record
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });

        // 2. Sync name to Supabase user_metadata if Supabase is active
        try {
            const supabase = await createSupabaseServerClient();
            await supabase.auth.updateUser({
                data: {
                    full_name: data.name,
                    name: data.name,
                },
            });
        } catch {
            // Ignored in local demo mode
        }

        revalidatePath("/dashboard/accountant/settings");
        revalidatePath("/dashboard/accountant");

        return { success: true, message: "Profile updated successfully", data: updatedUser };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to update profile" };
    }
}
