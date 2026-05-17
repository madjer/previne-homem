import { Component } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  route: string;
  label: string;
  icon: string;
  exact: boolean;
}

@Component({
  standalone: true,
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule, RouterLinkActive],
  template: `
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom"
    style="padding-bottom: env(safe-area-inset-bottom)">
    <div class="flex items-stretch max-w-lg mx-auto">
      <a *ngFor="let item of items"
        [routerLink]="item.route"
        routerLinkActive="nav-active"
        [routerLinkActiveOptions]="{ exact: item.exact }"
        class="nav-item flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 transition-colors">
        <span class="nav-icon text-xl leading-none" [innerHTML]="item.icon"></span>
        <span class="text-[10px] font-semibold leading-none tracking-tight">{{ item.label }}</span>
      </a>
    </div>
  </nav>
  `,
  styles: [`
    .nav-item { color: #9ca3af; min-height: 56px; }
    .nav-item.nav-active { color: #1976d2; }
    .nav-item.nav-active .nav-icon { transform: scale(1.1); }
    .nav-icon { transition: transform 0.15s ease; }
  `]
})
export class NavBarComponent {
  items: NavItem[] = [
    { route: '/',          label: 'Início',    icon: '🏠', exact: true  },
    { route: '/lembretes', label: 'Alertas',   icon: '🔔', exact: false },
    { route: '/lojinha',   label: 'Lojinha',   icon: '⭐', exact: false },
    { route: '/minha-ubs', label: 'Minha UBS', icon: '🏥', exact: false },
    { route: '/perfil',    label: 'Perfil',    icon: '👤', exact: false },
  ];
}
