import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CheckupService } from '../../core/services/checkup.service';
import { GamificationService } from '../../core/services/gamification';
import { HistoricoService } from '../../core/services/historico.service';
import { Checkup } from '../../shared/models/checkup.model';

interface ChecklistItem {
  id: string;
  texto: string;
  marcado: boolean;
}

interface ChecklistCondicao {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  corBg: string;
  corBorda: string;
  itens: ChecklistItem[];
  proximoPasso: string;
}

interface Secao {
  titulo: string;
  subtitulo: string;
}

@Component({
  standalone: true,
  selector: 'app-checkup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkup.html',
})
export class CheckupComponent implements OnInit {

  modo: 'lista' | 'questionario' = 'questionario';
  checkupData: Checkup | null = null;
  checklists: ChecklistCondicao[] = [];

  // --- Questionário ---
  secaoAtual = 1;
  totalSecoes = 5;

  secoes: Secao[] = [
    { titulo: 'Dados Básicos',      subtitulo: 'Informações gerais sobre você' },
    { titulo: 'Condições de Saúde', subtitulo: 'Doenças e condições conhecidas' },
    { titulo: 'Hábitos',            subtitulo: 'Tabagismo e consumo de álcool' },
    { titulo: 'Atividade Física',   subtitulo: 'Seu nível de movimento diário' },
    { titulo: 'Bem-estar Mental',   subtitulo: 'Como você tem se sentido' },
  ];

  model: Checkup = {
    pressaoConhece: null,
    pressaoAlta: 'naoSei',
    diabetes: 'naoSei',
    fuma: 'nao',
    alcool: 'nao',
    atividadeFisica: null,
    sedentario: 'naoSei',
    humor: 'neutro',
    peso: undefined,
    altura: undefined,
    data: new Date(),
  };

  get progresso() { return (this.secaoAtual / this.totalSecoes) * 100; }
  get secao()     { return this.secoes[this.secaoAtual - 1]; }

  constructor(
    private service: CheckupService,
    private game: GamificationService,
    private historico: HistoricoService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.checkupData = this.service.obter();
    if (this.checkupData) {
      this.modo = 'lista';
      this.gerarChecklists(this.checkupData);
      this.carregarEstado();
    }
  }

  // ─── Questionário ───────────────────────────────────────────────────────────

  avancar() {
    if (this.secaoAtual < this.totalSecoes) {
      this.secaoAtual++;
    } else {
      this.salvar();
    }
  }

  voltar() {
    if (this.modo === 'questionario' && this.checkupData) {
      this.modo = 'lista';
      return;
    }
    if (this.secaoAtual > 1) {
      this.secaoAtual--;
    } else {
      this.router.navigateByUrl('/');
    }
  }

  salvar() {
    this.model.data = new Date();
    this.service.salvar(this.model);
    this.game.add(50, 'Check-up diário concluído');
    this.historico.registrar({ tipo: 'checkup', descricao: 'Check-up atualizado', pontos: 50 });
    this.checkupData = { ...this.model };
    this.checklists = [];
    this.gerarChecklists(this.checkupData);
    this.modo = 'lista';
    this.secaoAtual = 1;
  }

  editarCondicoes() {
    if (this.checkupData) {
      this.model = { ...this.checkupData };
    }
    this.secaoAtual = 1;
    this.modo = 'questionario';
  }

  // ─── Checklists ─────────────────────────────────────────────────────────────

  private gerarChecklists(c: Checkup) {

    if (c.diabetes === 'sim') {
      this.checklists.push({
        id: 'diabetes',
        titulo: 'Diabetes',
        icone: '🩸',
        cor: 'text-blue-700',
        corBg: 'bg-blue-50',
        corBorda: 'border-blue-300',
        proximoPasso: 'Agende sua consulta na UBS se algum item estiver pendente.',
        itens: [
          { id: 'd1', texto: 'Consulta com médico ou enfermeiro nos últimos 3 meses', marcado: false },
          { id: 'd2', texto: 'Hemoglobina glicada solicitada nos últimos 6 meses', marcado: false },
          { id: 'd3', texto: 'Pressão arterial medida nesta consulta', marcado: false },
          { id: 'd4', texto: 'Peso e altura registrados nesta consulta', marcado: false },
          { id: 'd5', texto: 'Pés avaliados (sensibilidade, feridas, calosidades)', marcado: false },
          { id: 'd6', texto: 'Vacina contra influenza em dia', marcado: false },
          { id: 'd7', texto: 'Exame de urina e creatinina nos últimos 6 meses', marcado: false },
        ],
      });
    }

    if (c.pressaoAlta === 'sim') {
      this.checklists.push({
        id: 'hipertensao',
        titulo: 'Hipertensão (Pressão Alta)',
        icone: '💓',
        cor: 'text-red-700',
        corBg: 'bg-red-50',
        corBorda: 'border-red-300',
        proximoPasso: 'Nunca pare o medicamento sem orientação médica, mesmo sentindo-se bem.',
        itens: [
          { id: 'h1', texto: 'Pressão arterial medida este mês', marcado: false },
          { id: 'h2', texto: 'Consulta com médico ou enfermeiro nos últimos 3 a 6 meses', marcado: false },
          { id: 'h3', texto: 'Peso e altura verificados na última consulta', marcado: false },
          { id: 'h4', texto: 'Exames solicitados: creatinina, potássio, colesterol, glicemia', marcado: false },
          { id: 'h5', texto: 'Medicamento em uso contínuo e sem interrupção', marcado: false },
          { id: 'h6', texto: 'Vacina contra influenza em dia', marcado: false },
        ],
      });
    }

    if (c.pressaoAlta === 'sim' || c.diabetes === 'sim') {
      this.checklists.push({
        id: 'cardiovascular',
        titulo: 'Doenças Cardiovasculares',
        icone: '❤️',
        cor: 'text-pink-700',
        corBg: 'bg-pink-50',
        corBorda: 'border-pink-300',
        proximoPasso: 'Solicite a avaliação de risco cardiovascular na sua UBS.',
        itens: [
          { id: 'cv1', texto: 'Avaliação de risco cardiovascular realizada (indicada para homens de 40 a 74 anos)', marcado: false },
          { id: 'cv2', texto: 'Pressão arterial controlada e monitorada', marcado: false },
          { id: 'cv3', texto: 'Colesterol e glicemia verificados nos últimos 6 meses', marcado: false },
          { id: 'cv4', texto: 'Peso e circunferência abdominal monitorados', marcado: false },
          { id: 'cv5', texto: 'Consulta com médico da UBS realizada', marcado: false },
        ],
      });
    }

    if (c.fuma === 'asVezes' || c.fuma === 'todoDia') {
      this.checklists.push({
        id: 'tabagismo',
        titulo: 'Tabagismo',
        icone: '🚬',
        cor: 'text-gray-700',
        corBg: 'bg-gray-50',
        corBorda: 'border-gray-300',
        proximoPasso: 'O SUS oferece apoio gratuito para parar de fumar. Pergunte na sua UBS.',
        itens: [
          { id: 't1', texto: 'Registrei quantos cigarros fumei hoje', marcado: false },
          { id: 't2', texto: 'Identifiquei meus principais gatilhos para fumar', marcado: false },
          { id: 't3', texto: 'Procurei informações sobre o Programa de Cessação do Tabagismo da UBS', marcado: false },
          { id: 't4', texto: 'Marquei uma data para parar ou reduzir', marcado: false },
        ],
      });
    }

    if (c.alcool === 'quaseTodoDia' || c.alcool === 'todoDia') {
      this.checklists.push({
        id: 'etilismo',
        titulo: 'Uso de Álcool',
        icone: '🍺',
        cor: 'text-amber-700',
        corBg: 'bg-amber-50',
        corBorda: 'border-amber-300',
        proximoPasso: 'Se marcou menos de 2 itens, converse com o profissional de saúde da UBS sem julgamentos.',
        itens: [
          { id: 'e1', texto: 'Registrei quantas doses bebi esta semana', marcado: false },
          { id: 'e2', texto: 'Fiquei pelo menos 2 dias sem beber nesta semana', marcado: false },
          { id: 'e3', texto: 'Não bebi e dirigi nesta semana', marcado: false },
          { id: 'e4', texto: 'Avaliei se o álcool está interferindo na minha vida ou saúde', marcado: false },
        ],
      });
    }

    if (c.sedentario === 'sim') {
      this.checklists.push({
        id: 'sedentarismo',
        titulo: 'Sedentarismo',
        icone: '🏃',
        cor: 'text-blue-700',
        corBg: 'bg-blue-50',
        corBorda: 'border-blue-300',
        proximoPasso: 'Registre sua atividade física na aba Meu Resultado para acompanhar sua evolução.',
        itens: [
          { id: 's1', texto: 'Me exercitei pelo menos 3 vezes esta semana', marcado: false },
          { id: 's2', texto: 'Acumulei pelo menos 150 minutos de atividade moderada nesta semana', marcado: false },
          { id: 's3', texto: 'Reduzi o tempo sentado: levantei pelo menos 1 vez por hora', marcado: false },
          { id: 's4', texto: 'Fui a pé ou de bicicleta em algum trajeto esta semana', marcado: false },
        ],
      });
    }

    if (c.humor === 'mal' || c.humor === 'ruim') {
      this.checklists.push({
        id: 'saudeMental',
        titulo: 'Saúde Mental',
        icone: '🧠',
        cor: 'text-rose-700',
        corBg: 'bg-rose-50',
        corBorda: 'border-rose-300',
        proximoPasso: 'Se marcou menos de 3 itens, converse com o enfermeiro da sua UBS.',
        itens: [
          { id: 'sm1', texto: 'Conversei com alguém sobre como estou me sentindo', marcado: false },
          { id: 'sm2', texto: 'Dormi pelo menos 7 horas por noite nos últimos dias', marcado: false },
          { id: 'sm3', texto: 'Pratiquei alguma atividade física esta semana', marcado: false },
          { id: 'sm4', texto: 'Fui à UBS ou busquei apoio profissional se percebi sinais de alerta', marcado: false },
          { id: 'sm5', texto: 'Reduzi o consumo de álcool ou cafeína', marcado: false },
          { id: 'sm6', texto: 'Fiz uma pausa e cuidei de algo que me dá prazer esta semana', marcado: false },
        ],
      });
    }

    // Checklists universais (sempre exibidos)
    this.checklists.push({
      id: 'ist',
      titulo: 'ISTs e Saúde Sexual',
      icone: '❤️‍🔥',
      cor: 'text-purple-700',
      corBg: 'bg-purple-50',
      corBorda: 'border-purple-300',
      proximoPasso: 'Teste rápido de HIV e sífilis: gratuito, rápido e sigiloso na sua UBS.',
      itens: [
        { id: 'ist1', texto: 'Usei preservativo nas últimas relações sexuais', marcado: false },
        { id: 'ist2', texto: 'Realizei teste de HIV e sífilis nos últimos 12 meses', marcado: false },
        { id: 'ist3', texto: 'Estou vacinado contra hepatite B e HPV', marcado: false },
        { id: 'ist4', texto: 'Conheço a PrEP e sei que está disponível na UBS se precisar', marcado: false },
        { id: 'ist5', texto: 'Sei o que é PEP e que devo buscar em até 72h após situação de risco', marcado: false },
      ],
    });

    this.checklists.push({
      id: 'prevencao',
      titulo: 'Prevenção de Violências',
      icone: '🛡️',
      cor: 'text-blue-700',
      corBg: 'bg-blue-50',
      corBorda: 'border-blue-300',
      proximoPasso: 'Segurança não é falta de coragem — é responsabilidade com sua vida e com quem depende de você.',
      itens: [
        { id: 'pv1', texto: 'Usei cinto de segurança em todos os deslocamentos esta semana', marcado: false },
        { id: 'pv2', texto: 'Não usei o celular ao volante esta semana', marcado: false },
        { id: 'pv3', texto: 'Não dirigi após consumir álcool', marcado: false },
        { id: 'pv4', texto: 'Usei EPI no trabalho quando necessário', marcado: false },
        { id: 'pv5', texto: 'Resolvi conflitos com diálogo', marcado: false },
      ],
    });

    this.checklists.push({
      id: 'prostata',
      titulo: 'Câncer de Próstata',
      icone: '🎗️',
      cor: 'text-indigo-700',
      corBg: 'bg-indigo-50',
      corBorda: 'border-indigo-300',
      proximoPasso: 'Se ainda não fez, leve este checklist à sua próxima consulta na UBS.',
      itens: [
        { id: 'pr1', texto: 'PSA solicitado nos últimos 12 meses (a partir de 50 anos, ou 45 se negro ou histórico familiar)', marcado: false },
        { id: 'pr2', texto: 'Toque retal realizado na última consulta', marcado: false },
        { id: 'pr3', texto: 'Consulta com médico agendada para discutir resultados', marcado: false },
        { id: 'pr4', texto: 'Sintomas urinários relatados ao profissional de saúde', marcado: false },
      ],
    });
  }

  contarMarcados(itens: ChecklistItem[]): number {
    return itens.filter(i => i.marcado).length;
  }

  marcarItem(item: ChecklistItem) {
    item.marcado = !item.marcado;
    this.salvarEstado();
  }

  get totalMarcados(): number {
    return this.checklists.reduce((sum, cl) => sum + cl.itens.filter(i => i.marcado).length, 0);
  }

  get totalItens(): number {
    return this.checklists.reduce((sum, cl) => sum + cl.itens.length, 0);
  }

  private readonly chaveEstado = `checklist_estado_${new Date().toISOString().split('T')[0]}`;

  private salvarEstado() {
    const estado: Record<string, boolean> = {};
    for (const cl of this.checklists) {
      for (const item of cl.itens) {
        estado[item.id] = item.marcado;
      }
    }
    localStorage.setItem(this.chaveEstado, JSON.stringify(estado));
  }

  private carregarEstado() {
    const raw = localStorage.getItem(this.chaveEstado);
    if (!raw) return;
    try {
      const estado: Record<string, boolean> = JSON.parse(raw);
      for (const cl of this.checklists) {
        for (const item of cl.itens) {
          if (estado[item.id] !== undefined) item.marcado = estado[item.id];
        }
      }
    } catch { /* ignore */ }
  }
}
