import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findDemoAccount, DEMO_ACCOUNTS } from '@/lib/demo-accounts';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, roleKey } = body;

    let targetAccount = null;

    if (roleKey && DEMO_ACCOUNTS[roleKey]) {
      targetAccount = DEMO_ACCOUNTS[roleKey];
    } else if (email) {
      targetAccount = findDemoAccount(email);
    }

    if (targetAccount) {
      // Validate password if supplied
      const validPasswords = [
        targetAccount.password,
        'Password123!',
        'Admin@123456',
        'Principal@123456',
        'Teacher@123456',
        'Student@123456',
        'Parent@123456',
        'Accountant@123456',
        'Teacher@1234',
        targetAccount.email,
      ].filter(Boolean);

      if (password && !validPasswords.includes(password)) {
        return NextResponse.json(
          { error: 'Invalid credentials / بيانات الدخول غير صحيحة' },
          { status: 401 }
        );
      }

      // Try fetching database record if database is reachable
      let dbUser: any = null;
      try {
        dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: targetAccount.email },
              { authUserId: targetAccount.authUserId },
            ],
          },
        });
      } catch (err) {
        console.warn('Database query bypassed for demo login:', (err as Error).message);
      }

      const sessionUser = {
        id: dbUser?.id || targetAccount.id,
        authUserId: targetAccount.authUserId,
        email: targetAccount.email,
        name: dbUser?.name || targetAccount.name,
        role: targetAccount.role,
        schoolId: dbUser?.schoolId || targetAccount.schoolId || null,
        user_metadata: {
          role: targetAccount.role,
          name: targetAccount.name,
        },
      };

      const cookieStore = await cookies();
      
      // Set session cookie for SSR and server actions
      cookieStore.set('auth_session', JSON.stringify(sessionUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Also set client-readable role cookie for quick routing
      cookieStore.set('methqal_role', targetAccount.role, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        success: true,
        user: sessionUser,
        role: targetAccount.role,
      });
    }

    // If not a predefined demo account, try querying the database directly
    try {
      if (email) {
        const user = await prisma.user.findUnique({
          where: { email: email.trim().toLowerCase() },
        });

        if (user) {
          const sessionUser = {
            id: user.id,
            authUserId: user.authUserId,
            email: user.email,
            name: user.name,
            role: user.role,
            schoolId: user.schoolId,
            user_metadata: { role: user.role, name: user.name },
          };

          const cookieStore = await cookies();
          cookieStore.set('auth_session', JSON.stringify(sessionUser), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          });

          cookieStore.set('methqal_role', user.role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          });

          return NextResponse.json({
            success: true,
            user: sessionUser,
            role: user.role,
          });
        }
      }
    } catch (err) {
      console.warn('DB user lookup error:', (err as Error).message);
    }

    return NextResponse.json(
      { error: 'Invalid credentials / بيانات الدخول غير صحيحة' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('API login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
