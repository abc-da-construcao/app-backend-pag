import { pagseguro } from '@/server/pagseguro';
import { address, client, itemsFormat, phone } from '@/lib/pagseguro';

import { OrderProps } from '@/types/orders';

import { insertLog } from '@/models/catalogo/log';
import { errorValidation } from '@/error-handler';
import { formatAmountPagSeguro } from '@/utls/currency';

export async function processCard(order: OrderProps) {
  const json = await jsonFormat(order);

  console.log(json?.charges);

  try {
    const { data } = await pagseguro.post('/orders', json);

    console.log(data);

    insertLog({
      orcamentoId: order.orcamento_id,
      title: `[MOBILE] Pagamento com cartão na pagseguro (orcamentoId: ${order.orcamento_id} paymentId: ${order.payments?.id})`,
      log: data,
    });

    return data;
  } catch (error) {
    const err = await errorValidation(error);
    console.error('[ERROR]:', err.error.message);

    insertLog({
      orcamentoId: order.orcamento_id,
      title: `[MOBILE] [ERROR] Pagamento com cartão na pagseguro (orcamentoId: ${order.orcamento_id} paymentId: ${order.payments?.id})`,
      log: err.error.message,
    });

    return err.error.message;
  }
}

export async function jsonFormat(order: OrderProps) {
  const phones = [];
  if (!order.adresses) return;

  if (order.telefone_cliente) {
    phones.push(phone({ number: order?.telefone_cliente }));
  }
  if (order.celular_cliente) {
    phones.push(phone({ number: order?.celular_cliente }));
  }

  const [customer, shipping, items] = await Promise.all([
    client({
      name: order.nome_cliente,
      email: order.email_cliente,
      tax_id: order.documento_cliente,
      phones,
    }),
    address({
      street: order.adresses?.endereco,
      number: order.adresses?.numero,
      complement: order.adresses?.complemento,
      locality: order.adresses?.bairro,
      city: order.adresses?.cidade,
      region_code: order.adresses?.estado,
      postal_code: order.adresses?.cep,
    }),
    itemsFormat(order.items),
  ]);
  // console.log('VALORRRRRR:', order.payments?.valor);
  // console.log('VALORRRRR PARERR:', formatAmountPagSeguro(String(order.payments?.valor)));
  // console.log('VALORRRRR PARERR:', formatAmountPagSeguro(order.payments?.valor));
  // console.log('VALORRRRR PARERR:', formatAmountPagSeguro(18.3));
  // console.log('VALORRRRR PARERR OOOOOOOO:', formatAmountPagSeguro('8.9'));

  return {
    reference_id: order.orcamento_id,
    customer,
    items,
    shipping,
    notification_urls: ['https://meusite.com/notificacoes'],
    charges: [
      {
        reference_id: order.orcamento_id,
        // description: 'descricao da cobranca',
        amount: {
          value: formatAmountPagSeguro(order.payments?.valor),
          currency: 'BRL',
        },

        payment_method: {
          type: order.payment_method?.type,
          installments: Number(order.payment_method?.installments),
          capture: true,
          soft_descriptor: 'ABC da Construção',
          card: {
            id: order.payment_method?.card.id,
            security_code: order.payment_method?.card.securityCode,
            holder: {
              name: order.payment_method?.card.holder.name,
              tax_id: order.payment_method?.card.holder.taxId,
            },
          },
        },
      },
    ],
  };
}
