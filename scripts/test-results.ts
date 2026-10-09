import { prisma } from '../src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({ where: { role: 'parent' }, include: { parent: { include: { children: { include: { student: true } }, student: true } } } });
  console.log('Parents:', JSON.stringify(users, null, 2));
  const parent = users[0]?.parent;
  if (!parent) return;
  const ids = [...(parent.children?.map((link) => link.studentId) ?? []), ...(parent.studentId ? [parent.studentId] : [])];
  const results = await prisma.result.findMany({ where: { studentId: { in: Array.from(new Set(ids)) } }, include: { student: true, subjectRef: true, exam: true } });
  console.log('Results count:', results.length);
  if (results[0]) console.log('First result:', JSON.stringify(results[0], null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
