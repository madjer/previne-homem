import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
import { Checkup } from '../../shared/models/checkup.model';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';

@Component({
  standalone: true,
  selector: 'app-resultado-checkup',
  imports: [CommonModule, RouterModule, ChicoAvatarComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar [frase]="fraseChico"></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Resultado do seu Check-up
    </h1>

    <div class="space-y-3">
      <div *ngFor="let item of resultados"
           class="p-3 rounded-xl shadow text-white"
           [ngClass]="item.cor">
        {{ item.texto }}
      </div>
    </div>

    <a routerLink="/" class="block text-center mt-6 text-blue-700 font-semibold">
      Voltar para o menu
    </a>

  </div>
  `
})
export class ResultadoCheckupComponent implements OnInit {

  fraseChico = '';
  resultados: any[] = [];

  constructor(private service: CheckupService) {}

  ngOnInit() {
    const check = this.service.obter();
    if (!check) return;

    this.avaliar(check);
  }

  avaliar(c: Checkup) {

    if (c.fuma === 'todoDia') {
      this.resultados.push({ cor: 'bg-red-600', texto: 'Você fuma todos os dias. Isso merece atenção na UBS.' });
    } else if (c.fuma === 'asVezes') {
      this.resultados.push({ cor: 'bg-yellow-500', texto: 'Você fuma às vezes. Dá pra melhorar esse hábito.' });
    } else {
      this.resultados.push({ cor: 'bg-green-600', texto: 'Ótimo! Você não fuma.' });
    }

    if (c.alcool === 'todoDia' || c.alcool === 'quaseTodoDia') {
      this.resultados.push({ cor: 'bg-red-600', texto: 'O uso frequente de álcool pode prejudicar sua saúde.' });
    }

    this.fraseChico =
      this.resultados.some(r => r.cor === 'bg-red-600')
        ? 'Parceiro, vi aqui que você precisa dar mais atenção pra sua saúde.'
        : 'Muito bem! Você está cuidando direitinho da sua saúde.';
  }
}
