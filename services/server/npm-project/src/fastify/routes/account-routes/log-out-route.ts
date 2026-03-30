import { FastifyInstance } from "fastify";
import { createSuccessResponse } from "../../utils";

export default async function logOutRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post("/logout", async (req, reply) => {
    return reply.clearCookie("token").send(createSuccessResponse("goodbye"));
  });
}
