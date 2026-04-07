import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
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

  constructor(private service: CheckupService) {}

  ngOnInit() {
    const check = this.service.obter();
    if (check) this.avaliar(check);
  }

  avaliar(c: Checkup) {
    // Risco cardiovascular
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

    // Risco comportamental
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

    // Saúde mental
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
  }
}
