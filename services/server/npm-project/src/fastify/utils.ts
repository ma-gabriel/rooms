import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function needConnection(
  fastifyInstance: FastifyInstance,
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await req.jwtVerify();
    const token = fastifyInstance.jwt.sign(
      { id: req.user.id },
      { expiresIn: "15m" },
    );
    reply.setCookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });
  } catch (error) {
    return reply
      .code(401)
      .clearCookie("token")
      .send(createErrorResponse("You don't seem connected"));
  }
}

export function createErrorResponse(
  message: string | undefined,
  data?: Object,
) {
  return { success: false, message, data };
}

export function createSuccessResponse(
  message: string | undefined,
  data?: Object,
) {
  return { success: true, message, data };
}
