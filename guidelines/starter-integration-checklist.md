# Starter-Kit Integration Checklist

## Ziel
Sparc Light bleibt das Hauptprojekt (Vue 3 + Vite).  
Der Starter dient als Quelle für Codex-Workflow und wiederverwendbare Bausteine.

## Bereits integriert
- `_starter_import/codex-starter-kit-vue/` als lokaler Snapshot des Starter-Repos.
- `.codex/` aus dem Starter im Hauptprojekt übernommen.
- PrimeVue-Basis installiert (`primevue`, `@primeuix/themes`, `chart.js`).
- PrimeVue in `src/main.ts` registriert.

## Bewusst noch nicht übernommen
- Nuxt-spezifische Dateien (`nuxt.config.ts`, `pages/`, `app.vue` aus Starter).
- Starter-Teststack (`vitest`, `playwright`) und ESLint-Migration.
- Starter-`AGENTS.md` (Projekt nutzt eigene AGENTS-Regeln).

## Nächste sichere Merge-Blöcke
1. Teststack angleichen (optional): Vitest/Playwright aus Starter übernehmen.
2. Linting angleichen (optional): ESLint-basierten Flow ergänzen.
3. UI-Migration in kleinen Schritten: einzelne PrimeVue-Komponenten im Wizard ersetzen.

## Finder-Orientierung
- Hauptprojekt: `/Users/maxsteinwender/Documents/Codex Projects/Sparc Light POC`
- Starter-Snapshot im Hauptprojekt: `/Users/maxsteinwender/Documents/Codex Projects/Sparc Light POC/_starter_import/codex-starter-kit-vue`
- Direkt übernommener Codex-Workflow: `/Users/maxsteinwender/Documents/Codex Projects/Sparc Light POC/.codex`
