import axios from 'axios';
import { env } from '@/env';

export const pagseguro = axios.create({
  baseURL: env.HOST_API_PAGSEGURO,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.TOKEN_API_PAGSEGURO}`,
  },
});
