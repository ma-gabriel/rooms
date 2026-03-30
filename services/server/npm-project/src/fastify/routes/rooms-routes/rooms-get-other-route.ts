import { FastifyInstance } from "fastify";
import prismaInstance from "../../../prisma/instance";
import { getImgproxyUrl } from "../../../imgproxy/utils";
import { createErrorResponse, createSuccessResponse } from "../../utils";

function transformDraggables(items: any[]): any[] {
  return items.map((item) =>
    item.type === "Img" && item.link
      ? { ...item, link: getImgproxyUrl(item.link) }
      : item,
  );
}

export default async function roomsGetOtherRoute(
  fastifyInstance: FastifyInstance,
) {
  fastifyInstance.get<{
    Body: { username: string; password: string };
    Params: { user: string };
  }>("/rooms/:user", async (req, reply) => {
    const user = await prismaInstance.user.findUnique({
      where: { username: req.params.user },
      include: { rooms: true },
    });
    if (user === null) {
      return reply
        .code(404)
        .send(createErrorResponse("didn't find them in the DB"));
    }
    // will add a whitelist soon, maybe a blacklist too
    if (user.rooms[0].privacy === "PRIVATE")
      return reply.send(
        createErrorResponse(
          "their privacy settings don't allow you to see their room",
        ),
      );
    return reply.send(
      createSuccessResponse("Welcome", {
        draggables: transformDraggables(user.rooms[0].draggables as any[]),
      }),
    );
  });
}
