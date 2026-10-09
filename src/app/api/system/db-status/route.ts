import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@libsql/client';
import { applyDatabaseMigrations, EXPECTED_SCHEMA_COLUMNS } from '@/lib/migration-runner';

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

    // 1. Auto-apply migrations and column healing on request to ensure live sync
    let migrationSyncResult: any = null;
    try {
        migrationSyncResult = await applyDatabaseMigrations();
    } catch (err: unknown) {
        migrationSyncResult = {
            success: false,
            error: (err as Error).message
        };
    }

    // 2. Direct column verification via @libsql/client
    let columnAudit: any = null;
    const url = tursoUrl || databaseUrl || 'file:./dev.db';
    try {
        const client = createClient({
            url,
            ...(tursoToken ? { authToken: tursoToken } : {})
        });

        const tablesRes = await client.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name ASC"
        );
        const tableNames = tablesRes.rows.map(r => String(r.name));

        const checkedTables: Record<string, {
            status: string;
            missingColumns: string[];
            actualCount: number;
        }> = {};

        let totalMissing = 0;

        for (const [tName, expectedFields] of Object.entries(EXPECTED_SCHEMA_COLUMNS)) {
            if (!tableNames.includes(tName)) {
                checkedTables[tName] = {
                    status: 'MISSING_TABLE',
                    missingColumns: Object.keys(expectedFields),
                    actualCount: 0
                };
                totalMissing += Object.keys(expectedFields).length;
                continue;
            }

            const colRes = await client.execute(`PRAGMA table_info("${tName}")`);
            const actualCols = new Set(colRes.rows.map(r => String(r.name)));
            const missing = Object.keys(expectedFields).filter(c => !actualCols.has(c));

            checkedTables[tName] = {
                status: missing.length === 0 ? 'OK' : 'MISSING_COLUMNS',
                missingColumns: missing,
                actualCount: actualCols.size
            };

            if (missing.length > 0) totalMissing += missing.length;
        }

        columnAudit = {
            totalTables: tableNames.length,
            modelsChecked: Object.keys(EXPECTED_SCHEMA_COLUMNS).length,
            totalMissingColumns: totalMissing,
            allModelsMatch: totalMissing === 0,
            tables: checkedTables
        };
    } catch (err: unknown) {
        columnAudit = {
            error: (err as Error).message
        };
    }

    // 3. Test via Prisma client
    let prismaResult: any = null;
    try {
        const [appCount, studentCount, userCount, schoolCount] = await Promise.all([
            prisma.schoolApplication.count().catch(() => 0),
            prisma.student.count().catch(() => 0),
            prisma.user.count().catch(() => 0),
            prisma.school.count().catch(() => 0)
        ]);

        prismaResult = {
            connected: true,
            counts: {
                applications: appCount,
                students: studentCount,
                users: userCount,
                schools: schoolCount
            }
        };
    } catch (err: unknown) {
        prismaResult = {
            connected: false,
            error: (err as Error).message
        };
    }

    return NextResponse.json({
        tursoHost,
        hasDatabaseUrl: Boolean(databaseUrl),
        isDatabaseUrlFile: databaseUrl.startsWith('file:'),
        hasTursoUrl: Boolean(tursoUrl),
        hasTursoToken: Boolean(tursoToken),
        migrationSyncResult,
        columnAudit,
        prismaResult
    });
}
