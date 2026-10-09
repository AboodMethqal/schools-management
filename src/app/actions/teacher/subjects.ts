"use server"

import { getCurrentUser } from "@/lib/getCurrentUser"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Fetch all subjects for a specific class
 */
export async function getSubjects(classId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { success: false, error: "Authentication required" }

        const subjects = await prisma.subject.findMany({
            where: { classId },
            orderBy: { name: 'asc' }
        })

        return { success: true, data: subjects }
    } catch (error: any) {
        console.error("❌ getSubjects Error:", error.message)
        return { success: false, error: "Failed to load subjects." }
    }
}

/**
 * Add a new subject to a class
 */
export async function addSubject(classId: string, name: string, code?: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { success: false, error: "Authentication required" }
        if (!currentUser.schoolId) return { success: false, error: "School ID not found" }

        const schoolId = currentUser.schoolId as string

        const newSubject = await prisma.subject.create({
            data: {
                name: name.trim(),
                code: code?.trim() || null,
                classId,
                schoolId
            }
        })

        revalidatePath(`/dashboard/teacher/schedule`)
        return { success: true, data: newSubject }
    } catch (error: any) {
        console.error("❌ addSubject Error:", error.message)
        return { success: false, error: "Failed to add subject." }
    }
}

/**
 * Delete a subject
 */
export async function deleteSubject(id: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { success: false, error: "Authentication required" }

        await prisma.subject.delete({
            where: { id }
        })

        revalidatePath(`/dashboard/teacher/schedule`)
        return { success: true }
    } catch (error: any) {
        console.error("❌ deleteSubject Error:", error.message)
        return { success: false, error: "Failed to delete subject." }
    }
}
