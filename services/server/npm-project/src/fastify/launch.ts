import fastifyModule, { FastifyInstance } from "fastify";

import config from "./server-config";
import accountRoutes from "./routes/account-routes";
import defaultPage from "./routes/default-page";
import roomsRoutes from "./routes/rooms";

function exitOn(event: NodeJS.Signals, fastify: FastifyInstance) {
  process.on(event, async () => {
    await fastify.close();
    process.exit(0);
  });
}

export default function () {
  const fastify = fastifyModule();

  // hope to make it a register later, but pain in the *ss for now
  config(fastify);

  fastify.register(defaultPage);
  fastify.register(accountRoutes, { prefix: "/api" });
  fastify.register(roomsRoutes, { prefix: "/api" });

  fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
  });
  
  exitOn("SIGINT", fastify);
  exitOn("SIGTERM", fastify);
}
