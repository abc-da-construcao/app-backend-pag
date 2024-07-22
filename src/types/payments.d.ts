export type PaymentProps = {
  id: number;
  orcamento_id: number;
  forma_id: number;
  tipo_id: number;
  nome: string;
  variavel: string;
  parcela: number;
  nome_tipo: string;
  valor: number;
  image_qrcode_pix: string | null;
  emv: string | null;
  status: string;
  data: string;
  data_pix: string | null;
  data_pagamento_pix: string | null;
  link_boleto: string | null;
  boleto_tentativa: number | null;
  created_at: string;
  updated_at: string;
  nsu: string | null;
  tid: string | null;
};

type paymentMethodProps = {
  type: 'CREDIT_CARD' | 'DEBIT_CARD';
  installments: number;
  card: {
    id: string;
    securityCode: string;
    holder: {
      name: string;
      taxId: string;
    };
  };
};
