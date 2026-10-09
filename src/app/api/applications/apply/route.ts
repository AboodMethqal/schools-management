import { NextResponse } from 'next/server';
import { submitSchoolApplication } from '@/app/actions/application';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitSchoolApplication(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationNo: result.applicationNo,
      data: result.data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
