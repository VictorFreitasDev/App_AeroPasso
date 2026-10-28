// ==================================================
// MODEL — ROTAS JSON (JSONBin.io)
// ==================================================
// Representa as rotas indoor do aeroporto (AeroPasso)
// para consumo e persistência via API do JSONBin.io.
// ==================================================

export interface RotaJson {
  /** Identificador único sequencial da rota (1, 2, 3...) */
  id: string | number;

  /** Nome descritivo da rota. Ex: "Check-in Balcão A aos Portões 1 a 5" */
  nome: string;

  /** Terminal do aeroporto onde a rota ocorre. Ex: "Terminal 1" */
  terminal: string;

  /** Nome do ponto de partida dentro do terminal */
  origemNome: string;

  /** Nome do ponto de destino dentro do terminal */
  destinoNome: string;

  /** Modo de deslocamento: "A pé" | "Esteira Rolante" | "Carrinho de Apoio" */
  modoDeslocamento: string;

  /** Distância total estimada em metros */
  distanciaMetros: number;

  /** Tempo estimado de deslocamento em minutos */
  tempoEstimadoMin: number;

  /** URL da imagem representativa do local/rota no aeroporto */
  imagem: string;

  /** Data e hora de criação da rota (ISO 8601) */
  criadoEm?: string;

  /** Nome de quem cadastrou a rota */
  criadoPor?: string;

  /** E-mail do usuário que cadastrou */
  usuarioEmail?: string;

  /** UID do usuário */
  usuarioId?: string;

  /** Data e hora da última alteração (ISO 8601) */
  atualizadoEm?: string;
}

// ==================================================
// RESPOSTA DO JSONBIN.IO (Padrão de API)
// ==================================================
export interface JSONBinResponse {
  record: {
    record: RotaJson[];
    [key: string]: any;
  };
  metadata?: {
    id?: string;
    private?: boolean;
    createdAt?: string;
  };
}


// Aliases para compatibilidade com o app
export type Servicos = RotaJson;
export type RotaIndoor = RotaJson;
export type Rotas = RotaJson;

