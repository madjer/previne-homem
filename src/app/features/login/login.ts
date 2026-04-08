import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  name = '';
  isLoading = false;
  errorMessage = '';
  isIOS = false;
  isAndroid = false;
  isDesktop = false;
  modo: 'login' | 'cadastro' = 'login';

  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    const ua = navigator.userAgent || '';
    this.isIOS = /iPad|iPhone|iPod/.test(ua);
    this.isAndroid = /Android/.test(ua);
    this.isDesktop = !this.isIOS && !this.isAndroid;

    const m = this.route.snapshot.queryParamMap.get('modo');
    if (m === 'cadastro') this.modo = 'cadastro';
  }

  loginWithEmailPassword() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Informe e-mail e senha.';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.auth.loginEmailPassword(this.email, this.password)
      .catch(() => {
        this.errorMessage = 'E-mail ou senha invalidos.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  registerWithEmailPassword() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Informe e-mail e senha.';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.auth.registerEmailPassword(this.email, this.password)
      .catch(() => {
        this.errorMessage = 'Nao foi possivel criar a conta.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loginGoogle() { this.auth.loginGoogle(); }
}
