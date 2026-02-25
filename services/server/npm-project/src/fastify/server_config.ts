import fastifyStatic from "@fastify/static";
import fastifyJWT from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { FastifyInstance } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
  }
}

export default function config(fastifyInstance: FastifyInstance) {
  fastifyInstance.register(fastifyCookie, {
    secret: "Hello cookie poorly signed",
  });

  fastifyInstance.register(fastifyJWT, {
    secret: "Hello JWT poorly signed",
    cookie: {
      cookieName: "token",
      signed: false,
    },
  });

  fastifyInstance.register(fastifyStatic, {
    root: "/var/www",
    prefix: "/resources",
  });
}
