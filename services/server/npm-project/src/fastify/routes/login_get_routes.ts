import { FastifyInstance } from "fastify";

export default async function pageRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.get("/hello", (req, reply) => {
    return reply.send("World");
  });
}
