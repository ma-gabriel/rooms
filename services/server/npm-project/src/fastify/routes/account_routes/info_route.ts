import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";

export default async function infoRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.get<{ Body: { username: string; password: string } }>(
    "/info",
    async (req, reply) => {
      try {
        await req.jwtVerify();
        const user = await prismaInstance.user.findUnique({
          where: {
            id: req.user.id,
          },
        });
        if (user === null) {
          return reply
            .code(401)
            .setCookie("token", "nothing", {
              path: "/",
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              expires: new Date(),
            })
            .send({
              success: false,
              message: "didn't find you in the DB (account deleted ?)",
            });
        }
        const token = fastifyInstance.jwt.sign(
          { id: user.id },
          { expiresIn: "15m" },
        );
        reply
          .setCookie("token", token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60,
          })
          .send({
            success: true,
            message: `hello ${user.username}`,
            data: { username: user.username },
          });
      } catch (error) {
        return reply
          .code(401)
          .setCookie("token", "nothing", {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(),
          })
          .send({ success: false, message: String(error) });
      }
    },
  );
}
