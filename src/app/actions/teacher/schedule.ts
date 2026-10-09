"use server"

import { getCurrentUser } from "@/lib/getCurrentUser"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

/**
 * Fetch the list of classes assigned to the logged-in teacher.
 * This returns the full Class objects for the names in teacher.assignedClasses.
 */
export async function getTeacherClassesForSchedule() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'teacher') {
            return { success: false, error: "Authentication required as teacher." }
        }

        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id },
            select: { assignedClasses: true, schoolId: true }
        })

        if (!teacher) return { success: false, error: "Teacher profile not found." }

        const assignedList: string[] = Array.isArray(teacher.assignedClasses)
            ? (teacher.assignedClasses as any)
            : (typeof teacher.assignedClasses === 'string'
                ? teacher.assignedClasses.split(',').map(s => s.trim()).filter(Boolean)
                : []);

        const classes = await prisma.class.findMany({
            where: {
                schoolId: teacher.schoolId,
                name: { in: assignedList }
            },
            select: { id: true, name: true }
        })

        return { success: true, data: classes }
    } catch (error: any) {
        console.error("❌ getTeacherClassesForSchedule Error:", error.message)
        return { success: false, error: "Failed to load assigned classes." }
    }
}

/**
 * Fetch all schedule entries for a specific class (permission check included).
 */
export async function getClassScheduleForTeacher(classId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'teacher') {
            return { success: false, error: "Authentication required as teacher." }
        }

        // Permission Check: Ensure teacher is assigned to this class
        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id },
            select: { assignedClasses: true, schoolId: true }
        })

        if (!teacher) return { success: false, error: "Teacher profile not found." }

        const assignedList: string[] = Array.isArray(teacher.assignedClasses)
            ? (teacher.assignedClasses as any)
            : (typeof teacher.assignedClasses === 'string'
                ? teacher.assignedClasses.split(',').map(s => s.trim()).filter(Boolean)
                : []);

        const targetClass = await prisma.class.findUnique({
            where: { id: classId },
            select: { name: true }
        })

        if (!targetClass || !assignedList.includes(targetClass.name)) {
            return { success: false, error: "Unauthorized: You are not assigned to this class." }
        }

        const schedules = await prisma.classSchedule.findMany({
            where: { classId },
            include: {
                subject: { select: { name: true } },
                teacher: { include: { user: { select: { name: true } } } }
            },
            orderBy: [
                { day: 'asc' },
                { startTime: 'asc' }
            ]
        })

        return { success: true, data: schedules }
    } catch (error: any) {
        console.error("❌ getClassScheduleForTeacher Error:", error.message)
        return { success: false, error: "Failed to load class schedule." }
    }
}

/**
 * Save (Create or Update) a schedule entry.
 * Note: Does not remove existing data, just updates/creates as requested.
 */
export async function saveScheduleEntry(data: {
    id?: string,
    classId: string,
    subjectId: string,
    teacherId: string,
    day: string,
    startTime: string,
    endTime: string
}) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'teacher') {
            return { success: false, error: "Authentication required as teacher." }
        }

        const { id, ...payload } = data

        let result
        if (id) {
            result = await prisma.classSchedule.update({
                where: { id },
                data: payload
            })
        } else {
            result = await prisma.classSchedule.create({
                data: payload
            })
        }

        revalidatePath(`/dashboard/teacher/schedule`)
        return { success: true, data: result }
    } catch (error: any) {
        console.error("❌ saveScheduleEntry Error:", error.message)
        return { success: false, error: "Failed to save schedule entry." }
    }
}

/**
 * Delete a schedule entry.
 */
export async function deleteScheduleEntry(id: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'teacher') {
            return { success: false, error: "Authentication required as teacher." }
        }

        await prisma.classSchedule.delete({
            where: { id }
        })

        revalidatePath(`/dashboard/teacher/schedule`)
        return { success: true }
    } catch (error: any) {
        console.error("❌ deleteScheduleEntry Error:", error.message)
        return { success: false, error: "Failed to delete schedule entry." }
    }
}

/**
 * Fetch dependencies (Subjects and Teachers) for the schedule form.
 */
export async function getScheduleDependencies(classId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser || currentUser.role !== 'teacher') {
            return { success: false, error: "Authentication required as teacher." }
        }

        const schoolId = currentUser.schoolId as string

        const [subjects, teachers] = await Promise.all([
            prisma.subject.findMany({
                where: { classId, schoolId },
                select: { id: true, name: true }
            }),
            prisma.teacher.findMany({
                where: { schoolId },
                include: { user: { select: { name: true } } }
            })
        ])

        return {
            success: true,
            data: {
                subjects,
                teachers: teachers.map(t => ({ id: t.id, name: t.user.name }))
            }
        }
    } catch (error: any) {
        console.error("❌ getScheduleDependencies Error:", error.message)
        return { success: false, error: "Failed to load form dependencies." }
    }
}
