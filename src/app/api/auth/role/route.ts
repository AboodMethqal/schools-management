import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();

    // 1. Check local session cookie first for instant resolution
    const sessionCookie = cookieStore.get('auth_session')?.value;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(sessionCookie);
        if (parsed?.role) {
          return NextResponse.json({ role: parsed.role });
        }
      } catch {}
    }

    // 2. Check Supabase server client if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          {
            cookies: {
              get(name: string) {
                const cookie = cookieStore.get(name);
                return cookie?.value;
              },
            },
          },
        );

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (user && !error) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { authUserId: user.id },
              select: { role: true },
            });
            return NextResponse.json({ role: dbUser?.role ?? user.user_metadata?.role ?? null });
          } catch {
            return NextResponse.json({ role: user.user_metadata?.role ?? null });
          }
        }
      } catch (err) {
        // Supabase unreachable, ignore
      }
    }

    return NextResponse.json({ role: null }, { status: 401 });
  } catch (err) {
    console.error('Failed to fetch auth role', err);
    return NextResponse.json({ role: null }, { status: 500 });
  }
}
