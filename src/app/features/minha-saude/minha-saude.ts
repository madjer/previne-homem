import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';

interface MetricaCard {
  label: string;
  valor: string;
  unidade: string;
  detalhe: string;
  cor: 'red' | 'green' | 'yellow';
}

interface HistoricoItem {
  texto: string;
  data: string;
  cor: 'green' | 'yellow';
}

@Component({
  standalone: true,
  selector: 'app-minha-saude',
  imports: [CommonModule, RouterModule],
  templateUrl: './minha-saude.html',
})
export class MinhaSaudeComponent implements OnInit {

  metricas: MetricaCard[] = [];
  historico: HistoricoItem[] = [];

  constructor(private checkupService: CheckupService) {}

  ngOnInit() {
    const checkup = this.checkupService.obter();

    const peso = checkup?.peso ?? null;
    const altura = checkup?.altura ?? null;
    const imc = peso && altura ? +(peso / ((altura / 100) ** 2)).toFixed(1) : null;

    this.metricas = [
      {
        label: 'Pressão arterial',
        valor: checkup?.pressaoAlta === 'sim' ? '130/85' : '120/80',
        unidade: 'mmHg',
        detalhe: 'há 3 dias',
        cor: checkup?.pressaoAlta === 'sim' ? 'red' : 'green',
      },
      {
        label: 'Peso',
        valor: peso ? String(peso) : '--',
        unidade: 'kg',
        detalhe: 'registrado no check-up',
        cor: 'green',
      },
      {
        label: 'Glicemia',
        valor: checkup?.diabetes === 'sim' ? '126' : '98',
        unidade: 'mg/dL',
        detalhe: 'estimado',
        cor: checkup?.diabetes === 'sim' ? 'yellow' : 'green',
      },
      {
        label: 'IMC',
        valor: imc ? String(imc) : '--',
        unidade: 'kg/m²',
        detalhe: 'estimado',
        cor: imc && imc > 25 ? 'yellow' : 'green',
      },
    ];

    this.historico = [
      { texto: 'Consulta na UBS registrada', data: '15/03/2025', cor: 'green' },
      { texto: `Pressão medida: ${this.metricas[0].valor} mmHg`, data: '10/03/2025', cor: 'green' },
      { texto: `Peso registrado: ${peso ?? '--'} kg`, data: '03/03/2025', cor: 'yellow' },
    ];
  }
}
