import { paymentMethodProps, PaymentProps } from '@/types/payments';
import { AddressProps } from '@/types/address';

export type OrderProps = {
  id: number;
  orcamento_id: number;
  tipo_pagamento: string;
  nome_pagamento: string;
  id_status: number;
  nome_status: string;
  transportadora: string;

  id_cliente: number;
  nome_cliente: string;
  documento_cliente: string;
  email_cliente: string;
  nasc_cliente: string;
  pessoa_cliente: string;
  telefone_cliente: string;
  celular_cliente: string;

  valor: number;
  valor_frete: number;
  valor_carrinho_sem_desconto: number;
  descontro: number;
  created_at: string;
  items?: OrderItemProps[];

  // payments?: PaymentProps[];
  payments?: any;
  payment_method?: paymentMethodProps;
  adresses?: AddressProps;
};

export type OrderItemProps = {
  id: number;
  orcamento_id: number;
  referencia: number;
  nome_original: string;
  nome_amigavel?: string;
  qtd: number;
  caixa: number;
  de: number;
  preco_desconto: number;
  preco_unitario: number;
  total_desconto: number;
  total: number;
};
