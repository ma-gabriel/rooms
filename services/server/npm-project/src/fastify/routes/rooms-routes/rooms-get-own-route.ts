import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import {
  createErrorResponse,
  createSuccessResponse,
  needConnection,
} from "../../utils";

export default async function roomsGetRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.get<{ Body: { username: string; password: string } }>(
    "/rooms",
    async (req, reply) => {
      await needConnection(fastifyInstance, req, reply);
      if (reply.sent) return;
      const user = await prismaInstance.user.findUnique({
        where: { id: req.user.id },
        include: { rooms: true },
      });
      if (user === null) {
        return reply
          .code(401)
          .clearCookie("token")
          .send(createErrorResponse("didn't find you in the DB"));
      }
      reply.send(
        createSuccessResponse("here you go", {
          draggables: user.rooms[0].draggables,
          privacy: user.rooms[0].privacy,
        }),
      );
    },
  );
}
