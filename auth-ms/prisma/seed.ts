import { hash } from 'bcryptjs';
import { PrismaClient, Role } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Starting seed...');

  const userPass = await hash('pass123', 8);

  await prisma.user.upsert({
    where: { email: 'johndoe@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: userPass,
      role: Role.BUYER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'janedoe@example.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      password: userPass,
      role: Role.INSPECTOR,
    },
  });

  console.log('Seed complete.');
}

seed()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });