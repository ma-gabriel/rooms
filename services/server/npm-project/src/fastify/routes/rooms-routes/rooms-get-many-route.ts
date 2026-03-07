import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { createErrorResponse, createSuccessResponse } from "../../utils";

export default async function roomsGetManyRoute(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.get<{ Body: { username: string; password: string } }>(
    "/manyRooms",
    async (req, reply) => {
      const users = await prismaInstance.room.findMany({
        where: { privacy: "PUBLIC" },
        include: {
          owner: {
            select: {
              username: true,
            },
          },
        },
        take: 7,
      });
      if (users === null) {
        return reply
          .code(500)
          .send(createErrorResponse("Couldn't get the users from the db"));
      }
      reply.send(
        createSuccessResponse(undefined, {
          users: users.map(({ owner }) => owner.username),
        }),
      );
    },
  );
}
