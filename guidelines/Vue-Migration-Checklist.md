# Vue-Migrationscheckliste (Sparc Light MVP)

Stand: 2026-02-10 (aktualisiert)  
Projektbasis: Vite + React + Tailwind (aktueller Zustand)

## Zieldefinition

- [x] Ziel festlegen: nur "buildbar in Vue" oder "vollständige 1:1-Funktionsparität"
- [ ] Akzeptanzkriterien festhalten:
  - [x] Wizard-Flow Schritt 1-5 funktioniert
  - [x] Ergebnisberechnung ist identisch
  - [x] EmailJS-Versand funktioniert weiterhin
  - [x] `npm run dev` und `npm run build` laufen ohne Fehler

## Phase 0: Vorbereitung

- [ ] Baseline sichern (Screenshot/Video der aktuellen React-App für visuelle Referenz)
- [ ] Kritische User-Flows dokumentieren:
  - [ ] Ziel auswählen
  - [ ] Betrag eingeben
  - [ ] Laufzeit wählen
  - [ ] Ergebnis inkl. Diagramm/Interpretation prüfen
  - [ ] E-Mail versenden
- [ ] Bestehende Umgebungsvariablen prüfen (`.env`, `.env.example`)

## Phase 1: Build- und Runtime-Setup auf Vue umstellen

- [x] Abhängigkeiten ergänzen:
  - [x] `vue`
  - [x] `@vitejs/plugin-vue`
  - [x] `vue-tsc` (für Type-Checks)
  - [x] optional: `pinia` (State-Management)
- [x] `vite.config.ts` umstellen:
  - [x] React-Plugin entfernen
  - [x] Vue-Plugin eintragen
  - [x] Tailwind-Plugin beibehalten
- [x] Entry Point migrieren:
  - [x] `src/main.tsx` -> `src/main.ts`
  - [x] `createApp(App).mount('#root')`
- [x] Root-Komponente erstellen (`App.vue` oder `src/app/App.vue` als SFC)

Abnahme:
- [x] Minimale Vue-Seite rendert lokal mit `npm run dev`
  - Lokal bestätigt (User-Run am 2026-02-10).

## Phase 2: State und App-Architektur migrieren

- [x] `WizardContext.tsx` ersetzen:
  - [x] Variante A: Pinia Store
  - [ ] Variante B: `provide/inject` + Composable
- [x] Rechenlogik aus UI lösen (framework-neutrale TS-Utilities)
- [x] Formularzustände und Validierungskonzept festlegen

Abnahme:
- [x] Globaler Wizard-State ist in Vue zentral verfügbar
  - Implementiert mit `src/app/stores/wizard.ts` und `src/app/composables/useWizard.ts`.
  - Validierungsansatz: zentrale Guards in `src/app/domain/wizardValidation.ts` + defensive Berechnung in `src/app/domain/savingsPlan.ts`.

## Phase 3: Komponenten nach Priorität portieren

Reihenfolge:
- [x] 1. `MainLayout` + Shell
- [x] 2. `Step1_GoalSelection`
- [x] 3. `Step2_TargetAmountType`
- [x] 4. `Step3_CalculateAmount`
- [x] 5. `Step4_Duration`
- [x] 6. `Step5_Results`
- [x] 7. Spezialkomponenten (`GoalCarousel3D`, `NumericInputStepper`, `ImageWithFallback`)

Für jede Komponente:
- [x] TSX nach Vue SFC (`<script setup lang="ts">`) portieren
- [x] Props/Events/State auf Vue-Patterns umstellen
- [x] Styling und Responsiveness visuell mit Baseline vergleichen

Abnahme:
- [x] Jeder Schritt isoliert testbar und funktionsgleich

## Phase 4: React-only UI-Libraries ersetzen

Aktuell sind viele `@radix-ui/react-*` und weitere React-Pakete im Einsatz. Diese müssen ersetzt werden.

Empfohlene Migration:
- [x] `@radix-ui/react-*` im aktiven Vue-Flow entfernt
- [x] `@headlessui/react` im aktiven Vue-Flow entfernt
- [x] `lucide-react` im aktiven Vue-Flow entfernt (Icon-Tokens statt React-Icon-Komponenten)
- [x] `react-hook-form` im aktiven Vue-Flow entfernt
- [x] `embla-carousel-react` im aktiven Vue-Flow entfernt
- [x] `react-day-picker` im aktiven Vue-Flow entfernt
- [x] `recharts` im aktiven Vue-Flow entfernt
- [x] `react-dnd` im aktiven Vue-Flow entfernt

Statusnotiz:
- [x] Aktiver Vue-Flow (Schritt 1-5) ist von React-Runtime-Libraries entkoppelt.
- [x] Alte React-Quell-Dateien (`*.tsx`) wurden entfernt.

Abnahme:
- [x] Keine React-Imports mehr in `src/`

## Phase 5: Styling, Assets, Nebenfunktionen

- [x] Tailwind/CSS-Dateien unverändert weiterverwenden (`src/styles/*`)
- [x] Asset-Pfade und Alias `@` prüfen
- [x] EmailJS-Service (`src/app/services/email.ts`) in Vue-Flow integrieren
- [x] PDF/Canvas-Funktionen (`jspdf`, `html2canvas`) in Vue-Events integriert

Abnahme:
- [x] Ergebnisansicht inkl. Export/Versand funktioniert wie zuvor

## Phase 6: Aufräumen und Konsolidieren

- [x] Nicht mehr benötigte React-Dateien entfernen (`*.tsx`, falls vollständig ersetzt)
- [x] React-Pakete aus `package.json` entfernen:
  - [x] `react`, `react-dom`, `@vitejs/plugin-react`
  - [x] übrige `*-react` Pakete nach tatsächlicher Nutzung
- [x] Lockfile aktualisieren (`npm install`)

Abnahme:
- [x] `npm ls react` liefert keine produktiv genutzte React-Abhängigkeit

## Phase 7: Qualitätssicherung

- [x] `npm run dev` prüfen
- [x] `npm run build` prüfen
- [x] Technischer Smoke-Check in Codex (Dev-Start + HTTP-200 + Build) durchgeführt
- [x] Manuelle Regressionstests gegen Baseline
- [ ] Optional: Smoke-Tests (Vitest/Cypress/Playwright) ergänzen

Hinweis:
- Einfacher Ablauf für Terminal und Build-Prüfung: `guidelines/Terminal-Runbook.md`
- Detailliertes Testprotokoll: `guidelines/Regression-Test-Protocol.md`

Abnahme:
- [x] Vue-Branch ist deploybar und funktional gleichwertig

## Konkrete Start-Tasks (empfohlen)

- [x] 1. Vue-Setup (Phase 1) umsetzen
- [x] 2. Wizard-State (`WizardContext`) nach Pinia migrieren
- [x] 3. Schritt 1-5 ohne UI-Library-Refactor portieren
- [x] 4. Danach UI-Bibliotheken iterativ ersetzen
