import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PerfilService } from '../../core/services/perfil.service';
import { Auth, authState } from '@angular/fire/auth';
import { Subject, filter, takeUntil, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">
    <h1 class="text-xl font-bold text-blue-900 mb-4">Meu Perfil</h1>

    <div *ngIf="isLoading" class="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center gap-3">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"></div>
      <p class="text-gray-600 text-sm">Carregando perfil...</p>
    </div>

    <div *ngIf="!isLoading" class="bg-white p-4 rounded-xl shadow space-y-4">
      <div *ngIf="successMessage" class="rounded-lg bg-green-50 text-green-800 text-sm px-3 py-2 border border-green-200">
        {{ successMessage }}
      </div>
      <div class="space-y-1">
        <label class="text-sm text-gray-600">Nome</label>
        <p class="w-full p-2 border rounded bg-gray-50 text-gray-700">{{ userName || '-' }}</p>
      </div>
      <div class="space-y-1">
        <label class="text-sm text-gray-600">E-mail</label>
        <p class="w-full p-2 border rounded bg-gray-50 text-gray-700">{{ userEmail || '-' }}</p>
      </div>
      <div class="space-y-1">
        <label class="text-sm text-gray-600">Data de nascimento</label>
        <input type="date" [(ngModel)]="perfil.dataNascimento" class="w-full p-2 border rounded">
      </div>
      <div class="space-y-1">
        <label class="text-sm text-gray-600">Peso (kg)</label>
        <input type="number" [(ngModel)]="perfil.peso" class="w-full p-2 border rounded">
      </div>
      <div class="space-y-1">
        <label class="text-sm text-gray-600">Altura (cm)</label>
        <input type="number" [(ngModel)]="perfil.altura" class="w-full p-2 border rounded">
      </div>
      <div class="space-y-2">
        <p class="text-sm font-semibold text-gray-700">Condições</p>
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" [(ngModel)]="perfil.hipertenso" class="h-4 w-4">
          Hipertenso
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" [(ngModel)]="perfil.diabetico" class="h-4 w-4">
          Diabetico
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" [checked]="isIdoso()" disabled class="h-4 w-4">
          Idoso (60+)
        </label>
      </div>

      <button (click)="salvar()" class="w-full bg-blue-700 text-white p-3 rounded-xl">
        Salvar
      </button>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar
      </a>
    </div>
  </div>
  `
})
export class PerfilComponent {

  perfil: any = {};
  userName = '';
  userEmail = '';
  isLoading = true;
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private service: PerfilService,
    private router: Router,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    authState(this.auth)
      .pipe(
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(async user => {
        if (!user) {
          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }
        this.isLoading = true;
        try {
          const data: any = await this.service.obterPorUid(user.uid);
          this.userName = user.displayName || '';
          this.userEmail = user.email || '';
          if (data) {
            this.perfil = {
              ...data,
              dataNascimento: this.normalizeDateInput(data.dataNascimento)
            };
          }
          if (!data) {
            this.perfil = {
              dataNascimento: '',
              peso: null,
              altura: null,
              hipertenso: false,
              diabetico: false
            };
          }
        } finally {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  async salvar() {
    await this.service.salvar(this.perfil);
    this.successMessage = 'Perfil salvo com sucesso.';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
      this.router.navigate(['/']);
    }, 2500);
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

  isIdoso(): boolean {
    const dateStr = this.perfil?.dataNascimento;
    if (!dateStr || typeof dateStr !== 'string') return false;
    const parts = dateStr.split('-').map(p => Number(p));
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return false;
    const [year, month, day] = parts;
    const birth = new Date(Date.UTC(year, month - 1, day));
    const today = new Date();
    const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    let age = todayUtc.getUTCFullYear() - birth.getUTCFullYear();
    const m = todayUtc.getUTCMonth() - birth.getUTCMonth();
    if (m < 0 || (m === 0 && todayUtc.getUTCDate() < birth.getUTCDate())) {
      age--;
    }
    return age >= 60;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
