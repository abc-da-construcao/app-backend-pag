import { FastifyInstance } from 'fastify';
import z from 'zod';

import { getOrderById } from '@/models/catalogo/orders';
import { getItemsByOrder } from '@/models/catalogo/orderItem';
import { getProductsReferencias } from '@/models/produto/products';
import { getPaymentByOrderId } from '@/models/catalogo/payments';

import { merge } from '@/utls/array';

export default async function orderRoute(app: FastifyInstance) {
  app.get('/:id', async (request, reply) => {
    const { id } = <any>request.params;

    const [order, items, payments] = await Promise.all([
      getOrderById(id),
      getItemsByOrder(id),
      getPaymentByOrderId(id),
    ]);

    const referencias = items.map((item: any) => `'${item.referencia}'`).join(',');

    const products = await getProductsReferencias(referencias);

    const newitems = await merge(items, products);

    order.items = newitems;
    order.payments = payments;

    return reply.status(200).send(order);
  });
}
