import axios from 'axios';
import { FastifyInstance } from 'fastify';

export default async function auth3dsRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://sandbox.sdk.pagseguro.com/checkout-sdk/sessions',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer 1E31940324A54C84BAE877CB47C2DE03',
        },
      };

      const { data } = await axios.request(options);

      console.log(data);

      // return reply.status(200).send('teste');
    } catch (error: any) {
      console.log(error.message);
      return reply.status(400).send(error);
    }
  });
}
