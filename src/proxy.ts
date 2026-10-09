import { NextResponse, type NextRequest } from "next/server";

// Local / Demo Session Proxy
export async function updateSession(request: NextRequest) {
    const sessionCookie = request.cookies.get('auth_session')?.value;
    if (sessionCookie) {
        try {
            const decoded = sessionCookie.includes('%') ? decodeURIComponent(sessionCookie) : sessionCookie;
            const sessionUser = JSON.parse(decoded);
            const pathname = request.nextUrl.pathname;
            if (sessionUser?.mustChangePassword && pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/login/change-password', request.url));
            }
        } catch {
            // Ignore parse errors
        }
    }

    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}

// Next.js Proxy Configuration
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

// Default export for the Proxy entry point
export default async function proxy(request: NextRequest) {
    return await updateSession(request);
}
