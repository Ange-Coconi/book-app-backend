import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; dotenv.config();
import prisma from '../src/db/index';

async function main() {
  // Create user 0 (yourself)
  const hashedPassword0 = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
  await prisma.user.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      username: 'admin',
      password: hashedPassword0,
      email: 'admin@example.com',
    },
  });

  // Create user 1 (unauthenticated user)
  const hashedPassword1 = await bcrypt.hash('guest_password', 10);
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: 'guest',
      password: hashedPassword1,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
