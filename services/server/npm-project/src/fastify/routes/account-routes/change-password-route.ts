import { FastifyInstance, FastifyReply } from "fastify";
import prismaInstance from "../../../prisma/instance";
import {
  createErrorResponse,
  createSuccessResponse,
  needConnection,
} from "../../utils";

export default async function changePasswordRoute(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.post<{ Body: { password: string } }>(
    "/updatepassword",
    async (req, reply) => {
      await needConnection(fastifyInstance, req, reply);
      if (reply.sent) return;
      const { password } = req.body;
      const user = await prismaInstance.user.update({
        where: { id: req.user.id },
        data: { password },
      });
      return reply.send(
        createSuccessResponse(`Hello to ${user.username}`, {
          username: user.username,
        }),
      );
    },
  );
}
