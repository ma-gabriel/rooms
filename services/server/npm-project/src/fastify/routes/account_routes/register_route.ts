import { FastifyInstance } from "fastify";
import fastifyFormbody from "@fastify/formbody";
import prismaInstance from "../../../prisma/instance";

export default async function registerRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(fastifyFormbody);

  fastifyInstance.post<{ Body: { username: string; password: string } }>(
    "/register",
    async (req, reply) => {
      const { username, password } = req.body;
      try {
        const checkUser = await prismaInstance.user.findFirst({
          where: {
            username: username,
          },
        });
        if (checkUser)
          return reply
            .status(401)
            .send({ success: false, reason: `"${username}" is already taken` });
        const newUser = await prismaInstance.user.create({
          data: {
            username: username,
            password: password,
          },
        });
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
        return reply.send({
          success: true,
          message: `Welcome to ${newUser.username}`,
          data: { username: newUser.username },
        });
      } catch (error) {
        reply.status(500).send({ success: false, reason: String(error) });
      }
    },
  );
}
