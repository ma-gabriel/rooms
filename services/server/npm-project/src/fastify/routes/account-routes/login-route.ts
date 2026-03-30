import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { createErrorResponse, createSuccessResponse } from "../../utils";
import { comparePassword } from "../../../bcrypt/password";

export default async function logInRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{ Body: { username: string; password: string } }>(
    "/login",
    async (req, reply) => {
      const { username, password } = req.body;
      const user = await prismaInstance.user.findFirst({
        where: {
          username: username,
        },
      });
      if (user === null) {
        return reply
          .status(401)
          .send(createErrorResponse(`${username} doesn't exist`));
      }
      if (!(await comparePassword(password, user.password))) {
        return reply.status(401).send(createErrorResponse("Wrong password"));
      }
      const token = fastifyInstance.jwt.sign(
        { id: user.id },
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
        createSuccessResponse(undefined, {
          username: user.username,
        }),
      );
    },
  );
}
