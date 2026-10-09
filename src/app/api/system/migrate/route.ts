import { NextResponse } from 'next/server';
import { applyDatabaseMigrations } from '@/lib/migration-runner';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const result = await applyDatabaseMigrations();
        return NextResponse.json(result);
    } catch (err: unknown) {
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const result = await applyDatabaseMigrations();
        return NextResponse.json(result);
    } catch (err: unknown) {
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}
