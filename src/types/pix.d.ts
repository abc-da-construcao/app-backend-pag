export type generationReferenceOrderProps = {
  orcamentoId: number;
  name?: string;
  paymentId: number;
};

export type RegisterProps = {
  orcamentoId: any;
  paymentId: number;
  imageQrCodePix: string | null;
  dataPix: any | null;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  pedido_referencia?: string;
  valor: number;
  dias_validade: string;
};
