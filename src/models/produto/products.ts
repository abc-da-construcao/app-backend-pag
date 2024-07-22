import db from '@/lib/produtos';
import { QueryTypes } from 'sequelize';

export async function getProductsReferencias(refencias: any) {
  const result = await db.query(
    /*sql*/ `select 
              p.referencia,
              p.nome_original, 
              p.nome_amigavel,
              i.url,
              i.url_catalogo 
            from 
              produtos p 
              left join imagens i on i.referencia = p.referencia 
            where 1=1
              and p.referencia in(${refencias}) and i.position = 0`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return result;
}
