import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { CheckupComponent } from './features/checkup/checkup';
import { ResultadoCheckupComponent } from './features/resultado-checkup/resultado-checkup';
import { HigieneIntimaComponent } from './features/corpo-exames/higiene-intima/higiene-intima';
import { MenteEmocoesComponent } from './features/mente-emocoes/mente-emocoes';
import { HabitosComponent } from './features/habitos/habitos';
import { DuvidasUbsComponent } from './features/duvidas-ubs/duvidas-ubs';
import { SaudeSexualComponent } from './features/saude-sexual/saude-sexual';
import { CorpoExamesComponent } from './features/corpo-exames/corpo-exames';
import { authGuard } from './core/services/guards/auth.guard';
import { LoginComponent } from './features/login/login';
import { AcessoComponent } from './features/acesso/acesso';
import { PerfilComponent } from './features/perfil/perfil';
import { BoasVindasComponent } from './features/boas-vindas/boas-vindas';
import { LembretesComponent } from './features/lembretes/lembretes';
import { HistoricoComponent } from './features/historico/historico';
import { PrevencaoComponent } from './features/prevencao/prevencao';
import { ChatbotComponent } from './features/chatbot/chatbot';
import { LojinhaComponent } from './features/lojinha/lojinha';

export const routes: Routes = [
  { path: 'boas-vindas', component: BoasVindasComponent },
  { path: 'acesso',      component: AcessoComponent },
  { path: 'login',       component: LoginComponent },

  { path: '',                component: HomeComponent,             canActivate: [authGuard] },
  { path: 'checkup',         component: CheckupComponent,          canActivate: [authGuard] },
  { path: 'resultado-checkup', component: ResultadoCheckupComponent, canActivate: [authGuard] },
  { path: 'minha-saude',     redirectTo: '',                       pathMatch: 'full' },
  { path: 'habitos',         component: HabitosComponent,          canActivate: [authGuard] },
  { path: 'mente',           component: MenteEmocoesComponent,     canActivate: [authGuard] },
  { path: 'minha-ubs',       component: DuvidasUbsComponent,       canActivate: [authGuard] },
  { path: 'duvidas',         component: DuvidasUbsComponent,       canActivate: [authGuard] },
  { path: 'lembretes',       component: LembretesComponent,        canActivate: [authGuard] },
  { path: 'corpo-exames',    component: CorpoExamesComponent,      canActivate: [authGuard] },
  { path: 'saude-sexual',    component: SaudeSexualComponent,      canActivate: [authGuard] },
  { path: 'higiene-intima',  component: HigieneIntimaComponent,    canActivate: [authGuard] },
  { path: 'perfil',          component: PerfilComponent,           canActivate: [authGuard] },
  { path: 'historico',       component: HistoricoComponent,        canActivate: [authGuard] },
  { path: 'prevencao',       component: PrevencaoComponent,        canActivate: [authGuard] },
  { path: 'chatbot',         component: ChatbotComponent,          canActivate: [authGuard] },
  { path: 'lojinha',         component: LojinhaComponent,          canActivate: [authGuard] },
];
