"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getClasses() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Authentication required" };
        if (!currentUser.schoolId) return { success: false, error: "Your account is not linked to a school." };
        const schoolId = currentUser.schoolId as string;

        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id }
        });

        if (!teacher) return { success: false, error: "Teacher profile not found" };

        const assignedList: string[] = Array.isArray(teacher.assignedClasses)
            ? (teacher.assignedClasses as any)
            : (typeof teacher.assignedClasses === 'string'
                ? teacher.assignedClasses.split(',').map(s => s.trim()).filter(Boolean)
                : []);

        // Ensure teacher.assignedClasses are in the Class table
        for (const className of assignedList) {
            const cls = await prisma.class.findFirst({
                where: { schoolId: schoolId, name: className }
            });

            if (!cls) {
                // Auto-create Class if missing
                const newCls = await prisma.class.create({
                    data: {
                        name: className,
                        schoolId: schoolId
                    }
                });

                // Also create a default section for this class
                await prisma.section.create({
                    data: {
                        name: "Section A",
                        classId: newCls.id
                    }
                });
            } else {
                // Ensure at least one section exists
                const section = await prisma.section.findFirst({
                    where: { classId: cls.id }
                });
                if (!section) {
                    await prisma.section.create({
                        data: {
                            name: "Section A",
                            classId: cls.id
                        }
                    });
                }
            }
        }

        const classes = await prisma.class.findMany({
            where: {
                schoolId: schoolId,
                name: { in: assignedList }
            },
            orderBy: { name: 'asc' }
        });

        return { success: true, data: classes };
    } catch (error: any) {
        console.error("Error fetching classes:", error.message);
        return { success: false, error: "Failed to fetch classes" };
    }
}

export async function getStudentsByClass(classId: string) {
    try {
        const cls = await prisma.class.findUnique({
            where: { id: classId },
            include: { school: true }
        });

        if (!cls) return { success: false, error: "Class not found" };

        // Data Repair Logic: Find students who match this class name but have no sectionId
        // This handles students added via simple strings
        const studentsToLink = await prisma.student.findMany({
            where: {
                schoolId: cls.schoolId,
                currentClass: cls.name,
                sectionId: null
            }
        });

        if (studentsToLink.length > 0) {
            // Find or create Section A for this class
            let section = await prisma.section.findFirst({
                where: { classId: cls.id }
            });

            if (!section) {
                section = await prisma.section.create({
                    data: { name: "Section A", classId: cls.id }
                });
            }

            // Link students to this section
            for (const student of studentsToLink) {
                await prisma.student.update({
                    where: { id: student.id },
                    data: {
                        sectionId: section.id,
                        sectionName: section.name
                    }
                });
            }
        }

        const students = await prisma.student.findMany({
            where: { section: { classId } },
            orderBy: { rollNo: 'asc' }
        });
        return { success: true, data: students };
    } catch (error: any) {
        console.error("Error fetching students by class:", error.message);
        return { success: false, error: "Failed to fetch students" };
    }
}

export async function saveResults(resultsData: {
    studentId: string;
    marks: number;
    subject: string;
    examType: string;
    classId: string;
}[]) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return { success: false, error: "Authentication required" };
        if (!currentUser.schoolId) return { success: false, error: "Your account is not linked to a school." };
        const schoolId = currentUser.schoolId as string;

        const teacher = await prisma.teacher.findUnique({
            where: { userId: currentUser.id }
        });

        if (!teacher) return { success: false, error: "Teacher profile not found" };

        for (const res of resultsData) {
            const existing = await prisma.result.findFirst({
                where: {
                    studentId: res.studentId,
                    subject: res.subject,
                    examType: res.examType
                }
            });

            if (existing) {
                await prisma.result.update({
                    where: { id: existing.id },
                    data: { marks: res.marks, teacherId: teacher.id }
                });
            } else {
                await prisma.result.create({
                    data: {
                        studentId: res.studentId,
                        marks: res.marks,
                        subject: res.subject,
                        examType: res.examType,
                        classId: res.classId,
                        schoolId: schoolId,
                        teacherId: teacher.id
                    }
                });
            }
        }

        revalidatePath("/dashboard/teacher/results");
        return { success: true };
    } catch (error) {
        console.error("Error saving results:", error);
        return { success: false, error: "Failed to save results" };
    }
}

export async function getResults(classId: string, subject: string, examType: string) {
    try {
        const results = await prisma.result.findMany({
            where: { classId, subject, examType }
        });
        return { success: true, data: results };
    } catch (error) {
        console.error("Error fetching results:", error);
        return { success: false, error: "Failed to fetch results" };
    }
}
