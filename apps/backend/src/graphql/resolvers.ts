import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    employees: async (_, { filter, page = 1, pageSize = 10, sortBy }, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const where: any = {};
      if (filter?.class) where.class = filter.class;
      if (filter?.minAge || filter?.maxAge) {
        where.age = {};
        if (filter.minAge) where.age.gte = filter.minAge;
        if (filter.maxAge) where.age.lte = filter.maxAge;
      }

      return prisma.employee.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: sortBy ? { [sortBy]: 'asc' } : undefined,
      });
    },

    employee: (_, { id }) => prisma.employee.findUnique({ where: { id } }),

    me: (_, __, { user }) => user || null,
  },

  Mutation: {
    addEmployee: async (_, { input }, { user }) => {
      if (!user || user.role !== Role.ADMIN) throw new Error('Forbidden');
      return prisma.employee.create({ data: input });
    },

    updateEmployee: async (_, { id, input }, { user }) => {
      if (!user || user.role !== Role.ADMIN) throw new Error('Forbidden');
      return prisma.employee.update({ where: { id }, data: input });
    },

    login: async (_, { email, password }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign(user, process.env.JWT_SECRET!);
    },
  },
};
