import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SecaoPrevencao {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  corBg: string;
  corBorda: string;
  intro: string;
  itens: string[];
  alerta?: string;
  lembre: string;
  aberto: boolean;
}

@Component({
  standalone: true,
  selector: 'app-prevencao',
  imports: [CommonModule, RouterModule],
  templateUrl: './prevencao.html',
})
export class PrevencaoComponent {

  secoes: SecaoPrevencao[] = [
    {
      id: 'transito',
      titulo: 'No Trânsito',
      icone: '🚗',
      cor: 'text-blue-700',
      corBg: 'bg-blue-50',
      corBorda: 'border-blue-200',
      intro: 'Homens são responsáveis por 80% das mortes no trânsito. O álcool está envolvido em boa parte dessas mortes.',
      itens: [
        'Use sempre o cinto de segurança',
        'Nunca beba e dirija — tolerância zero para álcool ao volante',
        'Use capacete (moto) e respeite a velocidade',
        'Não use o celular ao dirigir',
      ],
      lembre: 'A maior coragem é saber evitar o perigo.',
      aberto: false,
    },
    {
      id: 'trabalho',
      titulo: 'No Trabalho',
      icone: '⚙️',
      cor: 'text-orange-700',
      corBg: 'bg-orange-50',
      corBorda: 'border-orange-200',
      intro: 'Homens morrem mais por acidentes de trabalho. A maioria poderia ser evitada com equipamentos de proteção.',
      itens: [
        'Use sempre os Equipamentos de Proteção Individual (EPI)',
        'Comunique condições inseguras ao responsável',
        'Não ignore sinais de cansaço extremo',
      ],
      lembre: 'Sua segurança vale mais do que qualquer prazo.',
      aberto: false,
    },
    {
      id: 'comunidade',
      titulo: 'Em Casa e na Comunidade',
      icone: '🏘️',
      cor: 'text-blue-700',
      corBg: 'bg-blue-50',
      corBorda: 'border-blue-200',
      intro: 'Homens são 4 vezes mais vítimas de assassinato do que mulheres no Brasil. Resolução de conflitos com diálogo salva vidas.',
      itens: [
        'Resolva conflitos com diálogo — violência gera violência',
        'Busque apoio em situações de risco (ameaças, pressão de grupo)',
        'Se você presenciar ou sofrer violência: procure a UBS, CRAS ou delegacia',
      ],
      alerta: 'Se estiver em situação de risco imediato, ligue 190 (Polícia) ou 192 (SAMU)',
      lembre: 'Pedir ajuda em situações de perigo é inteligência, não fraqueza.',
      aberto: false,
    },
    {
      id: 'ist',
      titulo: 'Prevenção de ISTs',
      icone: '🎗️',
      cor: 'text-purple-700',
      corBg: 'bg-purple-50',
      corBorda: 'border-purple-200',
      intro: 'As ISTs (HIV, sífilis, gonorreia, herpes, HPV, hepatite B e C) muitas vezes não dão sintomas, mas podem causar complicações graves.',
      itens: [
        'Use camisinha em todas as relações sexuais',
        'Faça o teste de HIV e sífilis gratuitamente na UBS',
        'Vacine-se contra HPV e hepatite B (SUS)',
        'PrEP: previne o HIV — disponível gratuitamente no SUS',
        'PEP: após situação de risco, inicie em até 72 horas nas UBS/UPA',
      ],
      lembre: 'A UBS está de portas abertas. Sem julgamento.',
      aberto: false,
    },
  ];

  toggle(secao: SecaoPrevencao) {
    secao.aberto = !secao.aberto;
  }
}
