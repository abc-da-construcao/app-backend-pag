import axios from 'axios';
import { env } from '@/env';

export const api = axios.create({
  baseURL: env.HOST_API_DUPLICATA,
  headers: {
    'Content-Type': 'application/json',
    client_id: env.CLIENTID_API_DUPLICATA,
    client_secret: env.CLIENTSECRET_API_DUPLICATA,
  },
});
