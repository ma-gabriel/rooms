import { FastifyInstance } from "fastify";

import registerRoute from "./account-routes/register-route";
import logInRoute from "./account-routes/login-route";
import infoRoute from "./account-routes/info-route";
import logOutRoute from "./account-routes/log-out-route";
import changeUsernameRoute from "./account-routes/change-username-route";
import changePasswordRoute from "./account-routes/change-password-route";

export default async function accountRoutes(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(registerRoute);
  fastifyInstance.register(logInRoute);
  fastifyInstance.register(infoRoute);
  fastifyInstance.register(changeUsernameRoute);
  fastifyInstance.register(changePasswordRoute);
  fastifyInstance.register(logOutRoute);
}
