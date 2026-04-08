export interface EntradaHistorico {
  tipo: 'checkup' | 'habito';
  data: string; // ISO string
  descricao: string;
  pontos: number;
  riscos?: { titulo: string; nivel: 'red' | 'yellow' | 'green' }[];
}
