import { FastifyInstance } from "fastify";

import roomsGetRoute from "./rooms_routes/rooms_get_route";
import roomsSetRoute from "./rooms_routes/rooms_set_route";
import roomsGetManyRoute from "./rooms_routes/rooms_get_many_route";
import roomsGetOtherRoute from "./rooms_routes/rooms_get_other_route";
import roomsSetPrivacy from "./rooms_routes/rooms_privacy";

export default async function roomsRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(roomsSetRoute);
  fastifyInstance.register(roomsGetManyRoute);
  fastifyInstance.register(roomsGetRoute);
  fastifyInstance.register(roomsGetOtherRoute);
  fastifyInstance.register(roomsSetPrivacy);
}
