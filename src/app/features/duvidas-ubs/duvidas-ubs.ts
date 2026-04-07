import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-duvidas-ubs',
  imports: [CommonModule, RouterModule],
  templateUrl: './duvidas-ubs.html',
})
export class DuvidasUbsComponent {

  ubsNome = localStorage.getItem('ubs_nome') || 'UBS Bom Jardim';
  ubsEndereco = 'Fortaleza, CE';

  servicos = ['Seg-Sex 7h-17h', 'Clínica geral', 'Vacinação', 'Exames'];

  agendarConsulta() {
    alert('Entre em contato com a UBS pelo telefone ou compareça pessoalmente para agendar sua consulta.');
  }

  verNoMapa() {
    const query = encodeURIComponent(this.ubsNome + ' ' + this.ubsEndereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }
}
