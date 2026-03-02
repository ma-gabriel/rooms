import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";

export default async function roomsSetPrivacy(fastifyInstance: FastifyInstance) {
  fastifyInstance.post<{
    Body: { privacy: "PRIVATE" | "RESTRICTED" | "PUBLIC" };
  }>("/privacy", async (req, reply) => {
    const privacy = req.body.privacy;
    if (!privacy || !["PRIVATE", "RESTRICTED", "PUBLIC"].includes(privacy))
      return reply.code(400).send({
        success: false,
        message:
          'the body must have privacy dumbass, either "PRIVATE", "RESTRICTED" or "PUBLIC"',
      });
    try {
      await req.jwtVerify();
      const rooms = await prismaInstance.room.updateManyAndReturn({
        where: { ownerId: req.user.id },
        data: { privacy: privacy },
      });
      if (rooms === null) {
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
        { id: req.user.id },
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
          data: { privacy: rooms[0].privacy },
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
  });
}
