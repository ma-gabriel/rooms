import { FastifyInstance, FastifyReply } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { createErrorResponse, needConnection } from "../../utils";

export default async function roomsSetPrivacy(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.post<{
    Body: { privacy: "PRIVATE" | "RESTRICTED" | "PUBLIC" };
  }>("/privacy", async (req, reply) => {
    await needConnection(fastifyInstance, req, reply);
    if (reply.sent) return;
    if (isPrivacyValid(req.body.privacy, reply) === false) return;
    const rooms = await prismaInstance.room.updateManyAndReturn({
      where: { ownerId: req.user.id },
      data: { privacy: req.body.privacy },
    });
    if (rooms === null) {
      return reply
        .code(401)
        .clearCookie("token")
        .send(createErrorResponse("didn't find you in the DB"));
    }
    reply.send({
      success: true,
      data: { privacy: rooms[0].privacy },
    });
  });
}

function isPrivacyValid(privacy: string, reply: FastifyReply) {
  if (!privacy || !["PRIVATE", "RESTRICTED", "PUBLIC"].includes(privacy)) {
    reply.code(400).send({
      success: false,
      message:
        'the body must have privacy dumbass, either "PRIVATE", "RESTRICTED" or "PUBLIC"',
    });
    return false;
  }
  return true;
}
