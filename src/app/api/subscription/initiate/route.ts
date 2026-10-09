import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/getCurrentUser';

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !['admin', 'super_admin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'غير مصرح بهذا الإجراء' }, { status: 403 });
    }

    const body = await req.json();
    const planName = String(body.planName || '');
    const plan = await prisma.plan.findFirst({ where: { name: { contains: planName } } });
    if (!plan) return NextResponse.json({ error: 'الخطة غير موجودة' }, { status: 400 });

    const schoolId = currentUser.schoolId || body.schoolId;
    if (!schoolId) return NextResponse.json({ error: 'المدرسة غير مرتبطة بالحساب' }, { status: 400 });

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) return NextResponse.json({ error: 'المدرسة غير موجودة' }, { status: 400 });

    const transactionId = `SUB-MT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const amount = Number.parseFloat(plan.price);
    await prisma.subscription.create({
      data: {
        transactionId, amount: Number.isFinite(amount) ? amount : 0, currency: 'YER', status: 'PENDING',
        planName: plan.name, duration: plan.duration, schoolId,
        customerName: currentUser.name, customerEmail: currentUser.email, customerPhone: null, method: 'MANUAL',
      },
    });

    return NextResponse.json({ success: true, status: 'PENDING', transactionId, message: 'تم تسجيل طلب الاشتراك وسيتم مراجعته من إدارة المنصة.' });
  } catch (error) {
    console.error('Subscription request error:', error);
    return NextResponse.json({ error: 'تعذر تسجيل طلب الاشتراك' }, { status: 500 });
  }
}
