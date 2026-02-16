import { FastifyInstance } from "fastify";
import fastifyFormbody from "@fastify/formbody";

import { PrismaClient } from "../../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default async function pageRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(fastifyFormbody);

  fastifyInstance.get("/hello", (req, reply) => reply.send("World"));

  fastifyInstance.post<{ Body: { username: string; password: string } }>(
    "/register",
    async (req, reply) => {
      const { username, password } = req.body;
      try {
        const newUser = await prisma.user.create({
          data: {
            username: username,
            password: password,
          },
        });
        reply.send({ success: true, userId: newUser.id });
      } catch (error) {
        reply.status(500).send({ error: "Failed to create user" });
      }
    },
  );
}
