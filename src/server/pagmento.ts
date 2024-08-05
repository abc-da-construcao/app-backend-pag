import axios from 'axios';
import { env } from '@/env';

// console.log('HOST: ', process.env.HOST_API_PAGAMENTO);
// console.log('TOKEN: ', env.TOKEN_API_PAGAMENTO);
export const apiPagamento = axios.create({
  baseURL: env.HOST_API_PAGAMENTO,
  headers: {
    'Content-Type': 'application/json',
    Token: env.TOKEN_API_PAGAMENTO,
  },
});
