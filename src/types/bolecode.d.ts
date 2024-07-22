export type generationReferenceOrderProps = {
  orcamentoId: number;
  name?: string;
  paymentId: number;
};

export type RegisterProps = {
  orcamentoId: any;
  paymentId: number;
  link?: string | null;
  tentativas?: number | null;
  nome: string;
  documento: string;
  tipo_retorno?: string;
  pedido_referencia?: string;
  vencimento?: any;
  valor: number;
  pessoa: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
};
