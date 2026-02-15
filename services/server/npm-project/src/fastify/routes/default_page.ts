
import { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";

export default async function defaultPage(fastifyInstance: FastifyInstance) {

  fastifyInstance.setNotFoundHandler((req, reply) => {
    return reply.code(200).sendFile("index.html");
  });
}
