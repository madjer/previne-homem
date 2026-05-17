import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
import { HistoricoService } from '../../core/services/historico.service';
import { GamificationService } from '../../core/services/gamification';
import { Checkup } from '../../shared/models/checkup.model';

interface PressaoMedicao {
  data: string;
  sistolica: number;
  diastolica: number;
}

interface Medicao {
  data: string;
  valor: number;
}

interface HumorMedicao {
  data: string;
  nivel: number;
  label: string;
}

interface Orientacao {
  titulo: string;
  icone: string;
  cor: string;
  corBg: string;
  corBorda: string;
  dicas: string[];
  rota: string;
  rotaLabel: string;
}

@Component({
  standalone: true,
  selector: 'app-resultado-checkup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resultado-checkup.html',
})
export class ResultadoCheckupComponent implements OnInit {

  checkupData: Checkup | null = null;
  orientacoes: Orientacao[] = [];
  mostrarOrientacoes = false;

  // ─── Monitoramento ───────────────────────────────────────────────────────────
  pressoes: PressaoMedicao[] = [];
  pesos: Medicao[] = [];
  glicemias: Medicao[] = [];
  humores: HumorMedicao[] = [];

  novaSistolica: number | undefined;
  novaDiastolica: number | undefined;
  novoPeso: number | undefined;
  novaGlicemia: number | undefined;

  humorOpcoes = [
    { nivel: 1, emoji: '😞', label: 'Mal' },
    { nivel: 2, emoji: '😕', label: 'Ruim' },
    { nivel: 3, emoji: '😐', label: 'Neutro' },
    { nivel: 4, emoji: '😊', label: 'Bem' },
    { nivel: 5, emoji: '😄', label: 'Ótimo' },
  ];

  humorHoje: number | null = null;

  constructor(
    private service: CheckupService,
    private historico: HistoricoService,
    private game: GamificationService,
  ) {}

  ngOnInit() {
    this.checkupData = this.service.obter();
    if (this.checkupData) {
      this.gerarOrientacoes(this.checkupData);
      this.registrarHistorico();
    }
    this.carregarMedicoes();
    this.detectarHumorHoje();
  }

  // ─── Cálculos ────────────────────────────────────────────────────────────────

  calcIMC(peso: number): number {
    const altura = this.checkupData?.altura;
    if (!altura || altura <= 0) return 0;
    return peso / ((altura / 100) ** 2);
  }

  classificarIMC(imc: number): { label: string; cor: string } {
    if (imc < 18.5) return { label: 'Abaixo do peso', cor: 'text-blue-500' };
    if (imc < 25)   return { label: 'Peso normal', cor: 'text-blue-500' };
    if (imc < 30)   return { label: 'Sobrepeso', cor: 'text-yellow-600' };
    if (imc < 35)   return { label: 'Obesidade Grau I', cor: 'text-orange-600' };
    if (imc < 40)   return { label: 'Obesidade Grau II', cor: 'text-red-600' };
    return { label: 'Obesidade Grau III', cor: 'text-red-800' };
  }

  classificarPressao(s: number, d: number): { label: string; cor: string } {
    if (s < 120 && d < 80)  return { label: 'Normal', cor: 'text-blue-500' };
    if (s < 130 && d < 80)  return { label: 'Elevada', cor: 'text-yellow-600' };
    if (s < 140 || d < 90)  return { label: 'Hipertensão Estágio 1', cor: 'text-orange-600' };
    return { label: 'Hipertensão Estágio 2', cor: 'text-red-600' };
  }

  classificarGlicemia(v: number): { label: string; cor: string } {
    if (v < 100)  return { label: 'Normal (jejum)', cor: 'text-blue-500' };
    if (v < 126)  return { label: 'Pré-diabetes', cor: 'text-yellow-600' };
    return { label: 'Alterada — consulte UBS', cor: 'text-red-600' };
  }

  private get pesoBase(): number {
    return this.pesos.length > 0 ? this.pesos[0].valor : (this.checkupData?.peso ?? 0);
  }

  get pesoAtual(): number { return this.pesoBase; }

  get imcAtual(): number {
    return this.pesoBase > 0 ? this.calcIMC(this.pesoBase) : 0;
  }

  get imcClassificacao(): { label: string; cor: string } | null {
    return this.imcAtual > 0 ? this.classificarIMC(this.imcAtual) : null;
  }

  // ─── Registrar medições ──────────────────────────────────────────────────────

  registrarPressao() {
    if (!this.novaSistolica || !this.novaDiastolica) return;
    const m: PressaoMedicao = {
      data: new Date().toISOString(),
      sistolica: this.novaSistolica,
      diastolica: this.novaDiastolica,
    };
    this.pressoes.unshift(m);
    if (this.pressoes.length > 10) this.pressoes = this.pressoes.slice(0, 10);
    localStorage.setItem('resultado_pressoes', JSON.stringify(this.pressoes));
    this.novaSistolica = undefined;
    this.novaDiastolica = undefined;
  }

  registrarPeso() {
    if (!this.novoPeso) return;
    const m: Medicao = { data: new Date().toISOString(), valor: this.novoPeso };
    this.pesos.unshift(m);
    if (this.pesos.length > 10) this.pesos = this.pesos.slice(0, 10);
    localStorage.setItem('resultado_pesos', JSON.stringify(this.pesos));
    this.novoPeso = undefined;
  }

  registrarGlicemia() {
    if (!this.novaGlicemia) return;
    const m: Medicao = { data: new Date().toISOString(), valor: this.novaGlicemia };
    this.glicemias.unshift(m);
    if (this.glicemias.length > 10) this.glicemias = this.glicemias.slice(0, 10);
    localStorage.setItem('resultado_glicemias', JSON.stringify(this.glicemias));
    this.novaGlicemia = undefined;
  }

  registrarHumor(nivel: number) {
    const opcao = this.humorOpcoes.find(o => o.nivel === nivel)!;
    const hoje = new Date().toISOString().split('T')[0];
    const existente = this.humores.findIndex(h => h.data.startsWith(hoje));
    const m: HumorMedicao = { data: new Date().toISOString(), nivel, label: opcao.label };
    if (existente >= 0) {
      this.humores[existente] = m;
    } else {
      this.humores.unshift(m);
      if (this.humores.length > 14) this.humores = this.humores.slice(0, 14);
    }
    localStorage.setItem('resultado_humores', JSON.stringify(this.humores));
    this.humorHoje = nivel;
  }

  // ─── Utilitários ────────────────────────────────────────────────────────────

  formatarData(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  verOrientacoes() {
    this.mostrarOrientacoes = true;
    setTimeout(() => {
      document.getElementById('orientacoes-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  private carregarMedicoes() {
    const parse = (key: string) => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    this.pressoes   = parse('resultado_pressoes');
    this.pesos      = parse('resultado_pesos');
    this.glicemias  = parse('resultado_glicemias');
    this.humores    = parse('resultado_humores');
  }

  private detectarHumorHoje() {
    const hoje = new Date().toISOString().split('T')[0];
    const h = this.humores.find(h => h.data.startsWith(hoje));
    this.humorHoje = h ? h.nivel : null;
  }

  private registrarHistorico() {
    const chave = 'checkup_registrado_' + new Date().toDateString();
    if (!sessionStorage.getItem(chave)) {
      this.historico.registrar({ tipo: 'checkup', descricao: 'Check-up visualizado', pontos: 10 });
      this.game.add(10, 'Check-up visualizado');
      sessionStorage.setItem(chave, '1');
    }
  }

  private gerarOrientacoes(c: Checkup) {
    if (c.pressaoAlta === 'sim') {
      this.orientacoes.push({
        titulo: 'Hipertensão (Pressão Alta)',
        icone: '💓',
        cor: 'text-red-700',
        corBg: 'bg-red-50',
        corBorda: 'border-red-300',
        dicas: [
          'Meça a pressão pelo menos 1 vez por mês e registre aqui',
          'Reduza o sal: menos de 5g por dia (1 colher de chá rasa)',
          'Evite embutidos, enlatados, temperos prontos e fast food',
          'Nunca pare o medicamento por conta própria, mesmo se sentindo bem',
          'Consulte médico ou enfermeiro a cada 3 a 6 meses',
        ],
        rota: '/corpo-exames',
        rotaLabel: 'Aprender sobre Hipertensão',
      });
    }
    if (c.diabetes === 'sim') {
      this.orientacoes.push({
        titulo: 'Diabetes',
        icone: '🩸',
        cor: 'text-blue-500',
        corBg: 'bg-blue-50',
        corBorda: 'border-blue-200',
        dicas: [
          'Solicite hemoglobina glicada a cada 6 meses',
          'Registre sua glicemia aqui para acompanhar a evolução',
          'Observe seus pés todo dia: feridas, calos, vermelhidão, dormência',
          'Reduza açúcar, farinha branca e frituras',
          'Não fique sem comer mais de 4 horas',
        ],
        rota: '/corpo-exames',
        rotaLabel: 'Aprender sobre Diabetes',
      });
    }
    if (c.fuma === 'asVezes' || c.fuma === 'todoDia') {
      this.orientacoes.push({
        titulo: 'Tabagismo',
        icone: '🚬',
        cor: 'text-gray-700',
        corBg: 'bg-gray-50',
        corBorda: 'border-gray-300',
        dicas: [
          'Existe programa gratuito para parar de fumar na UBS',
          'Em 24h após parar: risco de infarto já começa a cair',
          'Em 1 ano: risco de doença do coração cai pela metade',
          'Identifique seus gatilhos (estresse, café) e planeje alternativas',
        ],
        rota: '/habitos',
        rotaLabel: 'Ver desafios de hábitos',
      });
    }
    if (c.alcool === 'quaseTodoDia' || c.alcool === 'todoDia') {
      this.orientacoes.push({
        titulo: 'Uso de Álcool',
        icone: '🍺',
        cor: 'text-amber-700',
        corBg: 'bg-amber-50',
        corBorda: 'border-amber-300',
        dicas: [
          'Limite: máximo 2 doses por dia e pelo menos 2 dias sem beber',
          'Beber para lidar com emoções é um sinal de alerta',
          'Converse com o profissional da UBS — há tratamento gratuito',
        ],
        rota: '/habitos',
        rotaLabel: 'Ver orientações de hábitos',
      });
    }
    if (c.sedentario === 'sim') {
      this.orientacoes.push({
        titulo: 'Sedentarismo',
        icone: '🏃',
        cor: 'text-blue-500',
        corBg: 'bg-blue-50',
        corBorda: 'border-blue-200',
        dicas: [
          'Meta: 150 minutos de atividade moderada por semana',
          'Comece com 10 a 15 minutos por dia e aumente aos poucos',
          'Caminhada, natação, ciclismo ou dança já fazem diferença',
          'Prefira escadas ao elevador e vá a pé quando possível',
        ],
        rota: '/habitos',
        rotaLabel: 'Ver desafios de atividade física',
      });
    }
    if (c.humor === 'mal' || c.humor === 'ruim') {
      this.orientacoes.push({
        titulo: 'Saúde Mental',
        icone: '🧠',
        cor: 'text-rose-700',
        corBg: 'bg-rose-50',
        corBorda: 'border-rose-300',
        dicas: [
          'Procure o posto — o enfermeiro ou médico pode te ajudar',
          'Atividade física libera endorfina e melhora o humor',
          'Estabeleça rotina de sono: durma e acorde no mesmo horário',
          'CVV — Ligue 188 se precisar conversar (24h, gratuito)',
        ],
        rota: '/mente',
        rotaLabel: 'Ver orientações de saúde mental',
      });
    }
    if (this.orientacoes.length === 0) {
      this.orientacoes.push({
        titulo: 'Parabéns! Seus hábitos estão ótimos',
        icone: '🌟',
        cor: 'text-blue-500',
        corBg: 'bg-blue-50',
        corBorda: 'border-blue-200',
        dicas: [
          'Continue monitorando sua pressão e peso regularmente',
          'Faça seus exames de rotina anuais na UBS',
          'Converse com seu médico sobre prevenção do câncer de próstata',
        ],
        rota: '/corpo-exames',
        rotaLabel: 'Ver conteúdo educativo',
      });
    }
  }
}
