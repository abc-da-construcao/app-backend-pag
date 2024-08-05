import axios, { AxiosError } from 'axios';
import { pagseguro } from '@/server/pagseguro';
import { errorValidation } from '@/error-handler';
import { formatAmountPagSeguro } from '@/utls/currency';

type TokenCardProps = {
  number: string;
  month: string;
  year: string;
  securityCode: string;
  name?: string;
  taxId?: string;
};
export async function tokenCard({
  number,
  month,
  year,
  securityCode,
  name,
  taxId,
}: TokenCardProps) {
  try {
    const holder =
      name && taxId
        ? {
            name,
            tax_id: taxId,
          }
        : '';

    const card = {
      number,
      exp_month: month,
      exp_year: year,
      security_code: securityCode,
      holder,
    };
    const { data } = await pagseguro.post('/tokens/cards', card);

    return data;
  } catch (error) {
    return await errorValidation(error);
  }
}

type PhoneProps = {
  country?: string;
  area?: string;
  number: string;
  type?: string;
};
export function phone({ number, type = 'MOBILE' }: PhoneProps) {
  return {
    country: '55',
    area: number.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 2),
    number: number.replace(/[^a-zA-Z0-9 ]/g, '').slice(-9),
    type,
  };
}

type CustomerProps = {
  name: string;
  email: string;
  tax_id: string;
  phones: PhoneProps[];
};

export async function client({ name, email, tax_id, phones }: CustomerProps) {
  return {
    name,
    email,
    tax_id: tax_id.replace(/[^a-zA-Z0-9 ]/g, ''),
    phones,
  };
}

type addressProps = {
  street: string;
  number: string;
  complement: string;
  locality: string;
  city: string;
  region_code: string;
  country?: string;
  postal_code: string;
};
export async function address({
  street,
  number,
  complement,
  locality,
  city,
  region_code,
  country = 'BRA',
  postal_code,
}: addressProps) {
  return {
    address: {
      street,
      number,
      complement,
      locality,
      city,
      region_code: region_code.toUpperCase(),
      country,
      postal_code: postal_code.replace(/\D/g, ''),
    },
  };
}

export async function itemsFormat(items: any) {
  return items.map((item: any) => ({
    reference_id: item.referencia,
    name: item.nome_amigavel ? item.nome_amigavel : item.nome_original,
    quantity: String(item.qtd).replace(/[^a-zA-Z0-9 ]/g, ''),
    unit_amount: formatAmountPagSeguro(item.total),
  }));
}
