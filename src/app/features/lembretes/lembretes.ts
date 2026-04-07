import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Lembrete {
  texto: string;
  horario: string;
  ativo: boolean;
}

@Component({
  standalone: true,
  selector: 'app-lembretes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lembretes.html',
})
export class LembretesComponent {

  novoTexto = '';
  novoHorario = '';
  successMessage = '';

  lembretes: Lembrete[] = [
    { texto: 'Tomar remédio da pressão', horario: '08:00', ativo: true },
    { texto: 'Medir pressão arterial',   horario: '18:00', ativo: true },
    { texto: 'Beber água',               horario: '12:00', ativo: false },
  ];

  adicionar() {
    if (!this.novoTexto.trim()) return;
    this.lembretes.push({ texto: this.novoTexto.trim(), horario: this.novoHorario, ativo: true });
    this.novoTexto = '';
    this.novoHorario = '';
    this.successMessage = 'Lembrete adicionado!';
    setTimeout(() => { this.successMessage = ''; }, 2000);
  }

  remover(i: number) {
    this.lembretes.splice(i, 1);
  }
}
