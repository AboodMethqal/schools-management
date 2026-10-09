import 'dotenv/config';
import { applyDatabaseMigrations } from '../src/lib/migration-runner';

async function main() {
    if (process.env.TURSO_DATABASE_URL || process.env.TURSO_URL) {
        console.log('🔄 Running Turso database schema migration during build...');
        try {
            const res = await applyDatabaseMigrations();
            console.log(`✅ Turso migration completed: ${res.tableCount} tables ready (demo seeded: ${res.demoSeeded})`);
        } catch (err: unknown) {
            console.error('❌ Turso migration error:', (err as Error).message);
        }
    } else {
        console.log('ℹ️ Local build (no TURSO_DATABASE_URL configured). Skipping cloud migration.');
    }
}

main().catch(console.error);
