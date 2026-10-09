import { NextResponse } from 'next/server';
import { initiatePayment } from '@/app/actions/payment';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await initiatePayment(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'تعذر معالجة طلب الدفع' }, { status: 500 });
  }
}
