import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";

export default async function roomsGetOtherRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.get<{
    Body: { username: string; password: string };
    Params: { user: string };
  }>("/rooms/:user", async (req, reply) => {
    try {
      const user = await prismaInstance.user.findUnique({
        where: { username: req.params.user },
        include: { rooms: true },
      });
      if (user === null) {
        return reply.code(404).send({
          success: false,
          message: "didn't find them in the DB",
        });
      }
      // will add a whitelist soon, maybe a blacklist too
      if (user.rooms[0].privacy === "PRIVATE")
        return reply.send({
          success: false,
          message: "their privacy settings don't allow you to see their room",
        });
      return reply.send({
        success: true,
        message: "Welcome",
        data: { draggables: user.rooms[0].draggables },
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
