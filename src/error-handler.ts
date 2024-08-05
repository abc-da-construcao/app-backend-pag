import { FastifyInstance } from 'fastify';
import axios, { AxiosError } from 'axios';

import { ZodError } from 'zod';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (axios.isAxiosError(error)) {
    // Handle Axios error
    console.error('Axios error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      return reply.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
    }

    return reply.status(500).send({ message: error.message });
  } else {
    // Handle other errors
    console.error('Erro inesperado:', error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Erro durante a validação',
        errors: error.flatten().fieldErrors,
      });
    }

    console.error('Erro ao executar consulta:', error);
  }

  return reply.status(500).send({ message: 'Ocorreu um erro ao executar a consulta.' });
};

export async function errorValidation(error: any) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      return { error: { status: error.response.status, message: error.response.data } };
    } else if (error.request) {
      console.error('Request:', error.request);
      return { error: { status: 500, message: error.request } };
    } else {
      console.error('Error:', error.message);
      return { error: { status: 500, message: error.message } };
    }
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);

    return { error: { status: 500, message: error ?? 'Ocorreu um erro!' } };
  }
}
