"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function uploadMaterialToImgBB(formData: FormData) {
    try {
        const apiKey = process.env.IMGBB_API_KEY;
        if (!apiKey) {
            console.error("IMGBB_API_KEY is missing in server environment");
            return { success: false, error: "Server Configuration Error: IMGBB_API_KEY is missing." };
        }

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            return { success: true, url: data.data.url };
        } else {
            return { success: false, error: data.error?.message || "Upload failed" };
        }
    } catch (error: any) {
        console.error("ImgBB Upload Error:", error);
        return { success: false, error: error.message || "Failed to upload to ImgBB" };
    }
}

export async function getStudyMaterials(schoolId?: string) {
    try {
        let finalSchoolId = schoolId;
        if (!finalSchoolId) {
            const currentUser = await getCurrentUser();
            finalSchoolId = currentUser?.schoolId || "";
        }

        const whereClause = finalSchoolId ? { schoolId: finalSchoolId } : {};
        const materials = await prisma.studyMaterial.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: materials };
    } catch (error) {
        console.error("Error fetching study materials:", error);
        return { success: false, error: "Failed to fetch study materials" };
    }
}

export async function createStudyMaterial(formData: {
    title: string;
    type: string;
    subject: string;
    class: string;
    description?: string;
    attachmentUrl: string;
    size?: string;
    schoolId: string;
    teacherId: string;
}) {
    try {
        const currentUser = await getCurrentUser();
        const schoolId = currentUser?.schoolId || formData.schoolId;

        if (!schoolId || !currentUser) {
            return { success: false, error: "Authentication Error: School ID or User session missing." };
        }

        // Find the teacher ID linked to this user
        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id }
        });

        if (!teacher) {
            return { success: false, error: "Teacher Profile Error: Your teacher profile was not found in the database. Please contact your administrator." };
        }

        const material = await prisma.studyMaterial.create({
            data: {
                ...formData,
                schoolId: schoolId,
                teacherId: teacher.id // Securely from database
            }
        });
        revalidatePath("/dashboard/teacher/study-materials");
        return { success: true, data: material };
    } catch (error) {
        console.error("Error creating study material:", error);
        return { success: false, error: "Failed to create study material" };
    }
}

export async function updateStudyMaterial(id: string, formData: {
    title: string;
    type: string;
    subject: string;
    class: string;
    description?: string;
    attachmentUrl: string;
    size?: string;
}) {
    try {
        const material = await prisma.studyMaterial.update({
            where: { id },
            data: formData
        });
        revalidatePath("/dashboard/teacher/study-materials");
        return { success: true, data: material };
    } catch (error) {
        console.error("Error updating study material:", error);
        return { success: false, error: "Failed to update study material" };
    }
}

export async function deleteStudyMaterial(id: string) {
    try {
        await prisma.studyMaterial.delete({
            where: { id }
        });
        revalidatePath("/dashboard/teacher/study-materials");
        return { success: true };
    } catch (error) {
        console.error("Error deleting study material:", error);
        return { success: false, error: "Failed to delete study material" };
    }
}
