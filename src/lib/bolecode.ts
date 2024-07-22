import { errorValidation } from '@/error-handler';
import { insertLog } from '@/models/catalogo/log';
import { updateDataBolecodePayment } from '@/models/catalogo/payments';
import { api } from '@/server/pagmento';
import { RegisterProps } from '@/types/bolecode';

export async function processBolecode(item: RegisterProps) {
  /* tentativa de gerar o boleto */
  const tentativa = !item.tentativas ? 1 : item.tentativas + 1;
  item.tentativas = tentativa;

  try {
    const { data } = await api.post('/bolecode/registrar', await formatJson(item));

    updateDataBolecodePayment({
      id: item.paymentId,
      date: new Date(),
      link: data.link,
      tentativa,
    });

    insertLog({
      orcamentoId: item.orcamentoId,
      title: `BOLETO, gerado com sucesso do orcamento: ${item.orcamentoId} pagamento: ${item.paymentId}`,
      log: data,
    });
    return data;
  } catch (error) {
    const err = await errorValidation(error);

    console.log('ERROR: ', err.error.message);

    insertLog({
      orcamentoId: item.orcamentoId,
      title: `BOLETO, ERRO ao gerar boleto do orcamento: ${item.orcamentoId} pagamento: ${item.paymentId}`,
      log: err.error.message,
    });

    return err.error.message;
  }
}

async function formatJson(item: RegisterProps) {
  /* referencia do boleto */
  const referencia = `${item.paymentId}-${item.orcamentoId}${
    item.tentativas && `-${item.tentativas}`
  }`;
  const json = {
    pagador: item.nome.toLowerCase().trim(),
    cpfCnpj: item.documento.replace(/\D/g, ''),
    tipo_retorno: 'link',
    pedido_referencia: referencia.replace(/\s/g, ''),
    vencimento: '',
    valor: item.valor,
    tipo_pessoa: item.pessoa.toUpperCase(),
    logradouro: item.logradouro.toLowerCase(),
    bairro: item.bairro.toLowerCase().substring(0, 15),
    cidade: item.cidade.toLowerCase(),
    uf: item.uf.toUpperCase(),
    cep: item.cep.replace(/\D/g, ''),
  };

  console.log(json);
  return json;
}

// vencimento: new Date(today.setDate(today.getDate() + 3)).toLocaleString('pt-BR', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   }),
