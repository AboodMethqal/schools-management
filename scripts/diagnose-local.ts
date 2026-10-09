import { prisma } from '../src/lib/prisma';

async function main() {
    console.log("Checking local database...");
    const schools = await prisma.school.findMany();
    console.log("Schools count:", schools.length);
    console.log("Schools:", schools.map(s => ({ id: s.id, name: s.schoolName })));

    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true, schoolId: true }
    });
    console.log("Users count:", users.length);
    console.log("Users:", users);

    const students = await prisma.student.findMany();
    console.log("Students count:", students.length);
}

main().catch(console.error).finally(() => process.exit(0));
