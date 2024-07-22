import { FastifyInstance } from 'fastify';

import { getProducts, getCountProducts } from '@/models/salesforce/products';

export default async function productRoute(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const {
      page = 1,
      limit = 10,
      category,
    } = <{ page: number; limit: number; category?: string }>request.query;

    const [qtd, products] = await Promise.all([
      getCountProducts(),
      getProducts({ page, limit, category }),
    ]);

    const totalRecords = Number(qtd);
    const totalPages = Math.ceil(totalRecords / limit);

    const newProducts = products.records.map((item: any) => {
      return {
        id: item.Id,
        referencia: item.Product2.Referencia__c,
        name: item.Name,
        friendlyName: item.Product2.NomeAmigavel__c,
        productId: item.Product2Id,
        listPrice: item.PrecoDe__c,
        offerPrice: item.UnitPrice,
        productCode: item.Product2.ProductCode,
        classCode: item.Product2.ClassCode__c,
        classLevel: item.Product2.ClasseNivel1__c,
        availability: item.Product2.Disponibilidade__c,
        supplier: item.Product2.Fornecedor__r.Name,
        thumbnail: item.Product2.ThumbnailList__c,
        unit: item.Product2.Unidade__c,
      };
    });

    return reply.status(200).send({
      pagination: {
        page: page,
        limit: limit,
        category,
        totalPages: totalPages,
        totalRecords: totalRecords,
      },
      data: newProducts,
    });
  });
}
