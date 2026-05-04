import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PerfilService } from '../../core/services/perfil.service';
import { GamificationService } from '../../core/services/gamification';
import { Auth, authState } from '@angular/fire/auth';
import { Subject, takeUntil, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './perfil.html',
})
export class PerfilComponent implements OnInit, OnDestroy {

  perfil: any = {};
  userName = '';
  userEmail = '';
  isLoading = true;
  successMessage = '';
  private primeiroSalvamento = false;
  private destroy$ = new Subject<void>();

  condicoesSaude = [
    { campo: 'hipertenso',        label: 'Hipertensão arterial',      opcoes: [{v:'sim',l:'Sim'},{v:'nao',l:'Não'},{v:'naoSei',l:'Não sei'}] },
    { campo: 'diabetico',         label: 'Diabetes mellitus',         opcoes: [{v:'sim',l:'Sim'},{v:'nao',l:'Não'},{v:'naoSei',l:'Não sei'}] },
    { campo: 'doencaCardiaca',    label: 'Doença cardíaca',           opcoes: [{v:'sim',l:'Sim'},{v:'nao',l:'Não'},{v:'naoSei',l:'Não sei'}] },
    { campo: 'colesterolElevado', label: 'Colesterol elevado',        opcoes: [{v:'sim',l:'Sim'},{v:'nao',l:'Não'},{v:'naoSei',l:'Não sei'}] },
    { campo: 'depressaoAnsiedade',label: 'Depressão ou ansiedade',    opcoes: [{v:'sim',l:'Sim'},{v:'nao',l:'Não'},{v:'naoSei',l:'Não sei'}] },
    { campo: 'cancer',            label: 'Histórico de câncer',       opcoes: [{v:'sim',l:'Sim'},{v:'nao',l:'Não'}] },
  ];

  constructor(
    private service: PerfilService,
    private game: GamificationService,
    private router: Router,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    authState(this.auth).pipe(take(1), takeUntil(this.destroy$)).subscribe(async user => {
      if (!user) { this.isLoading = false; this.cdr.detectChanges(); return; }
      this.isLoading = true;
      try {
        const data: any = await this.service.obterPorUid(user.uid);
        this.userName = user.displayName || '';
        this.userEmail = user.email || '';
        this.primeiroSalvamento = !data;
        this.perfil = data
          ? { ...data, dataNascimento: this.normalizeDateInput(data.dataNascimento) }
          : { dataNascimento: '', peso: null, altura: null };
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get idadeTexto(): string {
    const idade = this.calcularIdade(this.perfil?.dataNascimento);
    if (idade === null) return '';
    if (idade >= 60) return `${idade} anos — Idoso`;
    return `${idade} anos`;
  }

  async salvar() {
    await this.service.salvar(this.perfil);
    const pontos = this.primeiroSalvamento ? 50 : 10;
    this.game.add(pontos, this.primeiroSalvamento ? 'Perfil de saúde preenchido pela primeira vez' : 'Perfil de saúde atualizado');
    this.primeiroSalvamento = false;
    this.successMessage = 'Perfil salvo com sucesso!';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
      this.router.navigate(['/']);
    }, 2000);
  }

  private calcularIdade(dataNascimento: string): number | null {
    if (!dataNascimento || typeof dataNascimento !== 'string') return null;
    const parts = dataNascimento.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
    const birth = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const hoje = new Date();
    const todayUtc = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate()));
    let age = todayUtc.getUTCFullYear() - birth.getUTCFullYear();
    const m = todayUtc.getUTCMonth() - birth.getUTCMonth();
    if (m < 0 || (m === 0 && todayUtc.getUTCDate() < birth.getUTCDate())) age--;
    return age >= 0 ? age : null;
  }

  private normalizeDateInput(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value?.toDate === 'function') {
      const d = value.toDate();
      return d instanceof Date ? d.toISOString().slice(0, 10) : '';
    }
    return '';
  }
}
