import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamificationService } from '../../core/services/gamification';

interface Desafio {
  label: string;
  pontos: number;
  concluido: boolean;
}

@Component({
  standalone: true,
  selector: 'app-habitos',
  imports: [CommonModule, RouterModule],
  templateUrl: './habitos.html',
})
export class HabitosComponent {

  pontos = 0;
  successMessage = '';

  desafios: Desafio[] = [
    { label: 'Caminhar por 15 minutos',      pontos: 20, concluido: false },
    { label: 'Beber 2L de água',              pontos: 15, concluido: false },
    { label: 'Dormir pelo menos 7h',          pontos: 15, concluido: false },
    { label: 'Evitar bebida alcoólica hoje',  pontos: 25, concluido: false },
    { label: 'Não fumar hoje',                pontos: 30, concluido: false },
  ];

  constructor(private game: GamificationService) {
    this.pontos = this.game.pontos;
  }

  concluir(desafio: Desafio) {
    if (desafio.concluido) return;
    desafio.concluido = true;
    this.game.add(desafio.pontos);
    this.pontos = this.game.pontos;
    this.successMessage = `+${desafio.pontos} pontos! "${desafio.label}" concluído!`;
    setTimeout(() => { this.successMessage = ''; }, 2500);
  }
}
