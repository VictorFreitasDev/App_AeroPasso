import axios from 'axios';

import { JSONBinResponse, RotaJson } from '../models/RotasJson';
import { URL, API_KEY } from '../../constants/Config';

export const getRotas = async (): Promise<RotaJson[]> => {
  try {
    console.log('Buscando rotas na API do JSONBin...');

    const response = await axios.get<JSONBinResponse>(URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    console.log('Resposta completa:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.record) {
      throw new Error('Resposta inválida da API');
    }

    const recordData: any = response.data.record;

    // Suporta tanto se o JSON no JSONBin tiver { record: [...] } quanto [...] direto
    const lista: RotaJson[] = Array.isArray(recordData)
      ? recordData
      : recordData.record || [];

    return lista;
  } catch (error: any) {
    console.log('ERRO DETALHADO:', error.response?.data || error.message);
    throw new Error('Erro ao buscar rotas na API');
  }
};


