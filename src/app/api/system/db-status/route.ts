import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || '';
    const tursoToken = process.env.TURSO_AUTH_TOKEN || '';
    const databaseUrl = process.env.DATABASE_URL || '';

    let tursoHost = 'none';
    if (tursoUrl) {
        try {
            tursoHost = new URL(tursoUrl).hostname;
        } catch {
            tursoHost = 'invalid-url';
        }
    }

    // 1. Direct test via @libsql/client
    let directLibsqlResult: any = null;
    if (tursoUrl && tursoToken) {
        try {
            const client = createClient({
                url: tursoUrl,
                authToken: tursoToken,
            });
            const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name ASC");
            const tables = res.rows.map(r => r.name);
            directLibsqlResult = {
                connected: true,
                tableCount: tables.length,
                tables,
            };
        } catch (err: unknown) {
            directLibsqlResult = {
                connected: false,
                error: (err as Error).message,
            };
        }
    }

    // 2. Test via Prisma client
    let prismaResult: any = null;
    try {
        const tables = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name ASC"
        );
        const tableNames = tables.map(t => t.name);
        let applicationCount = 0;
        if (tableNames.includes('SchoolApplication')) {
            applicationCount = await prisma.schoolApplication.count();
        }

        prismaResult = {
            connected: true,
            tableCount: tableNames.length,
            tables: tableNames,
            applicationCount,
        };
    } catch (err: unknown) {
        prismaResult = {
            connected: false,
            error: (err as Error).message,
        };
    }

    return NextResponse.json({
        tursoHost,
        hasDatabaseUrl: Boolean(databaseUrl),
        isDatabaseUrlFile: databaseUrl.startsWith('file:'),
        hasTursoUrl: Boolean(tursoUrl),
        hasTursoToken: Boolean(tursoToken),
        directLibsqlResult,
        prismaResult,
    });
}
