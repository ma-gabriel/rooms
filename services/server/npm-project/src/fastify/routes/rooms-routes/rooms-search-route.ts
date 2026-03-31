import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { createErrorResponse, createSuccessResponse } from "../../utils";

export default async function roomsSearchRoute(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.get<{ params: { start: string } }>(
    "/searchrooms",
    async (req, reply) => {
      const start = req.query.start;
      if (start === undefined)
        return reply
          .code(400)
          .send(
            createErrorResponse(
              "need a start parameter (you're not supposed to see that)",
            ),
          );
      const users = await prismaInstance.room.findMany({
        where: {
          AND: [
            { OR: [{ privacy: "PUBLIC" }, { privacy: "RESTRICTED" }] },
            { owner: { username: { startsWith: start } } },
          ],
        },
        include: {
          owner: {
            select: {
              username: true,
            },
          },
        },
        take: 5,
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
