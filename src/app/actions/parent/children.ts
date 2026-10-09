"use server";

import { getCurrentParentWithChildren } from '@/lib/parent-access';

export async function getParentChildren() {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) return { success: false, error: 'Authentication required as parent' };

    return {
      success: true,
      data: access.children.map((student: any) => ({
        id: student.id,
        registrationNo: student.registrationNo,
        name: `${student.firstName} ${student.lastName}`.trim(),
        class: student.currentClass || student.section?.class?.name || '—',
        section: student.sectionName || student.section?.name || '—',
        roll: student.rollNo,
        dob: student.dateOfBirth,
        bloodGroup: student.bloodGroup,
        guardian: student.fatherName,
        contact: student.guardianPhone,
        address: student.presentAddress,
      })),
    };
  } catch (error) {
    console.error('Error fetching parent children:', error);
    return { success: false, error: 'Failed to load children' };
  }
}

export async function getParentChild(studentId: string) {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) return { success: false, error: 'Authentication required as parent' };
    const student = access.children.find((item: any) => item.id === studentId);
    if (!student) return { success: false, error: 'Student not found' };

    return {
      success: true,
      data: {
        id: student.id,
        registrationNo: student.registrationNo,
        name: `${student.firstName} ${student.lastName}`.trim(),
        class: student.currentClass || student.section?.class?.name || '—',
        section: student.sectionName || student.section?.name || '—',
        roll: student.rollNo,
        dob: student.dateOfBirth,
        bloodGroup: student.bloodGroup || '—',
        guardian: student.fatherName || '—',
        contact: student.guardianPhone || '—',
        address: student.presentAddress || '—',
        gender: student.gender,
      },
    };
  } catch (error) {
    console.error('Error fetching parent child:', error);
    return { success: false, error: 'Failed to load student' };
  }
}
