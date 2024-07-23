import db from '@/lib/mysql';
import { QueryTypes } from 'sequelize';

import { OrderProps } from '@/types/orders';

export async function getOrderByClientId(id: number) {
  const result = await db.query(
    /*sql*/ `select 
              p.id,
              p.orçamento_id as orcamento_id,
              p.tipo_pagamento, 
              tp.name,
              f.filial as codigo_filial,
	            f.nome as  nome_filial,
              p.status as id_status,
              s.status as nome_status,
              -- cliente
              c.nome as nome_cliente,
              c.documento as documento_cliente,
              c.email as email_cliente,
              c.telefone as telefone_cliente,
              c.celular as celular_cliente,
              p.transportadora,
              p.valor,
              p.valor_frete,
              p.valor_carrinho_sem_desconto,
              p.desconto,
              p.created_at 
            from 
              pedidos p 
              inner join tipo_pagamento tp on tp.id  = p.tipo_pagamento 
              inner join status s on s.id  = p.status 
              inner join users u on u.id = p.users_id 
	            inner join filiais f on f.id  = u.filial_id 
              inner join clientes c on c.id = p.cliente_id 
            where 1=1
              and p.cliente_id = ? 
              -- and p.orçamento_id in(	
              --   select 
              --     p.orcamento_id
              --   from 
              --     pagamento_loja p 
              --     inner join forma_pagamento_generico f on f.oid_tipo = p.tipo_id 
              --   where 1=1 
              --   and f.variavel = 'Link Pay'
              -- ) 
              and p.pedidos_mu is null 
              and p.status in(14)
              order by created_at desc
              limit 50
            `,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return result;
}

export async function getOrderById(id: number) {
  const result = await db.query(
    /*sql*/ `select 
              p.id,
              p.orçamento_id as orcamento_id,
              p.tipo_pagamento, 
              tp.name,
              f.filial as codigo_filial,
	            f.nome as  nome_filial,
              p.status as id_status,
              s.status as nome_status,
              -- cliente
              c.id as id_cliente,
              c.nome as nome_cliente,
              c.documento as documento_cliente,
              c.email as email_cliente,
              c.telefone as telefone_cliente,
              c.nasc as nasc_cliente,
              c.celular as celular_cliente,
              c.pessoa as pessoa_cliente,
              
              
              p.transportadora,
              p.valor,
              p.valor_frete,
              p.valor_carrinho_sem_desconto,
              p.desconto,
              p.created_at 
            from 
              pedidos p 
              inner join tipo_pagamento tp on tp.id  = p.tipo_pagamento 
              inner join status s on s.id  = p.status 
              inner join users u on u.id = p.users_id 
	            inner join filiais f on f.id  = u.filial_id 
              inner join clientes c on c.id = p.cliente_id 
            where 1=1
              and p.orçamento_id = ? 
              and p.pedidos_mu is null 
              and p.status in(14)
              order by created_at desc
            limit 1
            `,
    {
      type: QueryTypes.SELECT,
      replacements: [id],
    }
  );

  return (result ? result[0] : null) as OrderProps;
}

export async function getOrderByClientIdAndOrderId(id: number, orderId: number) {
  const result = await db.query(
    /*sql*/ `select 
              p.id,
              p.orçamento_id as orcamento_id,
              p.tipo_pagamento, 
              tp.name,
              p.status as id_status,
              s.status as nome_status,
              p.transportadora,
              p.valor,
              p.valor_frete,
              p.valor_carrinho_sem_desconto,
              p.desconto,
              p.created_at 
            from 
              pedidos p 
              inner join tipo_pagamento tp on tp.id  = p.tipo_pagamento 
              inner join status s on s.id  = p.status 
            where 1=1
              and p.cliente_id = ? 
              and p.orçamento_id = ?
              and p.pedidos_mu is null 
              and p.status in(14)
              order by created_at desc
            `,
    {
      type: QueryTypes.SELECT,
      replacements: [id, orderId],
    }
  );

  return (result ? result[0] : null) as OrderProps;
}

export async function addOrder(email: string) {
  const [results, metadata]: any = await db.query(
    /*sql*/ `INSERT INTO orders (customer_email) VALUES (?);
  `,
    { replacements: [email] }
  );

  return results;
}

export async function updateOrder(id: number, total: number): Promise<any> {
  const result = await db.query(
    /*sql*/ `UPDATE orders SET total = ? WHERE id = ?;
`,
    { replacements: [total, id] }
  );

  return result;
}
