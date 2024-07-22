import comm from '@/lib/salesforce';
import { QueryTypes } from 'sequelize';

import { ResponseProductProps } from '@/types/products';
import { number } from 'zod';

type GetProdutcsProps = {
  page?: number;
  limit?: number;
  category?: string;
};

export async function getProducts({ page = 1, limit = 10, category }: GetProdutcsProps) {
  const offset = page * limit;
  let sqlCategory = '';
  if (category) {
    sqlCategory = `AND Product2.ClassCode__c LIKE '${category}'`;
  }

  const result = await comm.query(/*sql*/ `SELECT 
      Id, 
      Name, 
      PrecoDe__c,
      Product2.ProductCode, 
      Product2Id, 
      Product2.ClassCode__c,
      Product2.ClasseNivel1__c, 
      Product2.Disponibilidade__c,
      Product2.Fornecedor__r.Name, 
      Product2.NomeAmigavel__c, 
      Product2.Referencia__c,
      Product2.ThumbnailList__c, 
      Product2.Unidade__c, 
      UnitPrice
    FROM 
      PricebookEntry 
    WHERE
      IsActive = true 
      AND UnitPrice > 0
      AND Product2.Disponibilidade__c IN ('De Linha', 'Encomenda')
      ${sqlCategory}
    ORDER BY Name LIMIT ${limit} OFFSET ${offset}`);

  return result;
}

export async function getCountProducts() {
  const result = await comm.query(/*sql*/ `SELECT 
      COUNT(Id) total 
    FROM 
      PricebookEntry 
    WHERE 
    IsActive = true 
    AND UnitPrice > 0
    AND Product2.Disponibilidade__c IN ('De Linha', 'Encomenda')
    `);

  return (result ? result?.records[0]?.total : 0) as { total: number };
}
