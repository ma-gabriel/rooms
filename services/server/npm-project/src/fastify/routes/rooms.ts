import { FastifyInstance } from "fastify";

import roomsGetRoute from "./rooms-routes/rooms-get-own-route";
import roomsSetRoute from "./rooms-routes/rooms-set-route";
import roomsGetManyRoute from "./rooms-routes/rooms-get-many-route";
import roomsGetOtherRoute from "./rooms-routes/rooms-get-other-route";
import roomsSetPrivacy from "./rooms-routes/set-privacy-route";

export default async function roomsRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(roomsSetRoute);
  fastifyInstance.register(roomsGetManyRoute);
  fastifyInstance.register(roomsGetRoute);
  fastifyInstance.register(roomsGetOtherRoute);
  fastifyInstance.register(roomsSetPrivacy);
}
