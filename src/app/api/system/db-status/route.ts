import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Collect environment variable names safely without printing any values or secrets
    const relevantKeys = Object.keys(process.env).filter(key =>
        /TURSO|DATABASE|LIBSQL|VERCEL|PRISMA/i.test(key)
    );

    const getProtocol = (val?: string) => {
        if (!val) return null;
        if (val.startsWith('file:')) return 'file';
        if (val.startsWith('libsql:')) return 'libsql';
        if (val.startsWith('https:')) return 'https';
        if (val.startsWith('http:')) return 'http';
        return 'other';
    };

    const envInfo = {
        relevantKeys,
        hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
        databaseUrlProtocol: getProtocol(process.env.DATABASE_URL),
        hasTursoDatabaseUrl: Boolean(process.env.TURSO_DATABASE_URL),
        tursoDatabaseUrlProtocol: getProtocol(process.env.TURSO_DATABASE_URL),
        hasTursoUrl: Boolean(process.env.TURSO_URL),
        tursoUrlProtocol: getProtocol(process.env.TURSO_URL),
        hasTursoAuthToken: Boolean(process.env.TURSO_AUTH_TOKEN),
        tursoAuthTokenLength: process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.length : 0,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || null,
    };

    try {
        // Test query on the configured database
        const tables = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name ASC"
        );
        const tableNames = tables.map(t => t.name);

        let userColumns: any[] = [];
        let alterResult: string | null = null;
        if (tableNames.includes('User')) {
            try {
                await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "profileImage" TEXT');
                alterResult = 'altered profileImage successfully';
            } catch (e: any) {
                alterResult = e?.message || String(e);
            }
            try {
                await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "password" TEXT');
            } catch {}
            userColumns = await prisma.$queryRawUnsafe('PRAGMA table_info("User")');
        }

        let applicationCount = 0;
        if (tableNames.includes('SchoolApplication')) {
            applicationCount = await prisma.schoolApplication.count();
        }

        return NextResponse.json({
            status: 'ok',
            connected: true,
            envInfo,
            tables: {
                totalCount: tableNames.length,
                hasSchoolApplication: tableNames.includes('SchoolApplication'),
                hasSchool: tableNames.includes('School'),
                hasUser: tableNames.includes('User'),
                names: tableNames,
            },
            userTable: {
                alterResult,
                columns: userColumns.map((c: any) => c.name),
            },
            data: {
                applicationCount,
            },
        });
    } catch (err: unknown) {
        const error = err as Error;
        return NextResponse.json({
            status: 'error',
            connected: false,
            envInfo,
            error: error.message || 'Unknown database error',
        }, { status: 500 });
    }
}
