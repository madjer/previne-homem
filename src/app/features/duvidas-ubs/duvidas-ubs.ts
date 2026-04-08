import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';

// Fix Leaflet default marker icons with Webpack/Angular
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

@Component({
  standalone: true,
  selector: 'app-duvidas-ubs',
  imports: [CommonModule, RouterModule],
  templateUrl: './duvidas-ubs.html',
})
export class DuvidasUbsComponent implements AfterViewInit, OnDestroy {

  ubsNome = localStorage.getItem('ubs_nome') || 'UBS Bom Jardim';
  ubsEndereco = 'Fortaleza, CE';

  servicos = ['Seg-Sex 7h-17h', 'Clínica geral', 'Vacinação', 'Exames'];

  mapaCarregado = false;
  mapaErro = false;

  private mapa: L.Map | null = null;

  ngAfterViewInit() {
    this.inicializarMapa();
  }

  ngOnDestroy() {
    this.mapa?.remove();
  }

  private async inicializarMapa() {
    const query = `${this.ubsNome} ${this.ubsEndereco}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    try {
      const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
      const data = await res.json();

      let lat = -3.7326;
      let lon = -38.5270;

      if (data.length > 0) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      }

      this.renderizarMapa(lat, lon);
    } catch {
      // Fallback para coordenadas de Fortaleza
      this.renderizarMapa(-3.7326, -38.5270);
    }
  }

  private renderizarMapa(lat: number, lon: number) {
    const el = document.getElementById('mapa-ubs');
    if (!el) return;

    this.mapa = L.map(el, { zoomControl: true, attributionControl: false }).setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.mapa);

    L.marker([lat, lon], { icon: iconDefault })
      .addTo(this.mapa)
      .bindPopup(`<b>${this.ubsNome}</b><br>${this.ubsEndereco}`)
      .openPopup();

    this.mapaCarregado = true;
  }

  agendarConsulta() {
    alert('Entre em contato com a UBS pelo telefone ou compareça pessoalmente para agendar sua consulta.');
  }

  verNoMapa() {
    const query = encodeURIComponent(this.ubsNome + ' ' + this.ubsEndereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }
}
