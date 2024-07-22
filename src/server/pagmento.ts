import axios from 'axios';
import { env } from '@/env';

export const api = axios.create({
  baseURL: env.HOST_API_PAGAMENTO,
  headers: {
    'Content-Type': 'application/json',
    Token: env.TOKEN_API_PAGAMENTO,
  },
});
