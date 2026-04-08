import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

const markerIcon = L.icon({
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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './duvidas-ubs.html',
})
export class DuvidasUbsComponent implements AfterViewInit, OnDestroy {

  cep = '';
  buscando = false;
  erroCep = '';

  ubsNome = localStorage.getItem('ubs_nome') || '';
  ubsEndereco = localStorage.getItem('ubs_endereco') || '';
  ubsMapsUrl = localStorage.getItem('ubs_maps_url') || '';
  ubsEncontrada = !!this.ubsNome;

  servicos = ['Seg-Sex 7h-17h', 'Clínica geral', 'Vacinação', 'Exames'];

  private mapa: L.Map | null = null;
  private marcadorUbs: L.Marker | null = null;
  private circuloCep: L.Circle | null = null;

  // Coordenadas padrão: Fortaleza-CE
  private readonly LAT_PADRAO = -3.7326;
  private readonly LON_PADRAO = -38.5270;

  ngAfterViewInit() {
    this.inicializarMapa();
  }

  ngOnDestroy() {
    this.mapa?.remove();
  }

  private inicializarMapa() {
    const el = document.getElementById('mapa-ubs');
    if (!el) return;

    const coords = localStorage.getItem('ubs_coords');

    if (coords) {
      const [lat, lon] = coords.split(',').map(Number);
      this.criarMapa(lat, lon, 15);
      this.adicionarMarcadorUbs(lat, lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.criarMapa(pos.coords.latitude, pos.coords.longitude, 14);
        },
        () => {
          this.criarMapa(this.LAT_PADRAO, this.LON_PADRAO, 13);
        },
        { timeout: 5000 }
      );
    } else {
      this.criarMapa(this.LAT_PADRAO, this.LON_PADRAO, 13);
    }
  }

  private criarMapa(lat: number, lon: number, zoom: number) {
    const el = document.getElementById('mapa-ubs');
    if (!el || this.mapa) return;

    this.mapa = L.map(el, { zoomControl: true, attributionControl: false })
      .setView([lat, lon], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.mapa);
  }

  private adicionarMarcadorUbs(lat: number, lon: number) {
    if (!this.mapa) return;

    this.marcadorUbs?.remove();
    this.marcadorUbs = L.marker([lat, lon], { icon: markerIcon })
      .addTo(this.mapa)
      .bindPopup(`<b>${this.ubsNome || 'UBS'}</b><br><span style="font-size:12px">${this.ubsEndereco}</span>`)
      .openPopup();
  }

  async buscarUbsPorCep() {
    const cepLimpo = this.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      this.erroCep = 'Informe um CEP válido com 8 dígitos.';
      return;
    }

    this.erroCep = '';
    this.buscando = true;

    try {
      // 1. ViaCEP → endereço textual
      const viaCepRes = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dadosCep = await viaCepRes.json();

      if (dadosCep.erro) {
        this.erroCep = 'CEP não encontrado. Verifique e tente novamente.';
        return;
      }

      // 2. Nominatim → coordenadas do CEP
      const enderecoQuery = [dadosCep.logradouro, dadosCep.bairro, dadosCep.localidade, dadosCep.uf]
        .filter(Boolean).join(', ');

      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoQuery)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const nomData = await nomRes.json();

      let origemLat = this.LAT_PADRAO;
      let origemLon = this.LON_PADRAO;

      if (nomData.length > 0) {
        origemLat = parseFloat(nomData[0].lat);
        origemLon = parseFloat(nomData[0].lon);
      }

      // 3. Overpass → UBS mais próxima (raio 5km, timeout 8s)
      const overpassQuery = `[out:json][timeout:8];(node["amenity"~"clinic|health_post"]["name"~"UBS|Unidade Básica|UBSF|ESF",i](around:5000,${origemLat},${origemLon});way["amenity"~"clinic|health_post"]["name"~"UBS|Unidade Básica|UBSF|ESF",i](around:5000,${origemLat},${origemLon}););out center 5;`;

      const abort = new AbortController();
      const timer = setTimeout(() => abort.abort(), 9000);

      let ubsLat = origemLat;
      let ubsLon = origemLon;
      let ubsNomeEncontrado = `UBS - ${dadosCep.localidade}`;
      let ubsEnderecoEncontrado = `${dadosCep.bairro}, ${dadosCep.localidade} - ${dadosCep.uf}`;

      try {
        const overpassRes = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: overpassQuery,
          signal: abort.signal,
        });
        clearTimeout(timer);
        const overpassData = await overpassRes.json();

        if (overpassData.elements?.length > 0) {
          const el = overpassData.elements[0];
          ubsLat = el.lat ?? el.center?.lat ?? origemLat;
          ubsLon = el.lon ?? el.center?.lon ?? origemLon;
          ubsNomeEncontrado = el.tags?.name || ubsNomeEncontrado;
          ubsEnderecoEncontrado = [
            el.tags?.['addr:street'],
            el.tags?.['addr:housenumber'],
            el.tags?.['addr:suburb'] || dadosCep.bairro,
            dadosCep.localidade,
          ].filter(Boolean).join(', ') || ubsEnderecoEncontrado;
        }
      } catch {
        clearTimeout(timer);
        // Overpass falhou → usa coordenadas do CEP
      }

      this.ubsNome = ubsNomeEncontrado;
      this.ubsEndereco = ubsEnderecoEncontrado;
      this.ubsMapsUrl = `https://www.google.com/maps/search/?api=1&query=${ubsLat},${ubsLon}`;
      this.ubsEncontrada = true;

      localStorage.setItem('ubs_nome', this.ubsNome);
      localStorage.setItem('ubs_endereco', this.ubsEndereco);
      localStorage.setItem('ubs_coords', `${ubsLat},${ubsLon}`);
      localStorage.setItem('ubs_maps_url', this.ubsMapsUrl);

      // Atualiza mapa
      this.circuloCep?.remove();
      this.adicionarMarcadorUbs(ubsLat, ubsLon);

      if (this.mapa) {
        this.circuloCep = L.circle([origemLat, origemLon], {
          radius: 100,
          color: '#0e7490',
          fillColor: '#a5f3fc',
          fillOpacity: 0.4,
          weight: 2,
        }).addTo(this.mapa).bindPopup('Sua localização (CEP)');

        const bounds = L.latLngBounds([[ubsLat, ubsLon], [origemLat, origemLon]]);
        this.mapa.fitBounds(bounds, { padding: [50, 50] });
      }

    } catch {
      this.erroCep = 'Erro ao buscar. Verifique sua conexão e tente novamente.';
    } finally {
      this.buscando = false;
    }
  }

  verNoMaps() {
    const url = this.ubsMapsUrl
      || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.ubsNome + ' ' + this.ubsEndereco)}`;
    window.open(url, '_blank');
  }

  agendarConsulta() {
    alert('Entre em contato com a UBS pelo telefone ou compareça pessoalmente para agendar sua consulta.');
  }
}
