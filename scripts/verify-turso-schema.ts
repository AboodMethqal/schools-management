import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';

export interface ExpectedModel {
    modelName: string;
    tableName: string;
    fields: {
        name: string;
        type: string;
        isOptional: boolean;
        isId: boolean;
        isRelation: boolean;
    }[];
}

export function parsePrismaSchema(schemaPath: string): ExpectedModel[] {
    const content = fs.readFileSync(schemaPath, 'utf8');
    const lines = content.split('\n');

    const models: ExpectedModel[] = [];
    let currentModel: ExpectedModel | null = null;

    // Standard scalar types in Prisma SQLite
    const scalarTypes = new Set([
        'String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json', 'BigInt', 'Bytes', 'Decimal'
    ]);

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('//')) continue;

        const modelMatch = line.match(/^model\s+(\w+)\s*\{/);
        if (modelMatch) {
            currentModel = {
                modelName: modelMatch[1],
                tableName: modelMatch[1],
                fields: []
            };
            models.push(currentModel);
            continue;
        }

        if (line.startsWith('}') && currentModel) {
            currentModel = null;
            continue;
        }

        if (currentModel) {
            const mapMatch = line.match(/^@@map\("([^"]+)"\)/);
            if (mapMatch) {
                currentModel.tableName = mapMatch[1];
                continue;
            }

            if (line.startsWith('@@')) continue;

            // Field line: fieldName FieldType attributes...
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const fieldName = parts[0];
                let fieldType = parts[1];
                const isOptional = fieldType.endsWith('?');
                if (isOptional) fieldType = fieldType.slice(0, -1);
                const isList = fieldType.endsWith('[]');
                if (isList) fieldType = fieldType.slice(0, -2);

                const isScalar = scalarTypes.has(fieldType);
                const isId = line.includes('@id');

                // If not a scalar, it's a relation and doesn't map to a raw DB column unless @relation(fields: [...]) is specified
                if (isScalar) {
                    currentModel.fields.push({
                        name: fieldName,
                        type: fieldType,
                        isOptional,
                        isId,
                        isRelation: false
                    });
                }
            }
        }
    }

    return models;
}

export async function verifySchema(client: any, expectedModels: ExpectedModel[]) {
    // 1. Get all tables in database
    const tablesRes = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'"
    );
    const existingTables = new Set(tablesRes.rows.map((r: any) => String(r.name)));

    const auditResults: {
        modelName: string;
        tableName: string;
        status: 'OK' | 'MISSING_TABLE' | 'MISSING_COLUMNS';
        expectedColumns: string[];
        actualColumns: string[];
        missingColumns: string[];
        unexpectedColumns: string[];
    }[] = [];

    let hasErrors = false;

    for (const model of expectedModels) {
        if (!existingTables.has(model.tableName)) {
            hasErrors = true;
            auditResults.push({
                modelName: model.modelName,
                tableName: model.tableName,
                status: 'MISSING_TABLE',
                expectedColumns: model.fields.map(f => f.name),
                actualColumns: [],
                missingColumns: model.fields.map(f => f.name),
                unexpectedColumns: []
            });
            continue;
        }

        // Get columns for this table
        const colRes = await client.execute(`PRAGMA table_info("${model.tableName}")`);
        const actualCols = new Set<string>(colRes.rows.map((r: any) => String(r.name)));

        const expectedColNames = model.fields.map(f => f.name);
        const missing = expectedColNames.filter(c => !actualCols.has(c));
        const unexpected = Array.from(actualCols).filter((c: string) => !expectedColNames.includes(c));

        if (missing.length > 0) {
            hasErrors = true;
            auditResults.push({
                modelName: model.modelName,
                tableName: model.tableName,
                status: 'MISSING_COLUMNS',
                expectedColumns: expectedColNames,
                actualColumns: Array.from(actualCols),
                missingColumns: missing,
                unexpectedColumns: unexpected
            });
        } else {
            auditResults.push({
                modelName: model.modelName,
                tableName: model.tableName,
                status: 'OK',
                expectedColumns: expectedColNames,
                actualColumns: Array.from(actualCols),
                missingColumns: [],
                unexpectedColumns: unexpected
            });
        }
    }

    return { hasErrors, auditResults };
}

async function main() {
    console.log('====================================================');
    console.log('METHQAL TECH — COLUMN-LEVEL DATABASE SCHEMA AUDIT');
    console.log('====================================================\n');

    const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
    const expectedModels = parsePrismaSchema(schemaPath);
    console.log(`📋 Parsed ${expectedModels.length} models from prisma/schema.prisma\n`);

    const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.DATABASE_URL || 'file:./dev.db';
    const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

    let displayTarget = url;
    try {
        if (url.startsWith('libsql://') || url.startsWith('https://')) {
            displayTarget = new URL(url).hostname;
        }
    } catch { }

    console.log(`🔌 Connecting to database target: ${displayTarget}`);
    const client = createClient({ url, ...(authToken ? { authToken } : {}) });

    const { hasErrors, auditResults } = await verifySchema(client, expectedModels);

    console.log('\n---------------------------------------------------------------------------------------------------------');
    console.log(
        'Table'.padEnd(22) +
        'Status'.padEnd(18) +
        'Expected'.padEnd(10) +
        'Actual'.padEnd(10) +
        'Missing / Discrepancies'
    );
    console.log('---------------------------------------------------------------------------------------------------------');

    for (const res of auditResults) {
        const statusStr = res.status === 'OK' ? '✅ OK' : (res.status === 'MISSING_TABLE' ? '❌ MISSING TABLE' : '⚠️ MISSING COLS');
        let notes = '';
        if (res.missingColumns.length > 0) {
            notes = `Missing: [${res.missingColumns.join(', ')}]`;
        }
        if (res.unexpectedColumns.length > 0) {
            const unexp = `Unexpected: [${res.unexpectedColumns.join(', ')}]`;
            notes = notes ? `${notes} | ${unexp}` : unexp;
        }

        console.log(
            res.tableName.padEnd(22) +
            statusStr.padEnd(18) +
            String(res.expectedColumns.length).padEnd(10) +
            String(res.actualColumns.length).padEnd(10) +
            (notes || 'None (Matches Prisma)')
        );
    }
    console.log('---------------------------------------------------------------------------------------------------------\n');

    if (hasErrors) {
        console.error('❌ SCHEMA AUDIT FAILED: One or more models have missing tables or missing columns in the database!');
        process.exit(1);
    } else {
        console.log('✅ SCHEMA AUDIT PASSED: All Prisma models and columns match the database schema perfectly!');
        process.exit(0);
    }
}

if (require.main === module) {
    main().catch(err => {
        console.error('Audit runtime error:', err);
        process.exit(1);
    });
}
