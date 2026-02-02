import fastifyModule from "fastify";
import fastifyStatic from "@fastify/static"
import fastifyJWT from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

const fastify = fastifyModule();

fastify.register(fastifyCookie, {
  secret: "Hello cookie poorly signed",
});

fastify.register(fastifyJWT, {
  secret: "Hello JWT poorly signed",
  cookie: {
    cookieName: 'token',
    signed: false,
  }
});
async function identifyUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const token = fastify.jwt.sign(
      { id: req.user.id },
      { expiresIn: "15m" }
    );
    reply.setCookie('token', token, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: true
    })
  } catch (err) {
    return reply.redirect("login", 302);
  }
};

fastify.register(fastifyStatic, {
  root: "/var/www",
  prefix: "/resources"
})

fastify.setNotFoundHandler( {
//  onRequest: identifyUser
}, (req, reply) => {
  return reply.sendFile('index.html')
})

fastify.get('/hello', (req, reply) => {
  return reply.send('World');
})



fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) throw err;
});
