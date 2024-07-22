import { FastifyInstance } from 'fastify';

import { getPaymentByOrderId } from '@/models/catalogo/payments';

export default async function paymentRoute(app: FastifyInstance) {
  app.get('/:id', async (request, reply) => {
    const { id } = <any>request.params;

    const payment = await getPaymentByOrderId(id);

    return reply.status(200).send(payment);
  });
}
