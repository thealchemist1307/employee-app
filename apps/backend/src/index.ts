import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define your GraphQL schema
const typeDefs = `#graphql
  type User {
    id: Int!
    email: String!
    name: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(email: String!, name: String): User!
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_: any, { id }: { id: number }) => {
      return await prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createUser: async (_: any, { email, name }: { email: string; name?: string }) => {
      return await prisma.user.create({
        data: { email, name },
      });
    },
  },
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  const PORT = process.env.PORT || 4000;

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

startApolloServer().catch(console.error);
