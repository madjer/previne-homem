import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PerfilService } from '../../core/services/perfil.service';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">
    <h1 class="text-xl font-bold text-blue-900 mb-4">Meu Perfil</h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-3">
      <input type="date" [(ngModel)]="perfil.dataNascimento" class="w-full p-2 border rounded">
      <input type="number" [(ngModel)]="perfil.peso" placeholder="Peso (kg)" class="w-full p-2 border rounded">
      <input type="number" [(ngModel)]="perfil.altura" placeholder="Altura (cm)" class="w-full p-2 border rounded">

      <button (click)="salvar()" class="w-full bg-blue-700 text-white p-3 rounded-xl">
        Salvar
      </button>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar
      </a>
    </div>
  </div>
  `
})
export class PerfilComponent {

  perfil: any = {};

  constructor(private service: PerfilService, private router: Router) {}

  async salvar() {
    await this.service.salvar(this.perfil);
    alert('Perfil salvo com sucesso!');
    this.router.navigate(['/']);
  }
}
