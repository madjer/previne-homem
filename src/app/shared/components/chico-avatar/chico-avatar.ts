import { Component, Input } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-chico-avatar',
  standalone: true,
  template: `
    <div class="flex items-center gap-3 p-3 bg-white rounded-xl shadow">
      <img src="seuchico.png" class="w-14 h-14 rounded-full">
      <p class="text-sm text-blue-900 font-medium">
        {{ mensagem }}
      </p>
    </div>
  `
})
export class ChicoAvatarComponent {

  @Input() frase = 'Bora se cuidar, parceiro?';
  mensagem = this.frase;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, user => {
      if (user?.displayName) {
        const nome = user.displayName.split(' ')[0];
        this.mensagem = `E aí, ${nome}? Bora se cuidar hoje?`;
      } else {
        this.mensagem = this.frase;
      }
    });
  }
}
