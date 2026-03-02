import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";

export default async function logInRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{ Body: { username: string; password: string } }>(
    "/login",
    async (req, reply) => {
      const { username, password } = req.body;
      try {
        const user = await prismaInstance.user.findFirst({
          where: {
            username: username,
          },
        });
        if (user === null) {
          return reply
            .status(401)
            .send({ success: false, message: `${username} doesn't exist` });
        }
        if (user.password !== password) {
          return reply
            .status(401)
            .send({ success: false, message: "Wrong password" });
        }
        const token = fastifyInstance.jwt.sign(
          { id: user.id },
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
          message: "Welcome to " + user.id,
          data: { username: user.username },
        });
      } catch (error) {
        reply.status(500).send({ error: String(error) });
      }
    },
  );
}
