import { Injectable } from '@angular/core';
import { Checkup } from '../../shared/models/checkup.model';

@Injectable({ providedIn: 'root' })
export class CheckupService {
  private KEY = 'ultimoCheckup';

  salvar(checkup: Checkup) {
    localStorage.setItem(this.KEY, JSON.stringify(checkup));
  }

  obter(): Checkup | null {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }
}
