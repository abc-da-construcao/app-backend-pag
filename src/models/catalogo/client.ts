import db from '@/lib/mysql';
import { QueryTypes } from 'sequelize';

export async function getClientById(id: number) {
  const result = await db.query(
    /*sql*/ `select 
                * 
            from 
                clientes 
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
