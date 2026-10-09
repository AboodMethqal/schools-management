import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { role: 'parent' }, include: { parent: { include: { children: { include: { student: true } }, student: true } } } });
  console.log('--- Parent Users ---');
  for (const user of users) {
    const children = user.parent?.children?.map((link) => link.student) ?? [];
    if (user.parent?.student && !children.some((child) => child.id === user.parent?.student?.id)) children.push(user.parent.student);
    console.log(`${user.email} | parent=${Boolean(user.parent)} | children=${children.length}`);
  }
}

main().catch(console.error).finally(async () => prisma.$disconnect());
