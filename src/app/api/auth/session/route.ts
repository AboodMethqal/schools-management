import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null, role: null });
    }

    const sessionUser = JSON.parse(sessionCookie);
    return NextResponse.json({
      user: sessionUser,
      role: sessionUser.role || null,
    });
  } catch (error) {
    return NextResponse.json({ user: null, role: null });
  }
}
