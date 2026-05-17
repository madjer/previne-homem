import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth, authState } from '@angular/fire/auth';
import { PerfilService } from '../../core/services/perfil.service';
import { GamificationService } from '../../core/services/gamification';
import { take } from 'rxjs';

interface Lembrete {
  texto: string;
  horario: string;
  ativo: boolean;
}

interface AlertaAuto {
  id: string;
  texto: string;
  condicao: string;
  pontos: number;
  confirmado: boolean;
  corBg: string;
  corTexto: string;
  icone: string;
}

@Component({
  standalone: true,
  selector: 'app-lembretes',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lembretes.html',
})
export class LembretesComponent implements OnInit {

  novoTexto = '';
  novoHorario = '';
  successMessage = '';
  alertasAuto: AlertaAuto[] = [];

  lembretes: Lembrete[] = [];

  constructor(
    private auth: Auth,
    private perfilService: PerfilService,
    private game: GamificationService,
  ) {}

  ngOnInit() {
    this.carregarLembretes();
    authState(this.auth).pipe(take(1)).subscribe(async user => {
      if (!user) return;
      const perfil: any = await this.perfilService.obterPorUid(user.uid);
      if (perfil) this.alertasAuto = this.gerarAlertas(perfil);
      this.carregarConfirmacoes();
    });
  }

  adicionar() {
    if (!this.novoTexto.trim()) return;
    this.lembretes.push({ texto: this.novoTexto.trim(), horario: this.novoHorario, ativo: true });
    this.novoTexto = '';
    this.novoHorario = '';
    this.salvarLembretes();
    this.successMessage = 'Lembrete adicionado!';
    setTimeout(() => { this.successMessage = ''; }, 2000);
  }

  remover(i: number) {
    this.lembretes.splice(i, 1);
    this.salvarLembretes();
  }

  confirmarAlerta(alerta: AlertaAuto) {
    if (alerta.confirmado) return;
    alerta.confirmado = true;
    this.game.add(alerta.pontos, `Alerta confirmado: ${alerta.texto}`);
    this.salvarConfirmacoes();
    this.successMessage = `+${alerta.pontos} pontos! Parabéns por cuidar da sua saúde.`;
    setTimeout(() => { this.successMessage = ''; }, 3000);
  }

  get alertasPendentes(): AlertaAuto[] {
    return this.alertasAuto.filter(a => !a.confirmado);
  }

  get alertasConfirmados(): AlertaAuto[] {
    return this.alertasAuto.filter(a => a.confirmado);
  }

  private gerarAlertas(perfil: any): AlertaAuto[] {
    const alertas: AlertaAuto[] = [];
    const idade = this.calcularIdade(perfil.dataNascimento);

    if (perfil.diabetico === 'sim') {
      alertas.push({ id: 'diab_pes',  texto: 'Realizar avaliação dos pés (1x ao ano)',              condicao: 'Diabetes',     pontos: 15, confirmado: false, corBg: 'bg-blue-50',   corTexto: 'text-blue-500',  icone: '🩸' });
      alertas.push({ id: 'diab_glic', texto: 'Medir glicemia e hemoglobina glicada (a cada 3 meses)', condicao: 'Diabetes',   pontos: 15, confirmado: false, corBg: 'bg-blue-50',   corTexto: 'text-blue-500',  icone: '🩸' });
      alertas.push({ id: 'diab_cons', texto: 'Consulta de acompanhamento na UBS (a cada 3 meses)',   condicao: 'Diabetes',     pontos: 30, confirmado: false, corBg: 'bg-blue-50',   corTexto: 'text-blue-500',  icone: '🩸' });
    }
    if (perfil.hipertenso === 'sim') {
      alertas.push({ id: 'hip_press', texto: 'Medir a pressão arterial (mensalmente)',                condicao: 'Hipertensão',  pontos: 15, confirmado: false, corBg: 'bg-red-50',    corTexto: 'text-red-700',   icone: '💓' });
      alertas.push({ id: 'hip_cons',  texto: 'Consulta de acompanhamento na UBS (a cada 3 meses)',   condicao: 'Hipertensão',  pontos: 30, confirmado: false, corBg: 'bg-red-50',    corTexto: 'text-red-700',   icone: '💓' });
    }
    if (perfil.tabagismo === 'fumante') {
      alertas.push({ id: 'fum_prog',  texto: 'Participar do programa de cessação do tabagismo na UBS', condicao: 'Tabagismo',  pontos: 20, confirmado: false, corBg: 'bg-gray-50',   corTexto: 'text-gray-700',  icone: '🚬' });
    }
    if (idade !== null && idade >= 50) {
      alertas.push({ id: 'psa',       texto: 'Realizar exame de PSA — próstata (1x ao ano)',          condicao: '50+ anos',     pontos: 20, confirmado: false, corBg: 'bg-indigo-50', corTexto: 'text-indigo-700', icone: '🎗️' });
    }
    if (idade !== null && idade >= 40) {
      alertas.push({ id: 'colest',    texto: 'Realizar exame de colesterol e triglicerídeos (1x ao ano)', condicao: '40+ anos', pontos: 15, confirmado: false, corBg: 'bg-orange-50', corTexto: 'text-orange-700', icone: '🔬' });
    }
    if (perfil.atividadeFisica === 'sedentario') {
      alertas.push({ id: 'sed_ativ',  texto: 'Ingressar em atividade física — pergunte à UBS sobre grupos disponíveis', condicao: 'Sedentarismo', pontos: 10, confirmado: false, corBg: 'bg-blue-50', corTexto: 'text-blue-500', icone: '🏃' });
    }
    alertas.push({ id: 'todos_press', texto: 'Verificar pressão arterial (1x ao ano)',                 condicao: 'Prevenção',    pontos: 10, confirmado: false, corBg: 'bg-blue-50',   corTexto: 'text-blue-500',  icone: '🩺' });
    alertas.push({ id: 'todos_glic',  texto: 'Realizar exame de glicemia em jejum (1x ao ano)',        condicao: 'Prevenção',    pontos: 10, confirmado: false, corBg: 'bg-blue-50',   corTexto: 'text-blue-500',  icone: '🩺' });
    alertas.push({ id: 'todos_cons',  texto: 'Consulta médica ou de enfermagem na UBS (1x ao ano)',    condicao: 'Prevenção',    pontos: 30, confirmado: false, corBg: 'bg-blue-50',   corTexto: 'text-blue-500',  icone: '🩺' });

    return alertas;
  }

  private calcularIdade(dataNascimento: string): number | null {
    if (!dataNascimento) return null;
    const parts = dataNascimento.split('-').map(Number);
    if (parts.length !== 3) return null;
    const birth = new Date(parts[0], parts[1] - 1, parts[2]);
    const hoje = new Date();
    let age = hoje.getFullYear() - birth.getFullYear();
    const m = hoje.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < birth.getDate())) age--;
    return age;
  }

  private carregarLembretes() {
    try {
      this.lembretes = JSON.parse(localStorage.getItem('lembretes') || '[]');
    } catch { this.lembretes = []; }
  }

  private salvarLembretes() {
    localStorage.setItem('lembretes', JSON.stringify(this.lembretes));
  }

  private carregarConfirmacoes() {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem('alertas_confirmados_hoje') || '[]');
      const hoje = new Date().toDateString();
      const chave = `alertas_conf_${hoje}`;
      const confirmadosHoje: string[] = JSON.parse(localStorage.getItem(chave) || '[]');
      for (const alerta of this.alertasAuto) {
        alerta.confirmado = confirmadosHoje.includes(alerta.id);
      }
    } catch { /* ignore */ }
  }

  private salvarConfirmacoes() {
    const hoje = new Date().toDateString();
    const chave = `alertas_conf_${hoje}`;
    const confirmados = this.alertasAuto.filter(a => a.confirmado).map(a => a.id);
    localStorage.setItem(chave, JSON.stringify(confirmados));
  }
}
