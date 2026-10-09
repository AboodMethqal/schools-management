'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentParentWithChildren } from '@/lib/parent-access';

export async function getParentNoticesData() {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) {
      return { success: false, error: 'Authentication required as parent' };
    }

    const firstChild = access.children[0];
    const schoolId = firstChild?.schoolId || firstChild?.school?.id;

    if (schoolId) {
      const notices = await prisma.announcement.findMany({
        where: {
          schoolId: schoolId,
          status: 'published',
          OR: [{ audience: 'all' }, { audience: 'parents' }],
        },
        orderBy: { createdAt: 'desc' },
      });

      if (notices.length > 0) {
        return {
          success: true,
          data: {
            notices: notices.map((n) => ({
              id: n.id,
              title: n.title,
              date: n.createdAt.toLocaleDateString('ar-YE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
              category: n.category.charAt(0).toUpperCase() + n.category.slice(1),
              desc: n.content,
              isPinned: n.priority === 'urgent' || n.priority === 'high',
              priority: n.priority.charAt(0).toUpperCase() + n.priority.slice(1),
              color:
                n.category === 'exam'
                  ? 'blue'
                  : n.category === 'holiday'
                    ? 'emerald'
                    : 'amber',
            })),
          },
        };
      }
    }

    return {
      success: true,
      data: {
        notices: [
          {
            id: 'notice-demo-01',
            title: 'جدول اختبارات الفصل الدراسي الأول',
            date: '10 أكتوبر 2026',
            category: 'امتحانات',
            desc: 'يرجى مراجعة جدول اختبارات نهاية الفصل لجميع المراحل الدراسية عبر البوابة.',
            isPinned: true,
            priority: 'عاجل',
            color: 'blue',
          },
          {
            id: 'notice-demo-02',
            title: 'إجازة منتصف الفصل الدراسي',
            date: '15 نوفمبر 2026',
            category: 'عطلات',
            desc: 'تبدأ إجازة منتصف الفصل الدراسي يوم الخميس القادم وتستأنف الدراسة الأحد التالي.',
            isPinned: false,
            priority: 'عادي',
            color: 'emerald',
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error fetching parent notices:', error);
    return { success: false, error: 'Failed to load notices data' };
  }
}
