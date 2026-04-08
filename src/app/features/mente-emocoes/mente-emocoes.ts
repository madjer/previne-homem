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
    { tag: 'Estresse', titulo: 'Como lidar com a pressão do dia a dia', tempo: '5 min de leitura' },
    { tag: 'Sono',     titulo: 'Dicas para melhorar a qualidade do sono', tempo: '4 min de leitura' },
  ];

  selecionar(valor: string) {
    this.humorSelecionado = valor;
  }
}
