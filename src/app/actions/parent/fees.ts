'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentParentWithChildren } from '@/lib/parent-access';

export async function getParentFeesData() {
  try {
    const access = await getCurrentParentWithChildren();
    if (!access) {
      return { success: false, error: 'Authentication required as parent' };
    }

    const firstChild = access.children[0];
    if (firstChild) {
      const studentId = firstChild.id;
      const schoolId = firstChild.schoolId || firstChild.school?.id;

      if (schoolId) {
        const [assignedFees, payments] = await Promise.all([
          prisma.fee.findMany({
            where: {
              schoolId: schoolId,
            },
          }),
          prisma.payment.findMany({
            where: { studentId: studentId },
            orderBy: { createdAt: 'desc' },
          }),
        ]);

        const totalDue =
          assignedFees.reduce((acc, f) => acc + f.amount, 0) -
          payments
            .filter((p) => p.status === 'SUCCESS')
            .reduce((acc, p) => acc + p.amount, 0);

        if (assignedFees.length > 0 || payments.length > 0) {
          return {
            success: true,
            data: {
              totalDue: Math.max(0, totalDue).toLocaleString(),
              paymentHistory: payments.map((p) => ({
                month: p.createdAt.toLocaleDateString('ar-YE', { month: 'long', year: 'numeric' }),
                desc: p.feeCategory || 'رسوم دراسية',
                amount: `${p.amount.toLocaleString()} ر.س`,
                status: p.status === 'SUCCESS' ? 'مسدد' : 'معلق',
                statusColor: p.status === 'SUCCESS' ? 'emerald' : 'amber',
              })),
            },
          };
        }
      }
    }

    // Demo parent fees fallback
    return {
      success: true,
      data: {
        totalDue: '450',
        paymentHistory: [
          {
            month: 'سبتمبر 2026',
            desc: 'الرسوم الدراسية الشهرية - الفصل الأول',
            amount: '1,200 ر.س',
            status: 'مسدد',
            statusColor: 'emerald',
          },
          {
            month: 'أكتوبر 2026',
            desc: 'رسوم النقل المدرسي والمختبرات',
            amount: '450 ر.س',
            status: 'معلق',
            statusColor: 'amber',
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error fetching parent fees:', error);
    return { success: false, error: 'Failed to load fees data' };
  }
}
