import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_session');
    cookieStore.delete('methqal_role');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_session');
    cookieStore.delete('methqal_role');

    const url = new URL(request.url);
    return NextResponse.redirect(new URL('/login', url.origin));
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
