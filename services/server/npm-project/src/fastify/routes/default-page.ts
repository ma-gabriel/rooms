import { FastifyInstance } from "fastify";

export default async function defaultPage(fastifyInstance: FastifyInstance) {
  fastifyInstance.setNotFoundHandler((req, reply) => {
    return reply.code(200).sendFile("index.html");
  });
}
