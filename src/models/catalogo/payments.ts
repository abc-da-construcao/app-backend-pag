import db from '@/lib/mysql';
import { QueryTypes } from 'sequelize';

import { OrderProps } from '@/types/orders';
import { PaymentProps } from '@/types/payments';

export async function getPaymentByOrderId(id: number) {
  return await db.query(
    /*sql*/ `select 
                p.id,
                p.orcamento_id,
                p.forma_id,
                p.tipo_id,
                f.nome,
                f.variavel, 
                p.parcela,
                p.nome_tipo,
                p.valor,
                p.image_qrcode_pix,
                p.emv,
                p.status,
                p.data,
                p.data_pix,
                p.data_pagamento_pix,
                p.created_at,
                p.updated_at,
                p.nsu,
                p.tid
            from 
                pagamento_loja p 
                inner join forma_pagamento_generico f on f.oid_tipo = p.tipo_id 
            where 1=1 
                and p.orcamento_id = ?
                -- and f.variavel = 'Link Pay'
                order by p.id desc
            `,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );
}

export async function getPaymentByOrderIdAndPaymentId(orcamentoId: number, paymentId: number) {
  const result = await db.query(
    /*sql*/ `select 
                p.id,
                p.orcamento_id,
                p.forma_id,
                p.tipo_id,
                f.nome,
                f.variavel, 
                p.parcela,
                p.nome_tipo,
                p.valor,
                p.image_qrcode_pix,
                p.emv,
                p.status,
                p.data,
                p.data_pix,
                p.link_boleto,
                p.boleto_tentativa,
                p.created_at,
                p.updated_at,
                p.nsu,
                p.tid
            from 
                pagamento_loja p 
                inner join forma_pagamento_generico f on f.oid_tipo = p.tipo_id 
            where 1=1 
                and p.orcamento_id = ?
                and p.id = ?
                -- and f.variavel = 'Link Pay'
                order by p.id desc
            `,
    {
      type: QueryTypes.SELECT,
      replacements: [orcamentoId, paymentId],
    }
  );

  return (result ? result[0] : null) as PaymentProps;
}

export async function updateDataPixPayment({
  id,
  date,
  qrcode = null,
}: {
  id: number;
  date: any;
  qrcode?: string | null;
}): Promise<any> {
  const result = await db.query(
    /*sql*/ `UPDATE pagamento_loja SET data_pix = ?, image_qrcode_pix = ? WHERE id = ?;
`,
    { replacements: [date, qrcode, id] }
  );

  return result;
}

export async function updateDataBolecodePayment({
  id,
  date,
  link,
  tentativa = null,
}: {
  id: number;
  date: any;
  link: string;
  tentativa?: number | null;
}): Promise<any> {
  const result = await db.query(
    /*sql*/ `UPDATE pagamento_loja SET data_boleto = ?, link_boleto = ?, boleto_tentativa = ? WHERE id = ?;
`,
    { replacements: [date, link, tentativa, id] }
  );

  return result;
}
