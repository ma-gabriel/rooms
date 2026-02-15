import fastifyModule from "fastify";

import pageRoutes from "./routes/login_get_routes";
import config from "./server_config";
import defaultPage from "./routes/default_page";

export default function () {
  const fastify = fastifyModule();

  // hope to make it a register later, but pain in the *ss for now
  config(fastify);

  fastify.register(defaultPage);
  fastify.register(pageRoutes);

  fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
  });
}
