import 'dotenv/config';
import { createClient } from '@libsql/client';

async function main() {
    const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || process.env.DATABASE_URL || 'file:./dev.db';
    const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
    console.log('Connecting to database:', url.startsWith('file:') ? 'LOCAL_SQLITE' : 'TURSO_CLOUD');

    const client = createClient({ url, ...(authToken ? { authToken } : {}) });

    console.log('\n--- 1. PRAGMA foreign_key_check ---');
    const fkCheck = await client.execute('PRAGMA foreign_key_check');
    console.log('FK Violations:', fkCheck.rows);

    console.log('\n--- 2. Foreign keys on students ---');
    const studentFks = await client.execute('PRAGMA foreign_key_list("students")');
    console.log(studentFks.rows);

    console.log('\n--- 3. Foreign keys on User ---');
    const userFks = await client.execute('PRAGMA foreign_key_list("User")');
    console.log(userFks.rows);

    console.log('\n--- 4. Foreign keys on Parent ---');
    const parentFks = await client.execute('PRAGMA foreign_key_list("Parent")');
    console.log(parentFks.rows);

    console.log('\n--- 5. Schools ---');
    const schools = await client.execute('SELECT id, schoolName, slug FROM "School"');
    console.log(schools.rows);

    console.log('\n--- 6. Users ---');
    const users = await client.execute('SELECT id, email, role, schoolId FROM "User"');
    console.log(users.rows);

    console.log('\n--- 7. Classes ---');
    const classes = await client.execute('SELECT id, name, schoolId FROM "Class"');
    console.log(classes.rows);

    console.log('\n--- 8. Sections ---');
    const sections = await client.execute('SELECT id, name, classId FROM "Section"');
    console.log(sections.rows);
}

main().catch(console.error).finally(() => process.exit(0));
