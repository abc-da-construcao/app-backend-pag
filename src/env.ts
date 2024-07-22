import { z } from 'zod';

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_DATABASE: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),

  DB_PRODUTOS_HOST: z.string(),
  DB_PRODUTOS_DATABASE: z.string(),
  DB_PRODUTOS_USERNAME: z.string(),
  DB_PRODUTOS_PASSWORD: z.string(),

  SF_LOGIN_URL: z.string(),
  SF_USERNAME: z.string(),
  SF_PASSWORD: z.string(),
  SF_TOKEN: z.string(),

  HOST_API_PAGAMENTO: z.any(),
  TOKEN_API_PAGAMENTO: z.string(),

  HOST_API_PAGSEGURO: z.any(),
  TOKEN_API_PAGSEGURO: z.string(),
});

export const env = envSchema.parse(process.env);
