'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getCurrentParentWithChildren } from '@/lib/parent-access';
import { revalidatePath } from 'next/cache';

export async function getParentProfileData() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'parent') {
      return { success: false, error: 'Authentication required as parent' };
    }

    const parent = await (prisma.parent as any).findUnique({
      where: { userId: currentUser.id },
      include: {
        user: { select: { email: true, name: true, createdAt: true } },
        student: { select: { registrationNo: true } },
        children: { include: { student: { select: { id: true, registrationNo: true, firstName: true, lastName: true } } } },
      },
    });

    // If parent record exists, return full data
    if (parent) {
      return {
        success: true,
        data: {
          name: (parent as any).user?.name || parent.name || currentUser.name,
          email: parent.email || (parent as any).user?.email || currentUser.email,
          phone: parent.phone || 'Not provided',
          studentId: (parent as any).student?.registrationNo || parent.children?.[0]?.student?.registrationNo || 'N/A',
          childrenCount: parent.children?.length || ((parent as any).student ? 1 : 0),
          lastUpdate: parent.createdAt.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        },
      };
    }

    // Fallback if Parent record is missing but User exists
    return {
      success: true,
      data: {
        name: currentUser.name || 'Parent User',
        email: currentUser.email,
        phone: 'Not provided',
        studentId: 'غير مرتبط',
        childrenCount: 0,
        lastUpdate: currentUser.createdAt.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      },
    };
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    return { success: false, error: 'Failed to load profile data' };
  }
}

export async function updateParentProfile(data: {
  name: string;
  phone: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'parent') {
      return { success: false, error: 'Authentication required' };
    }

    // Check if Parent record exists
    const parent = await (prisma.parent as any).findUnique({
      where: { userId: currentUser.id }
    });

    if (parent) {
      await prisma.parent.update({
        where: { userId: currentUser.id },
        data: {
          name: data.name,
          phone: data.phone,
        },
      });
    }

    // Always update the User model name for consistency
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: data.name },
    });

    revalidatePath('/dashboard/parent/profile');
    revalidatePath('/dashboard/parent/settings');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating parent profile:', error);
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}
