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
      number: z
        .string()
        .min(1, 'Campo Obrigatorio')
        .refine((value) => {
          const regex =
            /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35[0-9]{3})[0-9]{11})$/;
          return regex.test(value.replace(/\D/g, ''));
        }, 'O número de cartão inválido')
        .transform((value) => value.replace(/\D/g, '')),
      name: z.string().min(1, 'Campo obrigatorio'),
      expiry: z
        .string()
        .min(1, 'Campo obrigatorio')
        .regex(/^(0[1-9]|1[0-2])\/(20[2-5][0-9])$/, 'Data inválida'),
      cvv: z.string().min(1, 'Campo obrigatorio').min(3, 'CVV inválida'),
      document: z
        .string()
        .min(1, 'Campo obrigatorio')
        .regex(
          /(\d{3})(\d{3})(\d{3})(\d{2})|(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
          'Número de documento inválido'
        ) // Validação básica para CPF ou CNPJ
        .transform((value) => value.replace(/\D/g, '')),
    });

    const { number, name, expiry, cvv, document } = bodySchema.parse(request.body);

    const data = await tokenCard({
      number,
      month: expiry.slice(0, 2),
      year: expiry.slice(3, 7),
      securityCode: cvv,
      name: name,
      taxId: document,
    });

    if (data.error) {
      return reply
        .status(data.error.status)
        .send({ message: 'Ocorreu um erro ao tokenizar o cartão!' });
    }

    return reply.status(200).send(data);
  });
}
