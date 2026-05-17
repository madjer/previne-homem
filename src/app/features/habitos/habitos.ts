import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamificationService } from '../../core/services/gamification';

interface Desafio {
  label: string;
  pontos: number;
  concluido: boolean;
  categoria: string;
}

interface InfoHabito {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  corBg: string;
  corBorda: string;
  sabiaQue: string;
  dicas: string[];
  lembre: string;
  aberto: boolean;
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
    { label: 'Caminhar por 15 minutos',      pontos: 20, concluido: false, categoria: 'movimento' },
    { label: 'Beber 2L de água',              pontos: 15, concluido: false, categoria: 'alimentacao' },
    { label: 'Dormir pelo menos 7h',          pontos: 15, concluido: false, categoria: 'sono' },
    { label: 'Evitar bebida alcoólica hoje',  pontos: 25, concluido: false, categoria: 'alcool' },
    { label: 'Não fumar hoje',                pontos: 30, concluido: false, categoria: 'tabaco' },
  ];

  infoHabitos: InfoHabito[] = [
    {
      id: 'tabagismo',
      titulo: 'Tabagismo (Fumar)',
      icone: '🚬',
      cor: 'text-gray-700',
      corBg: 'bg-gray-50',
      corBorda: 'border-gray-300',
      sabiaQue: 'O cigarro é responsável por mais de 40 tipos de câncer e é um dos principais fatores para infarto, AVC e doenças pulmonares. Parar é possível e há apoio gratuito no SUS.',
      dicas: [
        'Em 20 minutos após parar: pressão arterial normaliza',
        'Em 24 horas: risco de infarto já começa a cair',
        'Em 1 ano: risco de doença coronariana cai pela metade',
        'Em 10 anos: risco de câncer de pulmão reduz 50%',
        'Procure o posto: existe programa gratuito para parar de fumar',
        'Há medicamentos disponíveis pelo SUS que diminuem a vontade de fumar',
        'Identifique seus gatilhos (estresse, café, álcool) e planeje alternativas',
      ],
      lembre: 'Cada cigarro que você não fuma é um presente para o seu coração, seus pulmões e sua família.',
      aberto: false,
    },
    {
      id: 'alcool',
      titulo: 'Uso Abusivo de Álcool',
      icone: '🍺',
      cor: 'text-amber-700',
      corBg: 'bg-amber-50',
      corBorda: 'border-amber-200',
      sabiaQue: 'O álcool em excesso causa doenças no fígado, coração, pâncreas, aumenta o risco de câncer, prejudica a saúde mental e está associado a acidentes e violência.',
      dicas: [
        'Consumo de baixo risco: máximo 2 doses/dia para homens',
        'Pelo menos 2 dias por semana sem beber',
        '1 dose = 1 lata de cerveja (350ml) ou 1 taça de vinho (150ml) ou 1 dose de destilado (50ml)',
        'Beber para lidar com problemas emocionais é sinal de alerta',
        'Converse com o profissional da sua UBS — há tratamento disponível no SUS',
        'O CAPS oferece apoio especializado gratuito',
      ],
      lembre: 'Pedir ajuda para parar de beber é um dos atos mais corajosos que um homem pode ter.',
      aberto: false,
    },
    {
      id: 'sedentarismo',
      titulo: 'Sedentarismo',
      icone: '🏃',
      cor: 'text-blue-500',
      corBg: 'bg-blue-50',
      corBorda: 'border-blue-100',
      sabiaQue: 'A falta de atividade física é um dos maiores riscos à saúde, comparável ao tabagismo. Movimentar o corpo previne diabetes, hipertensão, obesidade, depressão e muito mais.',
      dicas: [
        'OMS recomenda: 150 min de atividade moderada por semana',
        'Ou 75 minutos de atividade intensa por semana',
        'Exemplos moderados: caminhada rápida, ciclismo, natação',
        'Exemplos intensos: corrida, futebol, musculação',
        'Comece com 10 a 15 minutos por dia e aumente aos poucos',
        'Prefira escadas ao elevador; vá a pé quando possível',
        'Consulte o médico antes de iniciar se tiver doenças crônicas',
      ],
      lembre: 'Não precisa de academia. Uma caminhada por dia já muda sua saúde.',
      aberto: false,
    },
  ];

  constructor(private game: GamificationService) {
    this.pontos = this.game.pontos;
  }

  toggleInfo(info: InfoHabito) {
    info.aberto = !info.aberto;
  }

  concluir(desafio: Desafio) {
    if (desafio.concluido) return;
    desafio.concluido = true;
    this.game.add(desafio.pontos, desafio.label);
    this.pontos = this.game.pontos;
    this.successMessage = `+${desafio.pontos} pontos! "${desafio.label}" concluído!`;
    setTimeout(() => { this.successMessage = ''; }, 2500);
  }
}
