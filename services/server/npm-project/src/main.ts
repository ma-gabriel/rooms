import fastifyModule from "fastify";

const fastify = fastifyModule();
fastify.get('/', (req, reply) => {
    return reply.send("hello world from geymat");
});

fastify.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) throw err;
});
