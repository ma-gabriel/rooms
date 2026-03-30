import { FastifyInstance, FastifyReply } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { createErrorResponse, createSuccessResponse } from "../../utils";
import { hashPassword } from "../../../bcrypt/password";

export default async function registerRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{ Body: { username: string; password: string } }>(
    "/register",
    async (req, reply) => {
      const { username, password } = req.body;
      if (isUsernameValid(username, reply) === false) return;
      try {
        const result = await prismaInstance.$transaction(async (tx) => {
          const user = await tx.user.create({ data: { username, password: await hashPassword(password)} });
          await tx.room.create({ data: { ownerId: user.id } });
          return user;
        });
        const token = fastifyInstance.jwt.sign(
          { id: result.id },
          { expiresIn: "1d" },
        );
        reply.setCookie("token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 24 * 60 * 60,
        });
        return reply.send(
          createSuccessResponse(`Welcome to ${result.username}`, {
            username: result.username,
          }),
        );
      } catch (e) {
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
