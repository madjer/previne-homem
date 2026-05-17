import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { PerfilService } from '../../core/services/perfil.service';
import { GamificationService } from '../../core/services/gamification';
import { Subject, takeUntil, take } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Mensagem {
  role: 'user' | 'model';
  texto: string;
}

const SYSTEM_PROMPT = `Você é um assistente de saúde do aplicativo Previne Homem, voltado à promoção da saúde masculina na Atenção Primária à Saúde (APS) do Brasil. Seu objetivo é orientar homens sobre prevenção de doenças, hábitos saudáveis, exames preventivos e uso dos serviços de saúde disponíveis na UBS.

Regras de comportamento:
- Use linguagem formal, porém clara e acessível. Evite termos técnicos sem explicação.
- Sempre personalize a resposta com base no perfil de saúde do usuário fornecido abaixo.
- Responda apenas sobre temas de saúde, prevenção, hábitos saudáveis e serviços da UBS.
- Nunca faça diagnósticos médicos. Se o usuário relatar sintomas graves, oriente-o a buscar atendimento imediato na UBS ou pronto-socorro.
- Encoraje o usuário a comparecer às consultas preventivas e a manter seu perfil atualizado no aplicativo.
- Seja objetivo e responda em no máximo 3 a 4 parágrafos curtos.`;

@Component({
  standalone: true,
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chatbot.html',
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatFim') chatFim!: ElementRef;

  mensagens: Mensagem[] = [];
  inputTexto = '';
  carregando = false;
  pontosAdicionadosHoje = false;

  private perfil: any = null;
  private nomeUsuario = '';
  private destroy$ = new Subject<void>();
  private deveRolar = false;

  constructor(
    private auth: Auth,
    private perfilService: PerfilService,
    private game: GamificationService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const pontosDia = localStorage.getItem('chatbot_pontos_' + new Date().toDateString());
    this.pontosAdicionadosHoje = !!pontosDia;

    authState(this.auth).pipe(take(1), takeUntil(this.destroy$)).subscribe(async user => {
      if (!user) return;
      this.nomeUsuario = user.displayName?.split(' ')[0] || '';
      const data = await this.perfilService.obterPorUid(user.uid);
      if (data) this.perfil = data;
      this.enviarBoasVindas();
    });
  }

  ngAfterViewChecked() {
    if (this.deveRolar) {
      this.chatFim?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
      this.deveRolar = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async enviar() {
    const texto = this.inputTexto.trim();
    if (!texto || this.carregando) return;
    this.inputTexto = '';
    this.mensagens.push({ role: 'user', texto });
    this.deveRolar = true;
    this.carregando = true;

    if (!this.pontosAdicionadosHoje) {
      this.game.add(5, 'Interação com assistente de saúde');
      localStorage.setItem('chatbot_pontos_' + new Date().toDateString(), '1');
      this.pontosAdicionadosHoje = true;
    }

    try {
      const resposta = await this.chamarGemini();
      this.mensagens.push({ role: 'model', texto: resposta });
    } catch {
      this.mensagens.push({ role: 'model', texto: 'Desculpe, ocorreu um erro ao contatar o assistente. Tente novamente.' });
    } finally {
      this.carregando = false;
      this.deveRolar = true;
      this.cdr.detectChanges();
    }
  }

  private enviarBoasVindas() {
    const nome = this.nomeUsuario || 'usuário';
    this.mensagens.push({
      role: 'model',
      texto: `Olá, ${nome}! Sou o assistente de saúde do Previne Homem. Estou aqui para orientar você sobre prevenção de doenças, hábitos saudáveis, exames preventivos e serviços da sua UBS. Como posso ajudá-lo hoje?`,
    });
    this.deveRolar = true;
  }

  private buildSystemPrompt(): string {
    const idade = this.calcularIdade(this.perfil?.dataNascimento);

    const condicoes: string[] = [];
    if (this.perfil?.hipertenso === 'sim') condicoes.push('Hipertensão arterial');
    if (this.perfil?.diabetico === 'sim') condicoes.push('Diabetes mellitus');
    if (this.perfil?.doencaCardiaca === 'sim') condicoes.push('Doença cardíaca');
    if (this.perfil?.colesterolElevado === 'sim') condicoes.push('Colesterol elevado');
    if (this.perfil?.depressaoAnsiedade === 'sim') condicoes.push('Depressão ou ansiedade');
    if (this.perfil?.cancer === 'sim') condicoes.push('Histórico de câncer');

    const habitos: string[] = [];
    const tab: Record<string, string> = { fumante: 'Fumante', exFumante: 'Ex-fumante', nuncaFumou: 'Nunca fumou' };
    const alc: Record<string, string> = { naoConsome: 'Não consome', ocasionalmente: 'Consome ocasionalmente', frequentemente: 'Consome frequentemente' };
    if (this.perfil?.tabagismo) habitos.push('Tabagismo: ' + (tab[this.perfil.tabagismo] || this.perfil.tabagismo));
    if (this.perfil?.alcool) habitos.push('Álcool: ' + (alc[this.perfil.alcool] || this.perfil.alcool));
    if (this.perfil?.atividadeFisica === 'sedentario') habitos.push('Sedentário');
    else if (this.perfil?.atividadeFisica === 'ativo') habitos.push('Ativo fisicamente');
    if (this.perfil?.alimentacao === 'saudavel') habitos.push('Alimentação saudável');
    else if (this.perfil?.alimentacao === 'irregular') habitos.push('Alimentação irregular');

    const ubs = this.perfil?.ubsReferencia || localStorage.getItem('ubs_nome') || 'não informada';

    return `${SYSTEM_PROMPT}

Perfil do usuário logado:
- Nome: ${this.nomeUsuario || 'não informado'}
- Idade: ${idade !== null ? idade + ' anos' : 'não informada'}
- Condições de saúde: ${condicoes.length > 0 ? condicoes.join(', ') : 'nenhuma condição informada'}
- Hábitos de vida: ${habitos.length > 0 ? habitos.join('; ') : 'não informados'}
- UBS de referência: ${ubs}`;
  }

  private async chamarGemini(): Promise<string> {
    const systemPrompt = this.buildSystemPrompt();
    // Gemini exige que o histórico comece com uma mensagem do usuário
    const firstUser = this.mensagens.findIndex(m => m.role === 'user');
    const contents = this.mensagens.slice(firstUser).map(m => ({
      role: m.role,
      parts: [{ text: m.texto }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${environment.geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
          contents,
        }),
      },
    );

    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível obter uma resposta.';
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
}
