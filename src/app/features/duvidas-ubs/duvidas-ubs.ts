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

export interface Ubs {
  nome: string;
  endereco: string;
  lat: number;
  lon: number;
}

export interface RegiaoUbs {
  regiao: string;
  unidades: Ubs[];
}

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

  servicos = ['Seg-Sex 8h-16h', 'Clínica geral', 'Vacinação', 'Exames'];

  private mapa: L.Map | null = null;
  private marcadorUbs: L.Marker | null = null;
  private circuloCep: L.Circle | null = null;
  private marcadoresFixos: L.Marker[] = [];

  // Centro padrão: Caucaia-CE
  private readonly LAT_PADRAO = -3.7329;
  private readonly LON_PADRAO = -38.6534;

  regioes: RegiaoUbs[] = [
    {
      regiao: 'Tabapuá / Potira / Araturi',
      unidades: [
        { nome: 'UBS Afonso de Medeiros',              endereco: 'Rua 5 – Tabapuá',                              lat: -3.7218, lon: -38.5952 },
        { nome: 'UBS Dr. Francisco Djalma Soares',     endereco: 'Quadra 49 – Tabapuazinho',                     lat: -3.7241, lon: -38.5978 },
        { nome: 'UBS Ednir Carneiro Galeno',           endereco: 'Rua Potiguar – Potira I',                      lat: -3.7275, lon: -38.6008 },
        { nome: 'UBS Giselda Magalhães Bezerra',       endereco: 'Rua Paracatu – Potira II',                     lat: -3.7298, lon: -38.6031 },
        { nome: 'UBS Eduardo Nogueira Jr',             endereco: 'Rua Solimões – Arianópolis',                   lat: -3.7321, lon: -38.6055 },
        { nome: 'UBS Antônio Jander Pereira Machado',  endereco: 'Av. Central Oeste, s/n – Araturi',             lat: -3.7102, lon: -38.6628 },
      ],
    },
    {
      regiao: 'Jurema / Parque Soledade / Guadalajara',
      unidades: [
        { nome: 'UBS Célia Nascimento',                endereco: 'Rua Rita Barbosa Lima – Jardim Icaraí',        lat: -3.7372, lon: -38.6121 },
        { nome: 'UBS Francisca Carlota de Matos',      endereco: 'Rua Acapulco – Guadalajara',                   lat: -3.7421, lon: -38.6198 },
        { nome: 'UBS Francisca de Fátima L. da Costa', endereco: 'Rua Araquém – Guadalajara',                    lat: -3.7451, lon: -38.6170 },
        { nome: 'UBS Francisco Paulo Pontes',          endereco: 'Av. Dom Almeida Lustosa – Marechal Rondon',    lat: -3.7482, lon: -38.6302 },
        { nome: 'UBS Terezinha Lima Moreira',          endereco: 'Rua Paulo Gomes da Silva, 177 – Parque Soledade', lat: -3.7511, lon: -38.6251 },
      ],
    },
    {
      regiao: 'Centro / Genipabu / Marechal Rondon',
      unidades: [
        { nome: 'UBS Centro de Integração Infantil (CIDI)',        endereco: 'Rua Nova Alvorada – Marechal Rondon',       lat: -3.7501, lon: -38.6321 },
        { nome: 'UBS Centro de Saúde dos Índios Tapebas (CESIT)', endereco: 'Rua Juacy Pontes – Padre Júlio Maria',      lat: -3.7401, lon: -38.6381 },
        { nome: 'UBS João Rodrigues da Silva',                     endereco: 'Rua Coronel Correia – Genipabu',           lat: -3.7158, lon: -38.6721 },
        { nome: 'UBS Lar Fabiano de Cristo',                       endereco: 'Av. Dom Almeida Lustosa – Marechal Rondon', lat: -3.7471, lon: -38.6281 },
      ],
    },
    {
      regiao: 'Sítios Novos / Tabuba / Litoral',
      unidades: [
        { nome: 'UBS João Marcolino de Oliveira', endereco: 'Rua Central – Sítios Novos',              lat: -3.7201, lon: -38.7125 },
        { nome: 'UBS José Rodrigues dos Santos',  endereco: 'Rua Central, s/n – Tabuba / Parazinho',   lat: -3.7121, lon: -38.7218 },
        { nome: 'UBS Ernandes Pires de Sousa',    endereco: 'Rua Pintor João Figueiredo, s/n – Iparana', lat: -3.7038, lon: -38.7301 },
      ],
    },
    {
      regiao: 'Cauípe / Zona Rural',
      unidades: [
        { nome: 'UBS Inácio Monteiro Gondim',   endereco: 'BR-222 – Catuana',                               lat: -3.7718, lon: -38.7452 },
        { nome: 'UBS José Maria Marques',       endereco: 'Rod. Raimundo Pessoa de Araújo – Carauçanga',    lat: -3.7845, lon: -38.7538 },
        { nome: 'UBS Júlia Pessoa de Araújo',   endereco: 'Rod. Raimundo Pessoa de Araújo – Mirambé',       lat: -3.7921, lon: -38.7601 },
        { nome: 'UBS Planalto Cauípe',          endereco: 'Rua Jerusalém – Planalto Cauípe',                lat: -3.7688, lon: -38.7612 },
        { nome: 'UBS Polo Base do Trilho',      endereco: 'BR-222 – Jandaiguaba',                           lat: -3.7632, lon: -38.7658 },
        { nome: 'UBS Reserva Taba Anacé',       endereco: 'CE-085 km 13 – Alto do Garrote',                 lat: -3.7401, lon: -38.7821 },
      ],
    },
    {
      regiao: 'Outras UBS',
      unidades: [
        { nome: 'UBS Luiz Costa Oliveira',           endereco: 'Rua Chagas Miguel, 927 – Capuan',        lat: -3.7142, lon: -38.6882 },
        { nome: 'UBS Manuel Gomes da Silva',         endereco: 'Rua Alaide Mateus – Tôco',               lat: -3.7201, lon: -38.6831 },
        { nome: 'UBS Maria de Jesus Ferreira',       endereco: 'Rua Marcos Couto Bezerra – Picuí',       lat: -3.7251, lon: -38.6778 },
        { nome: 'UBS Maria de Lourdes Gomes Dantas', endereco: 'Rua dos Córregos – Parque Albano',       lat: -3.7288, lon: -38.6741 },
        { nome: 'UBS Lagoa dos Tapebas',             endereco: 'Rua Coronel Alfredo Miranda – Capuan',   lat: -3.7118, lon: -38.6901 },
        { nome: 'UBS Antônio Brasileiro',            endereco: 'Caucaia',                                lat: -3.7329, lon: -38.6534 },
        { nome: 'UBS Assistência à Criança (CAIC)',  endereco: 'Caucaia',                                lat: -3.7348, lon: -38.6552 },
        { nome: 'UBS Dr. Joaquim Braga',             endereco: 'Planalto Caucaia',                       lat: -3.7365, lon: -38.6578 },
        { nome: 'UBS Dr. Renato Braga',              endereco: 'BR-020 km 28 – Bom Princípio',           lat: -3.7412, lon: -38.6348 },
      ],
    },
  ];

  get todasUnidades(): Ubs[] {
    return this.regioes.flatMap(r => r.unidades);
  }

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
      this.criarMapa(lat, lon, 13);
      this.adicionarMarcadorUbs(lat, lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.criarMapa(pos.coords.latitude, pos.coords.longitude, 13);
        },
        () => {
          this.criarMapa(this.LAT_PADRAO, this.LON_PADRAO, 12);
        },
        { timeout: 5000 }
      );
    } else {
      this.criarMapa(this.LAT_PADRAO, this.LON_PADRAO, 12);
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

    this.adicionarMarcadoresFixos();
  }

  private adicionarMarcadoresFixos() {
    if (!this.mapa) return;

    for (const ubs of this.todasUnidades) {
      const m = L.marker([ubs.lat, ubs.lon], { icon: markerIcon })
        .addTo(this.mapa)
        .bindPopup(`<b style="font-size:13px">${ubs.nome}</b><br><span style="font-size:11px;color:#555">${ubs.endereco}</span>`);
      this.marcadoresFixos.push(m);
    }
  }

  private adicionarMarcadorUbs(lat: number, lon: number) {
    if (!this.mapa) return;

    this.marcadorUbs?.remove();
    this.marcadorUbs = L.marker([lat, lon], { icon: markerIcon })
      .addTo(this.mapa)
      .bindPopup(`<b>${this.ubsNome || 'UBS'}</b><br><span style="font-size:12px">${this.ubsEndereco}</span>`)
      .openPopup();
  }

  focarUbs(ubs: Ubs) {
    if (!this.mapa) return;
    this.mapa.setView([ubs.lat, ubs.lon], 16);
    const idx = this.todasUnidades.indexOf(ubs);
    if (idx >= 0 && this.marcadoresFixos[idx]) {
      this.marcadoresFixos[idx].openPopup();
    }
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
      const viaCepRes = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dadosCep = await viaCepRes.json();

      if (dadosCep.erro) {
        this.erroCep = 'CEP não encontrado. Verifique e tente novamente.';
        return;
      }

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

      // Encontra a UBS mais próxima da lista fixa
      let ubsMaisProxima = this.todasUnidades[0];
      let menorDistancia = Infinity;
      for (const u of this.todasUnidades) {
        const d = Math.hypot(u.lat - origemLat, u.lon - origemLon);
        if (d < menorDistancia) { menorDistancia = d; ubsMaisProxima = u; }
      }

      this.ubsNome = ubsMaisProxima.nome;
      this.ubsEndereco = ubsMaisProxima.endereco;
      this.ubsMapsUrl = `https://www.google.com/maps/search/?api=1&query=${ubsMaisProxima.lat},${ubsMaisProxima.lon}`;
      this.ubsEncontrada = true;

      localStorage.setItem('ubs_nome', this.ubsNome);
      localStorage.setItem('ubs_endereco', this.ubsEndereco);
      localStorage.setItem('ubs_coords', `${ubsMaisProxima.lat},${ubsMaisProxima.lon}`);
      localStorage.setItem('ubs_maps_url', this.ubsMapsUrl);

      this.circuloCep?.remove();
      this.adicionarMarcadorUbs(ubsMaisProxima.lat, ubsMaisProxima.lon);

      if (this.mapa) {
        this.circuloCep = L.circle([origemLat, origemLon], {
          radius: 100,
          color: '#0e7490',
          fillColor: '#a5f3fc',
          fillOpacity: 0.4,
          weight: 2,
        }).addTo(this.mapa).bindPopup('Sua localização (CEP)');

        const bounds = L.latLngBounds([[ubsMaisProxima.lat, ubsMaisProxima.lon], [origemLat, origemLon]]);
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
