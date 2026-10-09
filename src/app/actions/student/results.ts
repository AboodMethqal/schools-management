"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function getMyResults() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== "student") {
            return { success: false, error: "Authentication required as student" };
        }

        const student = await prisma.student.findUnique({
            where: { userId: currentUser.id }
        });

        if (!student) {
            return { success: false, error: "Student profile not found" };
        }

        const results = await prisma.result.findMany({
            where: { studentId: student.id },
            orderBy: { createdAt: 'desc' },
            include: {
                teacher: {
                    select: {
                        user: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        // Helper function for grading
        const getGradeInfo = (marks: number) => {
            if (marks >= 80) return { grade: "A+", points: 4.0 };
            if (marks >= 70) return { grade: "A", points: 3.5 };
            if (marks >= 60) return { grade: "A-", points: 3.0 };
            if (marks >= 50) return { grade: "B", points: 2.5 };
            if (marks >= 40) return { grade: "C", points: 2.0 };
            if (marks >= 33) return { grade: "D", points: 1.0 };
            return { grade: "F", points: 0.0 };
        };

        // Group results by examId or (examType + classId) and calculate GPAs
        const groupedResults: Record<string, any> = {};
        
        results.forEach(res => {
            // Priority for grouping key: 1. examId, 2. examType-classId
            const examType = (res.examType || "Other").trim();
            const groupKey = res.examId || `${examType.toLowerCase()}-${res.classId || 'general'}`;
            
            if (!groupedResults[groupKey]) {
                groupedResults[groupKey] = {
                    examName: examType,
                    examId: res.examId,
                    classId: res.classId,
                    date: res.createdAt,
                    subjectMap: {}, // Temporary map to deduplicate subjects
                    totalPoints: 0,
                    count: 0,
                    totalMarks: 0
                };
            }
            
            const gradeInfo = getGradeInfo(res.marks);
            const subjectKey = (res.subject || "Unknown").trim().toLowerCase();
            
            // Only add if not already present, or if this is a newer record (though results are ordered by createdAt desc)
            if (!groupedResults[groupKey].subjectMap[subjectKey]) {
                groupedResults[groupKey].subjectMap[subjectKey] = {
                    id: res.id,
                    name: res.subject,
                    marks: res.marks,
                    grade: gradeInfo.grade,
                    points: gradeInfo.points,
                    teacherName: res.teacher?.user?.name || "Unknown"
                };

                groupedResults[groupKey].totalPoints += gradeInfo.points;
                groupedResults[groupKey].totalMarks += res.marks;
                groupedResults[groupKey].count += 1;
            }
            
            if (new Date(res.createdAt) > new Date(groupedResults[groupKey].date)) {
                groupedResults[groupKey].date = res.createdAt;
            }
        });

        // Finalize GPA per exam group and convert subjectMap to array
        const finalData = Object.values(groupedResults).map((exam: any) => {
            const subjects = Object.values(exam.subjectMap);
            const gpa = exam.count > 0 ? (exam.totalPoints / exam.count).toFixed(2) : "0.00";
            return {
                ...exam,
                subjects,
                gpa,
                status: parseFloat(gpa) >= 1.0 ? "Passed" : "Failed",
                grade: getGradeInfo(parseFloat(gpa) * 20 + 20).grade // Rough estimation for overall grade
            };
        });

        // Calculate CGPA
        const totalExamPoints = finalData.reduce((acc, curr) => acc + parseFloat(curr.gpa), 0);
        const cgpa = finalData.length > 0 ? (totalExamPoints / finalData.length).toFixed(2) : "0.00";

        return {
            success: true,
            data: {
                exams: finalData,
                cgpa,
                studentName: `${student.firstName} ${student.lastName}`
            }
        };
    } catch (error) {
        console.error("Error fetching student results:", error);
        return { success: false, error: "Failed to fetch results" };
    }
}
