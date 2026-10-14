// ==================================================
// MODEL — ROTA INDOOR
// ==================================================
// Representa uma rota de deslocamento cadastrada
// dentro de um aeroporto (navegação indoor).
// ==================================================

export type ModoDeslocamento = "A pé" | "Esteira Rolante" | "Carrinho de Apoio";

export interface RotaIndoorModel {
  /** Identificador único da rota (timestamp em string) */
  id: string;

  /** Nome descritivo da rota. Ex: "Check-in ao Portão 12" */
  nome: string;

  /** Terminal do aeroporto onde a rota ocorre. Ex: "Terminal 1" */
  terminal: string;

  /** Nome do ponto de origem dentro do terminal */
  origemNome: string;

  /** Nome do ponto de destino dentro do terminal */
  destinoNome: string;

  /** Modo de deslocamento escolhido pelo passageiro */
  modoDeslocamento: ModoDeslocamento | string;

  /** Distância estimada em metros entre origem e destino */
  distanciaMetros: number;

  /** Tempo estimado de deslocamento em minutos */
  tempoEstimadoMin: number;

  /** Data e hora de criação da rota (ISO 8601) */
  criadoEm?: string;

  /** Nome ou identificação de quem cadastrou a rota */
  criadoPor?: string;

  /** E-mail do usuário que cadastrou */
  usuarioEmail?: string;

  /** UID do usuário no Firebase */
  usuarioId?: string;

  /** Data e hora da última edição da rota (ISO 8601) */
  atualizadoEm?: string;
}

