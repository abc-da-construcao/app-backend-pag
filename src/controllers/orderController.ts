import { getOrderById } from '@/models/catalogo/orders';
import { getItemsByOrder } from '@/models/catalogo/orderItem';
import { getProductsReferencias } from '@/models/produto/products';
import { getPaymentByOrderId, getPaymentByOrderIdAndPaymentId } from '@/models/catalogo/payments';

import { merge } from '@/utls/array';

import { getAddressByClientIdType } from '@/models/catalogo/adresses';
import { processPix } from '@/lib/pix';
import { processBolecode } from '@/lib/bolecode';
import { processCard } from '@/lib/card';

export async function getOrder(orcamentoId: number) {
  const [order, items, payments] = await Promise.all([
    getOrderById(orcamentoId),
    getItemsByOrder(orcamentoId),
    getPaymentByOrderId(orcamentoId),
  ]);

  if (!order) {
    return;
  }

  const referencias = items.map((item: any) => `'${item.referencia}'`).join(',');
  const products = await getProductsReferencias(referencias);
  const newitems = await merge(items, products);

  order.items = newitems;
  order.payments = payments;

  return order;
}

export async function getOrderBolecode(orcamentoId: number, paymentId: number) {
  const [order, payments] = await Promise.all([
    getOrderById(orcamentoId),
    getPaymentByOrderIdAndPaymentId(orcamentoId, paymentId),
  ]);

  if (!order) {
    console.log(`OPS, Orcamento não foi encontrado. (${orcamentoId} - ${paymentId})`);
    return;
  }

  const address = await getAddressByClientIdType(order.id_cliente, 'cobranca');

  const response = await processBolecode({
    orcamentoId,
    paymentId,
    link: payments.link_boleto,
    tentativas: payments.boleto_tentativa,
    nome: order.nome_cliente,
    documento: order.documento_cliente,
    tipo_retorno: 'link',
    valor: payments.valor,
    pessoa: order.pessoa_cliente,
    logradouro: address.endereco,
    bairro: address.bairro,
    cidade: address.cidade,
    uf: address.estado,
    cep: address.cep,
  });

  return response;
}

export async function getOrderPix(orcamentoId: number, paymentId: number) {
  const [order, payments] = await Promise.all([
    getOrderById(orcamentoId),
    getPaymentByOrderIdAndPaymentId(orcamentoId, paymentId),
  ]);

  if (!order) {
    console.log(`OPS, Orcamento não foi encontrado. (${orcamentoId} - ${paymentId})`);
    return;
  }

  const response = await processPix({
    orcamentoId,
    paymentId,
    imageQrCodePix: payments.image_qrcode_pix,
    dataPix: payments.data_pix,
    nome: order.nome_cliente,
    email: order.email_cliente,
    telefone: order.telefone_cliente ?? order.celular_cliente,
    documento: order.documento_cliente,
    valor: payments.valor,
    dias_validade: '5',
  });

  return response;
}

export async function getOrderCard(orcamentoId: number, paymentId: number, paymentMethod: any) {
  const [order, items, payments] = await Promise.all([
    getOrderById(orcamentoId),
    getItemsByOrder(orcamentoId),
    getPaymentByOrderIdAndPaymentId(orcamentoId, paymentId),
  ]);

  if (!order) {
    console.log(`OPS, Orcamento não foi encontrado. (${orcamentoId} - ${paymentId})`);
    return;
  }

  const address = await getAddressByClientIdType(order.id_cliente, 'cobranca');

  order.items = items;
  order.adresses = address;
  order.payments = payments;
  order.payment_method = paymentMethod;
  // console.log(order);
  // return;
  const response = await processCard(order);

  return response;
}
