import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { Prisma } from "../../../prisma/generated/client";

export default async function roomsSetRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{ Body: { draggables: Prisma.JsonValue } }>(
    "/rooms",
    async (req, reply) => {
      if (!req.body.draggables || !Array.isArray(req.body.draggables))
        return reply
          .code(400)
          .send({ success: false, reason: "i need an array dumbass" });
      try {
        await req.jwtVerify();
        const user = await prismaInstance.user.update({
          where: {
            id: req.user.id,
          },
          data: {
            draggables: req.body.draggables,
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
            data: { draggables: user.draggables },
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
