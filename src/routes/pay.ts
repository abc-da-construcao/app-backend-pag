import { FastifyInstance } from 'fastify';
import z from 'zod';

import { getOrderBolecode, getOrderCard, getOrderPix } from '@/controllers/orderController';
import { tokenCard } from '@/lib/pagseguro';

export default async function payRoute(app: FastifyInstance) {
  app.post('/bolecode', async (request, reply) => {
    const bodySchema = z.object({
      orcamentoId: z.number().positive().nonnegative().int(),
      paymentId: z.number().positive().nonnegative().int(),
    });

    const { orcamentoId, paymentId } = bodySchema.parse(request.body);

    const order = await getOrderBolecode(orcamentoId, paymentId);
    if (!order) {
      return reply.status(500).send({ message: 'Nenhum orcamento foi encontrado.' });
    }

    return reply.status(200).send(order);
  });

  app.post('/pix', async (request, reply) => {
    const bodySchema = z.object({
      orcamentoId: z.number().positive().nonnegative().int(),
      paymentId: z.number().positive().nonnegative().int(),
    });

    const { orcamentoId, paymentId } = bodySchema.parse(request.body);

    const order = await getOrderPix(orcamentoId, paymentId);
    if (!order) {
      return reply.status(500).send({ message: 'Nenhum orcamento foi encontrado.' });
    }

    if (order.error) {
      return reply.status(500).send(order);
    }

    return reply.status(200).send(order);
  });

  app.post('/card', async (request, reply) => {
    const bodySchema = z.object({
      orcamentoId: z.number().positive(),
      paymentId: z.number().positive(),
      paymentMethod: z.object({
        installments: z.number().positive(),
        type: z.string().trim(),
        card: z.object({
          id: z.string().trim(),
          securityCode: z.string().min(3),
          holder: z.object({
            name: z.string(),
            taxId: z.string(),
          }),
        }),
      }),
    });

    const { orcamentoId, paymentId, paymentMethod } = bodySchema.parse(request.body);

    const order = await getOrderCard(orcamentoId, paymentId, paymentMethod);
    if (order.error_messages) {
      return reply.status(500).send(order);
    }

    if (!order) {
      return reply
        .status(500)
        .send({ error: true, message: 'Ocorreu um erro ao realizar o pagamento!' });
    }

    return reply.status(200).send(order);
  });

  app.post('/card/token', async (request, reply) => {
    const bodySchema = z.object({
      number: z.string().trim().min(14),
      month: z.enum(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']),
      year: z.string().trim().min(4),
      securityCode: z.string().trim().min(3),
      holder: z.object({
        name: z.string().trim().min(3),
        taxId: z.string().min(11),
      }),
    });

    const { number, month, year, securityCode, holder } = bodySchema.parse(request.body);

    const data = await tokenCard({
      number,
      month,
      year,
      securityCode,
      name: holder.name,
      taxId: holder.taxId,
    });

    if (data.error) {
      return reply
        .status(data.error.status)
        .send({ message: 'Ocorreu um erro ao tokenizar o cartão!' });
    }

    return reply.status(200).send(data);
  });
}
