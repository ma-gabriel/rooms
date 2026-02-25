import { FastifyInstance } from "fastify";

export default async function logOutRoute(fastifyInstance: FastifyInstance) {
  fastifyInstance.post("/logout", async (req, reply) => {
    reply.setCookie("token", undefined, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    return reply.send({
      success: true,
      message: "goodbye",
    });
  });
}
