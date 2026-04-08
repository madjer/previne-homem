import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
import { HistoricoService } from '../../core/services/historico.service';
import { GamificationService } from '../../core/services/gamification';
import { Checkup } from '../../shared/models/checkup.model';

interface Risco {
  titulo: string;
  descricao: string;
  badge: string;
  nivel: 'red' | 'yellow' | 'green';
}

@Component({
  standalone: true,
  selector: 'app-resultado-checkup',
  imports: [CommonModule, RouterModule],
  templateUrl: './resultado-checkup.html',
})
export class ResultadoCheckupComponent implements OnInit {

  riscos: Risco[] = [];

  constructor(
    private service: CheckupService,
    private historico: HistoricoService,
    private game: GamificationService,
  ) {}

  ngOnInit() {
    const check = this.service.obter();
    if (check) this.avaliar(check);
  }

  avaliar(c: Checkup) {
    if (c.pressaoAlta === 'sim') {
      this.riscos.push({
        titulo: 'Risco cardiovascular',
        descricao: 'Pressão alta detectada. Recomendamos agendar consulta na UBS para avaliação.',
        badge: 'Atenção prioritária',
        nivel: 'red',
      });
    } else {
      this.riscos.push({
        titulo: 'Risco cardiovascular',
        descricao: 'Nenhum alerta identificado. Continue monitorando sua pressão.',
        badge: 'Estável',
        nivel: 'green',
      });
    }

    const comportamentalRuim = c.fuma !== 'nao' || c.alcool === 'todoDia' || c.alcool === 'quaseTodoDia' || c.sedentario === 'sim';
    if (comportamentalRuim) {
      this.riscos.push({
        titulo: 'Risco comportamental',
        descricao: 'Sedentarismo ou uso de tabaco/álcool identificado. Experimente os desafios de hábitos saudáveis.',
        badge: 'Requer atenção',
        nivel: 'yellow',
      });
    } else {
      this.riscos.push({
        titulo: 'Risco comportamental',
        descricao: 'Seus hábitos estão no caminho certo. Continue assim!',
        badge: 'Estável',
        nivel: 'green',
      });
    }

    if (c.humor === 'mal' || c.humor === 'ruim') {
      this.riscos.push({
        titulo: 'Saúde mental',
        descricao: 'Sinais de sobrecarga emocional. Considere conversar com alguém na UBS.',
        badge: 'Requer atenção',
        nivel: 'yellow',
      });
    } else {
      this.riscos.push({
        titulo: 'Saúde mental',
        descricao: 'Nenhum alerta identificado. Continue assim!',
        badge: 'Estável',
        nivel: 'green',
      });
    }

    // Registra no histórico uma vez por sessão (evita duplicar ao navegar de volta)
    const chave = 'checkup_registrado_' + new Date().toDateString();
    if (!sessionStorage.getItem(chave)) {
      const alertas = this.riscos.filter(r => r.nivel !== 'green').length;
      const descricao = alertas === 0
        ? 'Check-up concluído — tudo estável'
        : `Check-up concluído — ${alertas} item${alertas > 1 ? 'ns' : ''} requer${alertas === 1 ? ' atenção' : 'em atenção'}`;

      this.historico.registrar({
        tipo: 'checkup',
        descricao,
        pontos: 50,
        riscos: this.riscos.map(r => ({ titulo: r.titulo, nivel: r.nivel })),
      });

      this.game.add(50, 'Check-up diário concluído');
      sessionStorage.setItem(chave, '1');
    }
  }
}
