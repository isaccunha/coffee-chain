import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Database seeded');

  await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'pass123',
        role: 'BUYER',
      },
      {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        password: 'pass123',
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
