import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@demo.com';
  const password = 'admin123'; // You can change this
  const hashed = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists.');
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: Role.ADMIN,
    },
  });

  console.log(`✅ Admin user created: ${email} / ${password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  }); 