import { Injectable } from '@angular/core';
import { EntradaHistorico } from '../../shared/models/historico.model';

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private KEY = 'previne_homem_historico';

  get entradas(): EntradaHistorico[] {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch {
      return [];
    }
  }

  registrar(entrada: Omit<EntradaHistorico, 'data'>) {
    const historico = this.entradas;
    historico.unshift({ ...entrada, data: new Date().toISOString() });
    localStorage.setItem(this.KEY, JSON.stringify(historico));
  }

  /** Agrupa entradas por data (dd/mm/aaaa) */
  porData(): { data: string; entradas: EntradaHistorico[] }[] {
    const grupos: Record<string, EntradaHistorico[]> = {};
    for (const e of this.entradas) {
      const chave = new Date(e.data).toLocaleDateString('pt-BR');
      grupos[chave] = grupos[chave] || [];
      grupos[chave].push(e);
    }
    return Object.entries(grupos).map(([data, entradas]) => ({ data, entradas }));
  }
}
