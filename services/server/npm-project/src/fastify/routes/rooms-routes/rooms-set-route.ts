import { FastifyInstance, FastifyReply } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { Prisma } from "../../../prisma/generated/client";
import {
  createErrorResponse,
  createSuccessResponse,
  needConnection,
} from "../../utils";

export default async function roomsSetRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{ Body: { draggables: Prisma.JsonValue } }>(
    "/rooms",
    async (req, reply) => {
      if (areDraggablesValid(req.body.draggables, reply) === false) return;
      await needConnection(fastifyInstance, req, reply);
      if (reply.sent) return;
      const rooms = await prismaInstance.room.updateManyAndReturn({
        where: { ownerId: req.user.id },
        data: { draggables: req.body.draggables },
      });
      if (rooms === null) {
        return reply
          .code(401)
          .clearCookie("token")
          .send(createErrorResponse("didn't find you in the DB"));
      }
      reply.send(
        createSuccessResponse(undefined, { draggables: rooms[0].draggables }),
      );
    },
  );
}

function areDraggablesValid(draggables: Prisma.JsonValue, reply: FastifyReply) {
  if (!draggables || !Array.isArray(draggables)) {
    reply.code(400).send(createErrorResponse("i need an array dumbass"));
    return false;
  }
  return true;
}
