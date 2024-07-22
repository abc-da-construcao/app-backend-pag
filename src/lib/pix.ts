import { isDateMoreThan24HoursInFuture } from '@/utls/date';
import { generationReferenceOrderProps, RegisterProps } from '@/types/pix';
import { api } from '@/server/pagmento';

import { errorValidation } from '@/error-handler';
import { updateDataPixPayment } from '@/models/catalogo/payments';
import { insertLog } from '@/models/catalogo/log';

export async function processPix(item: RegisterProps) {
  //   insertLog(teste);

  const isDate = isDateMoreThan24HoursInFuture(item.dataPix);
  const referencia = await generationReferenceOrder({
    orcamentoId: item.orcamentoId,
    paymentId: item.paymentId,
  });

  item.pedido_referencia = referencia;

  /* 1 - se a data for de hoje e tiver gerado pix, busca */
  if (!isDate && !item.imageQrCodePix) {
    console.log('1 - se a data for de hoje e tiver gerado PIX, busca');

    return await register({ item, title: '1 - PIX gerado pela primeira vez.' });
  }

  /* 2 - se a data for hoje e não gerou pix ainda, cria */
  if (!isDate && item.imageQrCodePix) {
    console.log('2 - se a data for hoje e não gerou pix ainda, cria', referencia);

    const response = await search({
      referencia,
      item,
      title: '2 - Consulta realizada do PIX, link valido. ',
    });

    /* Se teve algum problema e não consegiu consultar o pix gerar um novo */
    if (response.error) {
      return await register({ item, title: '2 - PIX regerado' });
    } else {
      return response;
    }
  }
  /* 3 - se a data não for de hoje, cria o pix */
  if (isDate) {
    console.log('3 - se a data não for de hoje, cria o pix');
    return await register({ item, title: '3 - PIX gerado.' });
  }
}

async function generationReferenceOrder({
  orcamentoId,
  name = 'plataforma',
  paymentId,
}: generationReferenceOrderProps) {
  const pedido_referencia = `${orcamentoId}-${name}-${paymentId}-1`;
  return pedido_referencia.trim();
}

async function formatJson(item: RegisterProps) {
  const json = {
    nome: item.nome.toLowerCase().trim(),
    email: item.email.trim(),
    telefone: item.telefone.replace(/\D/g, ''),
    cpfCnpj: item.documento.replace(/\D/g, ''),
    pedido_referencia: item.pedido_referencia,
    valor: item.valor,
    dias_validade: item.dias_validade,
  };

  return json;
}

async function register({ item, title }: { item: RegisterProps; title?: string }) {
  try {
    const { data } = await api.post('/itau/criar-qrcode-pix', await formatJson(item));
    console.log('Create:', data);

    updateDataPixPayment({ id: item.paymentId, date: new Date(), qrcode: data.image_qrcode_pix });
    insertLog({
      orcamentoId: item.orcamentoId,
      title: `[MOBILE] ${title} (orcamentoId: ${item.orcamentoId} paymentId: ${item.paymentId})`,
      log: data,
    });
    return data;
  } catch (error) {
    const err = await errorValidation(error);
    console.log('ERROR: ', err.error.message);
    insertLog({
      orcamentoId: item.orcamentoId,
      title: `[MOBILE] [ERROR] ${title} (orcamentoId: ${item.orcamentoId} paymentId: ${item.paymentId})`,
      log: err.error.message,
    });
    return err.error.message;
  }
}

async function search({
  referencia,
  item,
  title,
}: {
  referencia: string;
  item: RegisterProps;
  title?: string;
}) {
  try {
    const { data } = await api.get(`/itau/get-qrcode-pix?pedido_referencia=${referencia}`);
    console.log('Consulta:', data);

    insertLog({
      orcamentoId: item.orcamentoId,
      title: `[MOBILE] ${title} (orcamentoId: ${item.orcamentoId} paymentId: ${item.paymentId})`,
      log: data,
    });

    return data;
  } catch (error) {
    const err = await errorValidation(error);
    console.error('[ERROR]:', err.error.message);
    // return err.error.message;

    insertLog({
      orcamentoId: item.orcamentoId,
      title: `[MOBILE] [ERROR] ${title} (orcamentoId: ${item.orcamentoId} paymentId: ${item.paymentId})`,
      log: err.error.message,
    });
  }
}
