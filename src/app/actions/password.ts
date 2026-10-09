"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function changeInitialPassword(formData: {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return {
                success: false,
                error: "Unauthorized: Please log in first / غير مصرح: يرجى تسجيل الدخول أولاً."
            };
        }

        const currentPassword = formData.currentPassword?.trim() || "";
        const newPassword = formData.newPassword?.trim() || "";
        const confirmPassword = formData.confirmPassword?.trim() || "";

        if (!currentPassword) {
            return {
                success: false,
                error: "Current password is required / كلمة المرور الحالية مطلوبة."
            };
        }

        if (!newPassword || newPassword.length < 6) {
            return {
                success: false,
                error: "New password must be at least 6 characters / يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل."
            };
        }

        if (newPassword !== confirmPassword) {
            return {
                success: false,
                error: "New passwords do not match / كلمتا المرور الجديدتان غير متطابقتين."
            };
        }

        if (newPassword === currentPassword) {
            return {
                success: false,
                error: "New password must be different from current password / يجب أن تختلف كلمة المرور الجديدة عن الحالية."
            };
        }

        // Fetch user from database
        const dbUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: currentUser.id },
                    { email: currentUser.email },
                    { authUserId: currentUser.authUserId || currentUser.id }
                ]
            }
        });

        if (!dbUser) {
            return {
                success: false,
                error: "User account not found / تعذر العثور على حساب المستخدم."
            };
        }

        // Validate current password
        let isValidCurrent = false;
        if (dbUser.password) {
            if (dbUser.password.startsWith("$2")) {
                isValidCurrent = await bcrypt.compare(currentPassword, dbUser.password);
            } else {
                isValidCurrent = dbUser.password === currentPassword;
            }
        }

        if (!isValidCurrent) {
            return {
                success: false,
                error: "Invalid current password / كلمة المرور الحالية غير صحيحة."
            };
        }

        // Hash new password securely
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Update database
        await prisma.user.update({
            where: { id: dbUser.id },
            data: {
                password: newHashedPassword,
                mustChangePassword: false
            }
        });

        // Update active session cookie
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('auth_session')?.value;
        if (sessionCookie) {
            try {
                const decoded = sessionCookie.includes('%') ? decodeURIComponent(sessionCookie) : sessionCookie;
                const sessionUser = JSON.parse(decoded);
                sessionUser.mustChangePassword = false;

                cookieStore.set('auth_session', JSON.stringify(sessionUser), {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7,
                });
            } catch (err) {
                console.warn("Failed to update session cookie:", err);
            }
        }

        console.log(`✅ Password successfully changed for user: ${dbUser.email} (mustChangePassword reset to false)`);

        return {
            success: true,
            role: dbUser.role,
            message: "Password changed successfully / تم تغيير كلمة المرور بنجاح."
        };

    } catch (error: any) {
        console.error("❌ changeInitialPassword Error:", error);
        return {
            success: false,
            error: "Unable to change password. Please try again / تعذر تغيير كلمة المرور. يرجى المحاولة مرة أخرى."
        };
    }
}
