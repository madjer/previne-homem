import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../core/services/gamification';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {

  nomeUsuario = '';
  pontos = 0;

  menuItems = [
    { label: 'Meu Check-up',        icon: '🩺', route: '/checkup',          destaque: false },
    { label: 'Meu Resultado',       icon: '📊', route: '/resultado-checkup', destaque: true  },
    { label: 'Minha Saúde',         icon: '❤️', route: '/minha-saude',       destaque: false },
    { label: 'Aprender e Prevenir', icon: '📚', route: '/corpo-exames',      destaque: false },
    { label: 'Hábitos Saudáveis',   icon: '🏃', route: '/habitos',           destaque: false },
    { label: 'Saúde Mental',        icon: '🧠', route: '/mente',             destaque: false },
    { label: 'Dúvidas Rápidas',     icon: '❓', route: '/duvidas',           destaque: false },
    { label: 'Lembretes',           icon: '🔔', route: '/lembretes',         destaque: true  },
    { label: 'Minha UBS',           icon: '🏥', route: '/minha-ubs',         destaque: false },
  ];

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private game: GamificationService
  ) {}

  ngOnInit() {
    this.pontos = this.game.pontos;
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.nomeUsuario = user.displayName?.split(' ')[0] || '';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
