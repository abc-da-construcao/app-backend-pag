import fastify from 'fastify';
import fastifyCors from '@fastify/cors';

import orderRoute from '@/routes/order';
import clientRoute from '@/routes/client';
import paymentRoute from '@/routes/payment';
import payRoute from '@/routes/pay';
// import auth3dsRoute from '@/routes/auth3ds';

import { errorHandler } from '@/error-handler';

const app = fastify().withTypeProvider(); // LOG servidor { logger: true }

app.register(fastifyCors, {
  origin: '*',
});

app.get('/hc', async (request, reply) => {
  reply.status(200).send('UAI, Tó vivo, só!');
});

// app.register(auth3dsRoute, { prefix: '3ds' });
app.register(orderRoute, { prefix: 'orders' });
app.register(clientRoute, { prefix: 'clients' });
app.register(paymentRoute, { prefix: 'payments' });
app.register(payRoute, { prefix: 'pay' });

app.setErrorHandler(errorHandler);

const PORT = Number(process.env.PORT) || 3333; // port

app
  .listen({ port: PORT, host: '0.0.0.0' })
  .then(() => {
    console.log(`HTTP server running PORT :${PORT}!`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
