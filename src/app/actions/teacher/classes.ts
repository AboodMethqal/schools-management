"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"

/**
 * Fetches the list of students and class details for a specific class ID.
 */
export async function getClassStudents(classId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { success: false, error: "Authentication required" }

        const classData = await prisma.class.findUnique({
            where: { id: classId }
        })

        if (!classData) return { success: false, error: "Class not found" }

        const students = await prisma.student.findMany({
            where: {
                OR: [
                    { section: { classId: classId } },
                    { 
                        schoolId: classData.schoolId,
                        currentClass: classData.name
                    }
                ]
            },
            orderBy: { rollNo: 'asc' },
            include: {
                attendance: {
                    orderBy: { date: 'desc' }
                },
                results: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        return { success: true, data: { ...classData, students } }
    } catch (error: any) {
        console.error("Error fetching class students:", error.message)
        return { success: false, error: "Failed to load class data" }
    }
}

/**
 * Fetches full details for a student including attendance, results, and feedback.
 */
export async function getStudentDetail(studentId: string) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return { success: false, error: "Authentication required" }

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                attendance: {
                    orderBy: { date: 'desc' },
                    take: 20
                },
                results: {
                    include: {
                        exam: true,
                        subjectRef: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                feedbacks: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!student) return { success: false, error: "Student not found" }

        return { success: true, data: student }
    } catch (error: any) {
        console.error("Error fetching student details:", error.message)
        return { success: false, error: "Failed to load student details" }
    }
}
