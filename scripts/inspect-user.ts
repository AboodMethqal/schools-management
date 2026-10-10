import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function inspect() {
  const user = await prisma.user.findUnique({
    where: { email: 'qa.principal@methqal.tech' }
  });
  console.log('User found:', user?.email, user?.role, user?.mustChangePassword);
  console.log('Password hash:', user?.password);
  
  if (user?.password) {
    const testTemp = await bcrypt.compare('Principal@123456', user.password);
    const testNew = await bcrypt.compare('Principal@NewPass2026!', user.password);
    console.log('Matches Principal@123456?', testTemp);
    console.log('Matches Principal@NewPass2026!?', testNew);
  }
}

inspect().catch(console.error);
