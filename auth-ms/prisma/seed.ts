import { hash } from 'bcryptjs';

import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Database seeded');

  const userPass = 'pass123';

  await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash(userPass, 8),
        role: 'BUYER',
      },
      {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: await hash(userPass, 8),
        role: 'INSPECTOR',
      },
    ],
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
