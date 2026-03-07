import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import {
  createErrorResponse,
  createSuccessResponse,
  needConnection,
} from "../../utils";

export default async function infoRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.get<{ Body: { username: string; password: string } }>(
    "/info",
    async (req, reply) => {
      await needConnection(fastifyInstance, req, reply);
      if (reply.sent) return;
      const user = await prismaInstance.user.findUnique({
        where: {
          id: req.user.id,
        },
      });
      if (user === null) {
        return reply
          .code(401)
          .clearCookie("token")
          .send(createErrorResponse("didn't find you in the DB"));
      }
      reply.send(
        createSuccessResponse(undefined, {
          username: user.username,
        }),
      );
    },
  );
}
