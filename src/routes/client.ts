import { getItemsByOrder } from '@/models/catalogo/orderItem';
import { getOrderByClientId, getOrderByClientIdAndOrderId } from '@/models/catalogo/orders';
import { FastifyInstance } from 'fastify';

import z from 'zod';

export default async function clientRoute(app: FastifyInstance) {
  app.get('/:id/orders', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);

    const orders = await getOrderByClientId(id);

    return reply.status(200).send(orders);
  });

  app.get('/:id/orders/:orcamentoId', async (request, reply) => {
    const { id, orcamentoId } = <any>request.params;

    const [order, items] = await Promise.all([
      getOrderByClientIdAndOrderId(id, orcamentoId),
      getItemsByOrder(orcamentoId),
    ]);

    order.items = items;

    return reply.status(200).send(order);
  });
}
