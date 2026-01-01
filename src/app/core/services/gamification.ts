import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GamificationService {

  private KEY = 'previne_homem_pontos';

  get pontos(): number {
    return Number(localStorage.getItem(this.KEY) || 0);
  }

  add(valor: number) {
    const total = this.pontos + valor;
    localStorage.setItem(this.KEY, String(total));
  }
}
