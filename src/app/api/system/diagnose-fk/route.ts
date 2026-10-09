import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@libsql/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || '';
    const tursoToken = process.env.TURSO_AUTH_TOKEN || '';
    const databaseUrl = process.env.DATABASE_URL || '';
    const url = tursoUrl || databaseUrl || 'file:./dev.db';

    const client = createClient({
        url,
        ...(tursoToken ? { authToken: tursoToken } : {})
    });

    try {
        // 1. Run PRAGMA foreign_key_check
        const fkCheck = await client.execute('PRAGMA foreign_key_check');
        
        // 2. Foreign keys on students
        const studentFks = await client.execute('PRAGMA foreign_key_list("students")');
        
        // 3. Foreign keys on User
        const userFks = await client.execute('PRAGMA foreign_key_list("User")');

        // 4. Foreign keys on Parent
        const parentFks = await client.execute('PRAGMA foreign_key_list("Parent")');

        // 5. Foreign keys on ParentStudent
        const parentStudentFks = await client.execute('PRAGMA foreign_key_list("ParentStudent")');

        // 6. Inspect Schools
        const schools = await client.execute('SELECT id, schoolName, slug FROM "School"');

        // 7. Inspect Users
        const users = await client.execute('SELECT id, email, role, schoolId FROM "User"');

        // 8. Inspect Classes and Sections
        const classes = await client.execute('SELECT id, name, schoolId FROM "Class"');
        const sections = await client.execute('SELECT id, name, classId FROM "Section"');

        // 9. Inspect existing students
        const students = await client.execute('SELECT id, registrationNo, schoolId, userId, sectionId FROM "students"');

        // 10. Inspect Parents
        const parents = await client.execute('SELECT id, name, email, studentId, userId FROM "Parent"');

        return NextResponse.json({
            success: true,
            database: {
                isTurso: !!tursoUrl,
                urlType: tursoUrl ? 'TURSO_CLOUD' : 'LOCAL_SQLITE'
            },
            foreignKeyCheckViolations: fkCheck.rows,
            tableForeignKeys: {
                students: studentFks.rows,
                User: userFks.rows,
                Parent: parentFks.rows,
                ParentStudent: parentStudentFks.rows
            },
            data: {
                schools: schools.rows,
                users: users.rows,
                classes: classes.rows,
                sections: sections.rows,
                students: students.rows,
                parents: parents.rows
            }
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message,
            stack: err.stack
        }, { status: 500 });
    }
}
