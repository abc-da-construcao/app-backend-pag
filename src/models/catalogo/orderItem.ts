import db from '@/lib/mysql';
import { QueryTypes } from 'sequelize';

import { OrderItem } from '@/types/orders';

export async function getOrderItemById(id: number) {
  const result = await db.query(
    /*sql*/ `
            select 
              p.id,
              p.orcamento_id,
              p.referencia, 
              p.qtd, 
              p.caixa,
              p.de,
              p.preco_desconto,
              p.preco_unitario, 
              p.total_desconto,
              p.preco as total
            from 
              pedidos_produtos p 
            where 1=1
              and p.orcamento_id = 1068087 
            order by p.id desc `,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return (result ? result[0] : null) as OrderItem;
}

export async function getItemsByOrder(id: number) {
  const result = await db.query(
    /*sql*/ `
            select 
              p.id,
              p.orcamento_id,
              p.referencia, 
              pro.DescricaoLonga as nome_original,
              pro.nome_amigavel,
              p.qtd, 
              p.caixa,
              p.de,
              p.preco_desconto,
              p.preco_unitario, 
              p.total_desconto,
              p.preco as total
            from 
              pedidos_produtos p 
              left join produtos pro on pro.Referencia = p.referencia
            where 1=1
              and p.orcamento_id = ? 
            order by p.id desc`,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return result as OrderItem[];
}

export async function getItemsCustomByOrder(id: number) {
  const result = await db.query(
    /*sql*/ `
            select 
              p.referencia, 
              if(pro.nome_amigavel is not null, pro.nome_amigavel, pro.DescricaoLonga) as name,
              p.qtd as quantity, 
              p.preco as unit_amount
            from 
              pedidos_produtos p 
              left join produtos pro on pro.Referencia = p.referencia
            where 1=1
              and p.orcamento_id = ? 
            order by p.id desc`,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return result as OrderItem[];
}
