import bcrypt from 'bcrypt';
import prisma from '../src/db/index'; 
import dotenv from 'dotenv';
import { prepopulate } from '../src/helper/prepopulate';

dotenv.config();


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
  const user_1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: 'guest',
      password: hashedPassword1,
    },
  });

  prepopulate(user_1.id)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
