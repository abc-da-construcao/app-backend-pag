import { getItemsByOrder } from '@/models/catalogo/orderItem';
import { getOrderByClientId, getOrderByClientIdAndOrderId } from '@/models/catalogo/orders';
import { FastifyInstance } from 'fastify';

export default async function clientRoute(app: FastifyInstance) {
  //   app.get('/', async (request, reply) => {
  //     return reply.status(200).send({});
  //   });

  //   app.get('/{id}', async (request, reply) => {
  //     const { id } = <any>request.params;
  //     return reply.status(200).send({});
  //   });

  app.get('/:id/orders', async (request, reply) => {
    const { id } = <any>request.params;

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

[
  { id: 1, referencia: 1111 },
  { id: 2, referencia: 2222 },
];
