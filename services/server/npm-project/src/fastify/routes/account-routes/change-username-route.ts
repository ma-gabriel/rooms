import { FastifyInstance, FastifyReply } from "fastify";
import prismaInstance from "../../../prisma/instance";
import {
  createErrorResponse,
  createSuccessResponse,
  needConnection,
} from "../../utils";

export default async function changeUsernameRoute(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.post<{ Body: { username: string } }>(
    "/updateusername",
    async (req, reply) => {
      await needConnection(fastifyInstance, req, reply);
      if (reply.sent) return;
      const { username } = req.body;
      if (isUsernameValid(username, reply) === false) return;
      try {
        const user = await prismaInstance.user.update({
          where: { id: req.user.id },
          data: { username },
        });
        return reply.send(
          createSuccessResponse(`Hello to ${user.username}`, {
            username: user.username,
          }),
        );
      } catch (e: any) {
        if (e.code === "P2002") {
          return reply
            .status(409)
            .send(createErrorResponse(`"${username}" is already taken`));
        }
        throw e;
      }
    },
  );
}

function isUsernameValid(username: string, reply: FastifyReply) {
  if (!/^[0-9a-zA-Z_-]+$/.test(username)) {
    reply.status(400).send(createErrorResponse("Come on, do better"));
    return false;
  }
  return true;
}
