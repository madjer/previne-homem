import { Injectable } from '@angular/core';
import { HistoricoService } from './historico.service';

@Injectable({ providedIn: 'root' })
export class GamificationService {

  private KEY = 'previne_homem_pontos';

  constructor(private historico: HistoricoService) {}

  get pontos(): number {
    return Number(localStorage.getItem(this.KEY) || 0);
  }

  add(valor: number, descricao: string) {
    const total = this.pontos + valor;
    localStorage.setItem(this.KEY, String(total));
    this.historico.registrar({ tipo: 'habito', descricao, pontos: valor });
  }

  gastar(valor: number, descricao: string) {
    const total = Math.max(0, this.pontos - valor);
    localStorage.setItem(this.KEY, String(total));
    this.historico.registrar({ tipo: 'habito', descricao: `Resgate: ${descricao}`, pontos: -valor });
  }
}
