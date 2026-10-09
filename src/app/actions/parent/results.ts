"use server";

import { prisma } from '@/lib/prisma';
import { getCurrentParentWithChildren } from '@/lib/parent-access';

export async function getParentResultsData() {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) return { success: false, error: 'Authentication required as parent' };

    const studentIds = access.children.map((student: any) => student.id);
    if (studentIds.length === 0) return { success: true, data: { allResults: [] } };

    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      orderBy: [{ currentClass: 'asc' }, { firstName: 'asc' }],
      include: { results: { include: { subjectRef: true, exam: true } } },
    });

    const getGrade = (marks: number) => marks >= 80 ? 'A+' : marks >= 70 ? 'A' : marks >= 60 ? 'A-' : marks >= 50 ? 'B' : marks >= 40 ? 'C' : marks >= 33 ? 'D' : 'F';
    const getPoint = (marks: number) => marks >= 80 ? 5 : marks >= 70 ? 4 : marks >= 60 ? 3.5 : marks >= 50 ? 3 : marks >= 40 ? 2.5 : marks >= 33 ? 2 : 0;
    const getOverallGrade = (point: number) => point >= 5 ? 'A+' : point >= 4 ? 'A' : point >= 3.5 ? 'A-' : point >= 3 ? 'B' : point >= 2 ? 'C' : point >= 1 ? 'D' : 'F';

    const allResults = students.map((student) => {
      const subjects = student.results.map((result) => ({
        subject: result.subject || result.subjectRef?.name || 'Unknown',
        marks: result.marks,
        grade: getGrade(result.marks),
        point: getPoint(result.marks).toFixed(2),
      }));
      const totalMarks = subjects.reduce((sum, item) => sum + item.marks, 0);
      const totalPoints = subjects.reduce((sum, item) => sum + Number(item.point), 0);
      const avgPoint = subjects.length ? totalPoints / subjects.length : 0;
      return {
        id: student.id,
        studentId: student.registrationNo || 'N/A',
        studentName: `${student.firstName} ${student.lastName}`.trim() || 'Unknown',
        currentClass: student.currentClass || 'N/A',
        gender: student.gender || 'N/A',
        totalMarks,
        totalPoints,
        subjectCount: subjects.length,
        subjects,
        grade: subjects.length ? getOverallGrade(avgPoint) : 'N/A',
      };
    });

    return { success: true, data: { allResults } };
  } catch (error) {
    console.error('Error fetching parent results:', error);
    return { success: false, error: 'Failed to load results data' };
  }
}
