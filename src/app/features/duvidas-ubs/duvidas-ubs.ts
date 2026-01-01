import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';

@Component({
  standalone: true,
  selector: 'app-duvidas-ubs',
  imports: [CommonModule, RouterModule, FormsModule, ChicoAvatarComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar
      frase="Não espere piorar. A UBS tá aí pra te ajudar."
    ></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Dúvidas e UBS
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4 text-sm">

      <h2 class="font-semibold text-blue-800">
        Quando procurar a UBS?
      </h2>

      <ul class="list-disc pl-5 space-y-1">
        <li>Dor no peito ou falta de ar.</li>
        <li>Feridas que não melhoram.</li>
        <li>Alterações persistentes na região íntima.</li>
        <li>Perda de peso sem motivo claro.</li>
        <li>Dores fortes ou contínuas.</li>
      </ul>

      <div>
        <label class="block mb-1">Nome da sua UBS ou cidade (opcional)</label>
        <input type="text"
          [(ngModel)]="ubs"
          class="w-full p-2 border rounded"
          placeholder="Ex: UBS Centro – Fortaleza">
      </div>

      <button (click)="salvar()" class="w-full bg-blue-700 text-white p-3 rounded-xl">
        Salvar
      </button>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar ao menu
      </a>
    </div>
  </div>
  `
})
export class DuvidasUbsComponent {

  ubs = localStorage.getItem('ubs_nome') || '';

  salvar() {
    localStorage.setItem('ubs_nome', this.ubs);
    alert('Informação salva com sucesso!');
  }
}