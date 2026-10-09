"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/getCurrentUser"

export async function getPayments() {
    try {
        const user = await getCurrentUser()
        
        if (!user) {
            console.error("No authenticated user found for payments")
            return []
        }

        const student = await prisma.student.findUnique({
            where: { userId: user.id }
        })

        if (!student) {
            console.warn(`No student record found for User ID: ${user.id}`)
            return []
        }

        // Return all payments for history
        return await prisma.payment.findMany({
            where: { studentId: student.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        })
    } catch (error) {
        console.error("Error fetching student payments:", error)
        return []
    }
}

export async function getPendingFees() {
    try {
        const user = await getCurrentUser()
        if (!user) return []

        const student = await prisma.student.findUnique({
            where: { userId: user.id }
        })

        if (!student) return []

        // Only return PENDING payments (assigned fees)
        return await prisma.payment.findMany({
            where: {
                studentId: student.id,
                status: 'PENDING'
            },
            orderBy: { createdAt: 'asc' }
        })
    } catch (error) {
        console.error("Error fetching pending fees:", error)
        return []
    }
}

export async function getStudentProfile() {
    try {
        const user = await getCurrentUser()
        if (!user) return null

        return {
            name: user.name,
            email: user.email
        }
    } catch (error) {
        console.error("Error fetching student profile:", error)
        return null
    }
}

export async function getPaymentByTransactionId(transactionId: string) {
    try {
        const user = await getCurrentUser()
        if (!user) return null

        return await prisma.payment.findUnique({
            where: { transactionId: transactionId }
        })
    } catch (error) {
        console.error("Error fetching payment by transaction ID:", error)
        return null
    }
}
