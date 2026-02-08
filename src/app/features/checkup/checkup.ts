import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
import { Checkup } from '../../shared/models/checkup.model';

@Component({
  standalone: true,
  selector: 'app-checkup',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">
    <h1 class="text-xl font-bold text-blue-900 mb-4">
      Meu Check-up
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4">

      <label>Você sabe como está sua pressão?</label>
      <select [(ngModel)]="model.pressaoStatus" class="w-full p-2 border rounded">
        <option value="">Selecione</option>
        <option value="normal">Normal</option>
        <option value="alta">Alta</option>
        <option value="naoLembro">Não lembro</option>
      </select>

      <label>Você fuma?</label>
      <select [(ngModel)]="model.fuma" class="w-full p-2 border rounded">
        <option value="nao">Não</option>
        <option value="asVezes">Às vezes</option>
        <option value="todoDia">Todo dia</option>
      </select>

      <label>Você bebe álcool?</label>
      <select [(ngModel)]="model.alcool" class="w-full p-2 border rounded">
        <option value="nao">Não</option>
        <option value="asVezes">Às vezes</option>
        <option value="quaseTodoDia">Quase todo dia</option>
        <option value="todoDia">Todo dia</option>
      </select>

      <button (click)="salvar()" class="w-full bg-blue-700 text-white p-3 rounded-xl">
        Ver resultado
      </button>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar ao menu
      </a>
    </div>
  </div>
  `
})
export class CheckupComponent {

  model: Checkup = {
    pressaoConhece: null,
    diabetes: 'naoSei',
    fuma: 'nao',
    alcool: 'nao',
    atividadeFisica: null,
    data: new Date()
  };

  constructor(
    private service: CheckupService,
    private router: Router
  ) {}

  salvar() {
    this.service.salvar(this.model);
    this.router.navigateByUrl('/resultado-checkup');
  }
}
