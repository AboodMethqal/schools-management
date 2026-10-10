import { prisma } from '../src/lib/prisma';

async function check() {
  const schools = await prisma.school.findMany({ select: { id: true, schoolName: true, slug: true } });
  console.log('Schools count:', schools.length);
  schools.forEach(s => console.log(`- ${s.id}: ${s.schoolName} (${s.slug})`));

  const usersCount = await prisma.user.count();
  console.log('Total users:', usersCount);

  const studentsCount = await prisma.student.count();
  console.log('Total students:', studentsCount);

  const teachersCount = await prisma.teacher.count();
  console.log('Total teachers:', teachersCount);

  const classesCount = await prisma.class.count();
  console.log('Total classes:', classesCount);
}

check().catch(console.error);
