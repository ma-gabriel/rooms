import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";

export default async function roomsGetManyRoute(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.get<{ Body: { username: string; password: string } }>(
    "/manyRooms",
    async (req, reply) => {
      try {
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
          return reply.code(500).send({
            success: false,
            message: "Couldn't get the users from the db",
          });
        }
        reply.send({
          success: true,
          data: { users: users.map(({ owner }) => owner.username) },
        });
      } catch (error) {
        return reply.code(500).send({ success: false, message: String(error) });
      }
    },
  );
}
