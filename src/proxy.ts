import { NextResponse, type NextRequest } from "next/server";

// Local / Demo Session Proxy
export async function updateSession(request: NextRequest) {
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
