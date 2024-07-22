// import { FastifyInstance } from 'fastify';

// import { getProducts, getCountProducts, getProductById } from '@/models/salesforce/products';

// export default async function productRoute(app: FastifyInstance) {
//   app.get('/', async (request, reply) => {
//     const { page = 1, limit = 10 } = <{ page: number; limit: number }>request.query;

//     const qtd = await getCountProducts();
//     const products = await getProducts({ page, limit });

//     const totalRecords = qtd ? qtd.total : 0;
//     const totalPages = Math.ceil(totalRecords / limit);

//     return reply.status(200).send({
//       data: products,
//       pagination: {
//         page: page,
//         limit: limit,
//         totalPages: totalPages,
//         totalRecords: totalRecords,
//       },
//     });
//   });
//   app.get('/:id', async (request, reply) => {
//     const { id } = <any>request.params;

//     const product = await getProductById(id);

//     return reply.status(200).send(product);
//   });
// }
