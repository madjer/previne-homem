import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GamificationService } from '../../core/services/gamification';

interface Recompensa {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  custo: number;
  tipo: 'institucional' | 'parceria' | 'simbolico';
  corBg: string;
  corIcone: string;
  resgatada?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-lojinha',
  imports: [CommonModule, RouterModule],
  templateUrl: './lojinha.html',
})
export class LojinhaComponent implements OnInit {

  pontos = 0;
  mensagem = '';
  mensagemTipo: 'sucesso' | 'erro' = 'sucesso';

  recompensas: Recompensa[] = [
    {
      id: 'prioridade_ubs',
      titulo: 'Prioridade na consulta',
      descricao: 'Agendamento prioritário na sua UBS de referência',
      icone: '🏥',
      custo: 100,
      tipo: 'institucional',
      corBg: 'bg-blue-50',
      corIcone: 'text-blue-600',
    },
    {
      id: 'desconto_parceiro',
      titulo: 'Desconto em parceiros',
      descricao: 'Desconto em padarias e farmácias parceiras',
      icone: '🛒',
      custo: 80,
      tipo: 'parceria',
      corBg: 'bg-green-50',
      corIcone: 'text-green-600',
    },
    {
      id: 'desconto_academia',
      titulo: 'Desconto em academia',
      descricao: 'Cupom de desconto em academias parceiras',
      icone: '💪',
      custo: 120,
      tipo: 'parceria',
      corBg: 'bg-orange-50',
      corIcone: 'text-orange-600',
    },
    {
      id: 'vale_alimentacao',
      titulo: 'Vale-alimentação saudável',
      descricao: 'Vale para mercado parceiro — produtos saudáveis',
      icone: '🥗',
      custo: 150,
      tipo: 'parceria',
      corBg: 'bg-emerald-50',
      corIcone: 'text-emerald-600',
    },
    {
      id: 'certificado',
      titulo: 'Certificado de Saúde',
      descricao: 'Certificado digital de compromisso com a sua saúde',
      icone: '🎓',
      custo: 200,
      tipo: 'simbolico',
      corBg: 'bg-purple-50',
      corIcone: 'text-purple-600',
    },
  ];

  constructor(private game: GamificationService) {}

  ngOnInit() {
    this.pontos = this.game.pontos;
    const resgatadas: string[] = JSON.parse(localStorage.getItem('lojinha_resgatadas') || '[]');
    for (const r of this.recompensas) {
      r.resgatada = resgatadas.includes(r.id);
    }
  }

  resgatar(r: Recompensa) {
    if (r.resgatada || this.pontos < r.custo) return;

    this.game.gastar(r.custo, r.titulo);
    this.pontos = this.game.pontos;
    r.resgatada = true;

    const resgatadas: string[] = JSON.parse(localStorage.getItem('lojinha_resgatadas') || '[]');
    resgatadas.push(r.id);
    localStorage.setItem('lojinha_resgatadas', JSON.stringify(resgatadas));

    this.mensagem = `"${r.titulo}" resgatado! A UBS ou parceiro será notificado.`;
    this.mensagemTipo = 'sucesso';
    setTimeout(() => { this.mensagem = ''; }, 4000);
  }

  podeComprar(custo: number): boolean {
    return this.pontos >= custo;
  }

  labelTipo(tipo: string): string {
    if (tipo === 'institucional') return 'UBS';
    if (tipo === 'parceria') return 'Parceiro';
    return 'Simbólico';
  }
}
