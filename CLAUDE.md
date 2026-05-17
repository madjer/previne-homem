# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Desenvolvimento
npm start                          # ng serve (http://localhost:4200)
npm run build                      # build de produção (dist/previne-homem)
npx ng build --configuration production

# Deploy
firebase deploy --only hosting     # publica em https://previne-homem.web.app

# Arquivos de ambiente (gitignored — copiar manualmente antes do build)
# Fonte: C:/workspace/previne-homem/src/environments/
cp ../../../src/environments/environment.ts src/environments/
cp ../../../src/environments/environment.prod.ts src/environments/
```

> Ao trabalhar no worktree (`.claude/worktrees/vigorous-mccarthy`), os arquivos `environment.ts` e `environment.prod.ts` estão em `.gitignore` e precisam ser copiados do diretório principal antes de cada build.

## Arquitetura

### Stack
- **Angular 20** — componentes standalone (sem NgModules), signals ainda não usados
- **Firebase** (Auth + Firestore) via `@angular/fire` — sem HTTP client próprio
- **Gemini AI** (`gemini-2.5-flash`) chamado via `fetch()` direto do frontend com `environment.geminiApiKey`
- **Tailwind CSS 3** — utilitários inline; paleta Novembro Azul (blue/gray)
- **localStorage** — persistência de pontos, eventos, alertas, streaks, resgates

### Estrutura de pastas
```
src/app/
  app.ts              # root: <router-outlet> + <app-nav-bar *ngIf="showNav">
  app.routes.ts       # todas as rotas com authGuard nas protegidas
  core/
    services/
      auth.service.ts         # login/cadastro/logout Firebase Auth
      gamification.ts         # pontos: add(), gastar(), pontos getter
      perfil.service.ts       # Firestore: salvar/obter perfil por UID
      historico.service.ts    # registrar eventos no histórico
      guards/auth.guard.ts    # redireciona /acesso se não autenticado
  features/
    acesso/     # tela de entrada (login/cadastro via Google ou e-mail)
    login/      # formulário e-mail+senha (modo 'login' | 'cadastro')
    boas-vindas/# onboarding inicial
    home/       # chatbot Gemini + header com pontos
    perfil/     # formulário de perfil de saúde (Firestore)
    lembretes/  # alertas automáticos gerados pelo perfil
    lojinha/    # resgatar recompensas com pontos + registrar atividades
    minha-ubs/  # duvidas-ubs (mapa + informações da UBS)
    checkup/    # questionário de saúde
    resultado-checkup/
    habitos/
    mente-emocoes/
    historico/
    prevencao/
    chatbot/    # chatbot standalone (alternativo ao home)
  shared/
    components/
      nav-bar/  # bottom navigation bar (5 abas)
```

### Navegação e Nav Bar

`app.ts` escuta `NavigationEnd` e exibe `<app-nav-bar>` somente em rotas autenticadas. Rotas públicas definidas em `PUBLIC_ROUTES = ['/login', '/acesso', '/boas-vindas']`.

`nav-bar.ts` — 5 abas fixadas no rodapé:
- **Início** → `/`
- **Alertas** → `/lembretes`
- **Lojinha** → `/lojinha`
- **Minha UBS** → `/minha-ubs`
- **Perfil** → `/perfil`

Usa `RouterLinkActive` com classe `.nav-active` (cor azul `#166534` substituída por azul UBS). Respeita `env(safe-area-inset-bottom)` para iPhone.

### Gamificação (GamificationService)

- `add(valor, descricao)` — adiciona pontos e registra no histórico
- `gastar(valor, descricao)` — subtrai pontos (resgate na lojinha)
- `pontos` — getter que lê `localStorage['previne_homem_pontos']`

Pontos por evento (chaves localStorage para idempotência):
| Evento | Pontos | Chave localStorage |
|---|---|---|
| Acesso diário | — | `acesso_<dateString>` |
| Sequência 7 dias | +25 | verificado em `home.ts` |
| Interação chatbot (1x/dia) | +5 | `chatbot_pontos_<dateString>` |
| Consulta na UBS (1x/mês) | +30 | `consulta_ubs_<YYYY_M>` |
| Exame preventivo (1x/mês) | +20 | `exame_prev_<YYYY_M>` |

### Chatbot (home.ts)

Chamada ao Gemini configurada com:
```typescript
generationConfig: {
  maxOutputTokens: 1024,
  temperature: 0.7,
  thinkingConfig: { thinkingBudget: 0 }  // desativa thinking p/ resposta rápida
}
```

`ChangeDetectorRef.detectChanges()` é chamado no bloco `finally` após a resposta assíncrona — necessário porque o `fetch()` escapa da zona Angular e o detector não atualiza a UI automaticamente.

O system prompt inclui o perfil completo do usuário (condições de saúde, hábitos, UBS de referência) obtido do Firestore via `PerfilService`.

### Alertas (lembretes.ts)

`gerarAlertas(perfil)` gera alertas baseados no perfil:
- Diabético → exame dos pés, glicemia, consulta
- Hipertenso → pressão arterial, consulta
- Fumante → programa de cessação
- 50+ anos → PSA
- 40+ anos → colesterol
- Sedentário → atividade física
- Universais → check-up, vacinação, saúde mental

### Lojinha (lojinha.ts)

Seção "Registrar atividade" com dois botões (desabilitam após uso mensal):
- Registrar consulta na UBS (+30 pts)
- Registrar exame preventivo (+20 pts)

Recompensas resgatáveis debitam pontos via `GamificationService.gastar()`. IDs resgatados persistidos em `localStorage['lojinha_resgatadas']`.

### Paleta de cores

Paleta **Novembro Azul** — substituição global de green/cyan/teal por blue:
- Fundos escuros: `bg-blue-900`, `bg-blue-800`
- Acentos: `bg-blue-600`, `text-blue-600`
- Gradientes inline: `linear-gradient(160deg, #0c1a2e 0%, #1e3a5f 60%, #1565c0 100%)`
- Pontos: `bg-yellow-400 text-yellow-900`
- Cores semânticas mantidas: `red-*` (erros), `yellow-*` (pontos/alertas), `orange-*`/`purple-*`/`emerald-*` (lojinha)

### Observações importantes

- `environment.ts` e `environment.prod.ts` estão em `.gitignore` (contêm `geminiApiKey` e config Firebase)
- A rota `/minha-saude` redireciona para `/` (aba removida da nav bar)
- O worktree está no branch `claude/vigorous-mccarthy`; o branch principal é `main`
- Build gera aviso de budget (bundle > 1 MB) por causa do Leaflet — não é erro
