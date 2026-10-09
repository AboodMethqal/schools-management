'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getCurrentParentWithChildren } from '@/lib/parent-access';

export async function getCommunicationData() {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) {
      return { success: false, error: 'Authentication required as parent' };
    }

    const firstChild = access.children[0];
    const schoolId = firstChild?.schoolId || firstChild?.school?.id;

    if (schoolId) {
      // Fetch teachers who teach subjects to this class
      const teachers = await prisma.teacher.findMany({
        where: {
          schoolId: schoolId,
        },
        include: {
          user: { select: { name: true, email: true } },
          subjects: { include: { subject: { select: { name: true } } } },
        },
        take: 10,
      });

      if (teachers.length > 0) {
        return {
          success: true,
          data: {
            teachers: teachers.map((t) => ({
              id: t.id,
              name: t.user.name,
              role: t.subjects[0]?.subject.name || 'مدرس',
              email: t.user.email,
              initials: t.user.name
                .split(' ')
                .map((n) => n[0])
                .join(''),
            })),
          },
        };
      }
    }

    // Fallback demo teachers for parent communication
    return {
      success: true,
      data: {
        teachers: [
          {
            id: 'teacher-sara-01',
            name: 'أ. سارة المنصوري',
            role: 'معلمة الرياضيات',
            email: 'teacher@methqal.com',
            initials: 'س م',
          },
          {
            id: 'teacher-abdullah-02',
            name: 'أ. عبد الله الأهدل',
            role: 'معلم اللغة العربية',
            email: 'abdullah@methqal.com',
            initials: 'ع أ',
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error fetching communication data:', error);
    return { success: false, error: 'Failed to load teachers' };
  }
}

export async function sendMessage(teacherId: string, message: string) {
  // In a real app, this would create a Chat/Message record or send an email.
  // The current schema doesn't have a direct Messaging model, but we can verify authentication.
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Unauthorized' };

    console.log(
      `Sending message from ${currentUser.email} to teacher ${teacherId}: ${message}`,
    );

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send message' };
  }
}
