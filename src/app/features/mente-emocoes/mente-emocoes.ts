import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';

@Component({
  standalone: true,
  selector: 'app-mente-emocoes',
  imports: [CommonModule, RouterModule, FormsModule, ChicoAvatarComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar
      frase="Cuidar da mente é tão importante quanto cuidar do corpo."
    ></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Mente e Emoções
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4 text-sm">

      <p>
        Responda rápido. Pense nas últimas duas semanas.
      </p>

      <div *ngFor="let q of perguntas" class="flex items-center justify-between">
        <span class="w-3/4">{{ q.texto }}</span>
        <select [(ngModel)]="q.resposta" class="p-1 border rounded">
          <option value="">–</option>
          <option value="nao">Não</option>
          <option value="sim">Sim</option>
        </select>
      </div>

      <div *ngIf="mostrarAlerta" class="bg-yellow-100 p-3 rounded-lg text-yellow-800">
        Esses sinais indicam que sua mente pode estar sobrecarregada.
        Conversar com alguém de confiança ou procurar a UBS pode ajudar bastante.
      </div>

      <button (click)="avaliar()" class="w-full bg-blue-700 text-white p-3 rounded-xl">
        Ver orientação
      </button>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold mt-2">
        Voltar ao menu
      </a>
    </div>
  </div>
  `
})
export class MenteEmocoesComponent {

  mostrarAlerta = false;

  perguntas = [
    { texto: 'Você tem se sentido muito desanimado?', resposta: '' },
    { texto: 'Você tem dormido mal?', resposta: '' },
    { texto: 'Você tem se sentido muito irritado?', resposta: '' }
  ];

  avaliar() {
    const positivos = this.perguntas.filter(p => p.resposta === 'sim').length;
    this.mostrarAlerta = positivos >= 2;
  }
}
