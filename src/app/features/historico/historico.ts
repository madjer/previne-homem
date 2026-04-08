import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HistoricoService } from '../../core/services/historico.service';
import { GamificationService } from '../../core/services/gamification';
import { EntradaHistorico } from '../../shared/models/historico.model';

interface GrupoData {
  data: string;
  entradas: EntradaHistorico[];
}

@Component({
  standalone: true,
  selector: 'app-historico',
  imports: [CommonModule, RouterModule],
  templateUrl: './historico.html',
})
export class HistoricoComponent implements OnInit {

  pontos = 0;
  grupos: GrupoData[] = [];
  vazio = false;

  constructor(
    private historicoService: HistoricoService,
    private game: GamificationService,
  ) {}

  ngOnInit() {
    this.pontos = this.game.pontos;
    this.grupos = this.historicoService.porData();
    this.vazio = this.grupos.length === 0;
  }

  hora(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  nivelCor(nivel: string): string {
    if (nivel === 'red') return 'text-red-500';
    if (nivel === 'yellow') return 'text-yellow-500';
    return 'text-green-500';
  }
}
