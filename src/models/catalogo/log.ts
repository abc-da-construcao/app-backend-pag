import db from '@/lib/mysql';
import { QueryTypes } from 'sequelize';

import { InsertLogProps } from '@/types/log';

export async function insertLog({
  orcamentoId,
  title = null,
  log = null,
  pedidoMu = null,
  userId = 1,
}: InsertLogProps) {
  const result = await db.query(
    /*sql*/ `INSERT INTO 
                log_pedidos_mirouniverso (orcamentoId, error, retorno, numero_mu, user_id ) 
            VALUES (?, ?, ?, ?, ?)`,

    { replacements: [orcamentoId, title, JSON.stringify(log), pedidoMu, userId] }
  );

  return result;
}
