import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface HumorOpcao {
  valor: string;
  label: string;
}

interface Conteudo {
  tag: string;
  titulo: string;
  tempo: string;
}

@Component({
  standalone: true,
  selector: 'app-mente-emocoes',
  imports: [CommonModule, RouterModule],
  templateUrl: './mente-emocoes.html',
})
export class MenteEmocoesComponent {

  humorSelecionado = 'neutro';

  opcoes: HumorOpcao[] = [
    { valor: 'mal',    label: 'Mal' },
    { valor: 'ruim',   label: 'Ruim' },
    { valor: 'neutro', label: 'Neutro' },
    { valor: 'bem',    label: 'Bem' },
    { valor: 'otimo',  label: 'Ótimo' },
  ];

  conteudos: Conteudo[] = [
    { tag: 'Ansiedade',  titulo: 'Preocupação excessiva, coração acelerado, tensão muscular, inquietação', tempo: '5 min de leitura' },
    { tag: 'Depressão',  titulo: 'Tristeza persistente, perda de interesse, cansaço sem causa, isolamento', tempo: '6 min de leitura' },
    { tag: 'Estresse',   titulo: 'Irritabilidade, dores de cabeça frequentes, sensação de esgotamento', tempo: '5 min de leitura' },
    { tag: 'Insônia',    titulo: 'Dificuldade para dormir, acordar várias vezes, não se sentir descansado', tempo: '4 min de leitura' },
  ];

  selecionar(valor: string) {
    this.humorSelecionado = valor;
  }
}
