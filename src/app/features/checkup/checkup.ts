import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
import { Checkup } from '../../shared/models/checkup.model';

interface Secao {
  titulo: string;
  subtitulo: string;
}

@Component({
  standalone: true,
  selector: 'app-checkup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkup.html',
})
export class CheckupComponent {

  secaoAtual = 1;
  totalSecoes = 5;

  secoes: Secao[] = [
    { titulo: 'Dados Básicos',      subtitulo: 'Informações gerais sobre você' },
    { titulo: 'Condições de Saúde', subtitulo: 'Doenças e condições conhecidas' },
    { titulo: 'Hábitos',            subtitulo: 'Tabagismo e consumo de álcool' },
    { titulo: 'Atividade Física',   subtitulo: 'Seu nível de movimento diário' },
    { titulo: 'Bem-estar Mental',   subtitulo: 'Como você tem se sentido' },
  ];

  model: Checkup = {
    pressaoConhece: null,
    pressaoAlta: 'naoSei',
    diabetes: 'naoSei',
    fuma: 'nao',
    alcool: 'nao',
    atividadeFisica: null,
    sedentario: 'naoSei',
    humor: 'neutro',
    peso: undefined,
    altura: undefined,
    data: new Date(),
  };

  get progresso() {
    return (this.secaoAtual / this.totalSecoes) * 100;
  }

  get secao() {
    return this.secoes[this.secaoAtual - 1];
  }

  constructor(private service: CheckupService, private router: Router) {}

  avancar() {
    if (this.secaoAtual < this.totalSecoes) {
      this.secaoAtual++;
    } else {
      this.salvar();
    }
  }

  voltar() {
    if (this.secaoAtual > 1) {
      this.secaoAtual--;
    } else {
      this.router.navigateByUrl('/');
    }
  }

  salvar() {
    this.model.data = new Date();
    this.service.salvar(this.model);
    this.router.navigateByUrl('/resultado-checkup');
  }
}
