import { FastifyInstance, FastifyReply } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { createErrorResponse, createSuccessResponse } from "../../utils";

export default async function registerRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{ Body: { username: string; password: string } }>(
    "/register",
    async (req, reply) => {
      const { username, password } = req.body;
      if (isUsernameValid(username, reply) === false) return;
      const checkUser = await prismaInstance.user.findFirst({
        where: {
          username: username,
        },
      });
      if (checkUser) {
        return reply
          .status(401)
          .send(createErrorResponse(`"${username}" is already taken`));
      }
      const newUser = await prismaInstance.user.create({
        data: {
          username: username,
          password: password,
        },
      });
      if (!newUser) {
        return reply
          .status(500)
          .send(
            createErrorResponse(
              "for some reason didn't create the user. Try retrying",
            ),
          );
      }
      const newRoom = await prismaInstance.room.create({
        data: {
          ownerId: newUser.id,
        },
      });
      if (!newRoom) {
        prismaInstance.user.delete({ where: { id: newUser.id } });
        return reply
          .status(500)
          .send(
            createErrorResponse(
              "for some reason didn't create your room. Try retrying",
            ),
          );
      }
      const token = fastifyInstance.jwt.sign(
        { id: newUser.id },
        { expiresIn: "15m" },
      );
      reply.setCookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60,
      });
      return reply.send(
        createSuccessResponse(`Welcome to ${newUser.username}`, {
          username: newUser.username,
        }),
      );
    },
  );
}

function isUsernameValid(username: string, reply: FastifyReply) {
  if (!/^[0-9a-zA-Z_-]+$/.test(username)) {
    reply.status(401).send(createErrorResponse("Come on, do better"));
    return false;
  }
  return true;
}
