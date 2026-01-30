import fastifyModule from "fastify";
import fastifyStatic from "@fastify/static"


const fastify = fastifyModule();

fastify.register(fastifyStatic, {
  root: "/var/www",
  prefix: "/"
})

fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) throw err;
});
