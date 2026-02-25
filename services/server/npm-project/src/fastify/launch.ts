import fastifyModule from "fastify";

import accountRoutes from "./routes/account";
import config from "./server_config";
import defaultPage from "./routes/default_page";

export default function () {
  const fastify = fastifyModule();

  // hope to make it a register later, but pain in the *ss for now
  config(fastify);

  fastify.register(defaultPage);
  fastify.register(accountRoutes, { prefix: "/api" });

  fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
  });
}
