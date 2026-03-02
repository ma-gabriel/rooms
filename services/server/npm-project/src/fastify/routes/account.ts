import { FastifyInstance } from "fastify";

import registerRoute from "./account_routes/register_route";
import logInRoute from "./account_routes/login_route";
import infoRoute from "./account_routes/info_route";
import logOutRoute from "./account_routes/log_out_route";

export default async function accountRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(registerRoute);
  fastifyInstance.register(logInRoute);
  fastifyInstance.register(infoRoute);
  fastifyInstance.register(logOutRoute);
}
