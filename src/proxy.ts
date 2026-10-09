import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Only guard dashboard routes
    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('auth_session')?.value;
    const roleCookie = request.cookies.get('methqal_role')?.value;

    // 1. Unauthenticated access check
    if (!sessionCookie) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    let sessionUser: any = null;
    try {
        const decoded = sessionCookie.includes('%') ? decodeURIComponent(sessionCookie) : sessionCookie;
        sessionUser = JSON.parse(decoded);
    } catch {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (!sessionUser || !sessionUser.role) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Mandatory password change redirect
    if (sessionUser.mustChangePassword && pathname !== '/login/change-password') {
        return NextResponse.redirect(new URL('/login/change-password', request.url));
    }

    const role = (sessionUser.role || roleCookie || '').toLowerCase();

    // 3. Strict Server-Side Role-Based Route Isolation
    if (pathname.startsWith('/dashboard/super-admin') && role !== 'super_admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/principal') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/teacher') && role !== 'teacher' && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/student') && role !== 'student' && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/parent') && role !== 'parent' && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/dashboard/accountant') && role !== 'accountant' && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};
