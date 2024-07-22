import db from '@/lib/mysql';
import { QueryTypes } from 'sequelize';

import { AddressProps } from '@/types/address';

export async function getAddressById(id: number) {
  const result = await db.query(
    /*sql*/ `select 
                * 
            from 
                enderecos 
            where 1=1
                and id = ?
            `,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return (result ? result[0] : null) as any;
}

export async function getAddressByClientId(id: number) {
  const result = await db.query(
    /*sql*/ `select 
                  * 
              from 
                  enderecos 
              where 1=1
                  and clientes_id = ?
              `,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return (result ? result[0] : null) as any;
}

export async function getAddressByClientIdType(id: number, type: 'cobranca' | 'entrega') {
  const result = await db.query(
    /*sql*/ `select 
                  * 
              from 
                  enderecos 
              where 1=1
                  and clientes_id = ?
                  and tipo like CONCAT('%', ?, '%')
                  and principal = 1
              `,
    {
      type: QueryTypes.SELECT,
      replacements: [id, type],
    }
  );

  return (result ? result[0] : null) as AddressProps;
}
