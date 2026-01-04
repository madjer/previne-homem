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
import { PerfilComponent } from './features/perfil/perfil';

export const routes: Routes = [
 { path: 'login', component: LoginComponent },

{ path: '', component: HomeComponent, canActivate: [authGuard] },
{ path: 'checkup', component: CheckupComponent, canActivate: [authGuard] },
{ path: 'corpo-exames', component: CorpoExamesComponent, canActivate: [authGuard] },
{ path: 'saude-sexual', component: SaudeSexualComponent, canActivate: [authGuard] },
{ path: 'mente', component: MenteEmocoesComponent, canActivate: [authGuard] },
{ path: 'habitos', component: HabitosComponent, canActivate: [authGuard] },
{ path: 'duvidas', component: DuvidasUbsComponent, canActivate: [authGuard] },
{ path: 'higiene-intima', component: HigieneIntimaComponent, canActivate: [authGuard] },
{ path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
];
