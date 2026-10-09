"use server";

import { prisma } from '@/lib/prisma';
import { getCurrentParentWithChildren } from '@/lib/parent-access';

export async function getParentAttendanceData() {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) return { success: false, error: 'Authentication required as parent' };

    const studentIds = access.children.map((student: any) => student.id);
    const logs = await prisma.attendance.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { date: 'desc' },
      take: 120,
    });

    const byChild = access.children.map((student: any) => ({
      id: student.id,
      name: `${student.firstName} ${student.lastName}`.trim(),
      class: student.currentClass || student.section?.class?.name || '—',
      attendanceLog: logs.filter((item) => item.studentId === student.id).map((a) => ({
        date: a.date.toLocaleDateString('ar-YE', { day: '2-digit', month: 'short', year: 'numeric' }),
        day: a.date.toLocaleDateString('ar-YE', { weekday: 'long' }),
        status: a.status === 'PRESENT' ? 'Present' : a.status === 'ABSENT' ? 'Absent' : 'Late',
        statusColor: a.status === 'PRESENT' ? 'emerald' : a.status === 'ABSENT' ? 'red' : 'orange',
      })),
    }));

    return { success: true, data: { children: byChild } };
  } catch (error) {
    console.error('Error fetching parent attendance:', error);
    return { success: false, error: 'Failed to load attendance data' };
  }
}
