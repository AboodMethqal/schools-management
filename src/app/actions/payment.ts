"use server";

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';

/**
 * Creates a payment request inside Methqal Tech.
 * Online gateway integration is intentionally provider-neutral; a local or
 * regional provider can be connected later without coupling the school core
 * to a third-party gateway.
 */
export async function initiatePayment(data: {
  amount: string | number;
  studentId: string;
  schoolId: string;
  feeCategory?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: 'Authentication required' };

    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0 || !data.studentId || !data.schoolId) {
      return { success: false, error: 'بيانات الدفع غير صالحة' };
    }

    const student = await prisma.student.findFirst({
      where: { id: data.studentId, schoolId: data.schoolId },
      select: { id: true, schoolId: true, firstName: true, lastName: true, email: true, guardianPhone: true },
    });
    if (!student) return { success: false, error: 'الطالب غير موجود' };

    // Parents may only create payment requests for their linked children.
    if (currentUser.role === 'parent') {
      const parent = await prisma.parent.findUnique({
        where: { userId: currentUser.id },
        include: { children: true },
      });
      const linked = parent?.children.some((link) => link.studentId === student.id) || parent?.studentId === student.id;
      if (!linked) return { success: false, error: 'لا يمكنك إنشاء طلب دفع لهذا الطالب' };
    } else if (currentUser.role === 'student') {
      const ownStudent = await prisma.student.findUnique({ where: { userId: currentUser.id }, select: { id: true } });
      if (!ownStudent || ownStudent.id !== student.id) return { success: false, error: 'لا يمكنك إنشاء طلب دفع لهذا الطالب' };
    }

    const transactionId = `MT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await prisma.payment.create({
      data: {
        transactionId,
        amount,
        currency: 'YER',
        status: 'PENDING',
        studentId: student.id,
        schoolId: student.schoolId,
        feeCategory: data.feeCategory || 'رسوم مدرسية',
        method: 'MANUAL',
        customerName: data.customerName || `${student.firstName} ${student.lastName}`.trim(),
        customerEmail: data.customerEmail || student.email || currentUser.email,
        customerPhone: data.customerPhone || student.guardianPhone,
      },
    });

    return {
      success: true,
      transactionId,
      status: 'PENDING',
      message: 'تم تسجيل طلب الدفع وسيتم تأكيده من إدارة المدرسة.',
    };
  } catch (error) {
    console.error('Payment request error:', error);
    return { success: false, error: 'تعذر تسجيل طلب الدفع' };
  }
}
