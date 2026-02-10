# Terminal-Runbook (einfach)

## 1) In den Projektordner wechseln

```bash
cd "/Users/maxsteinwender/Documents/Codex Projects/Sparc Light MVP"
```

## 2) Dev-Server starten

```bash
npm run dev
```

Erwartung:
- Es erscheint `VITE ... ready`.
- Es erscheint `Local: http://localhost:5173/`.

## 3) App im Browser pruefen

- `http://localhost:5173/` oeffnen.
- Wizard Schritt 1 bis 5 einmal durchklicken.
- In Schritt 5 pruefen:
  - PDF-Button sichtbar.
  - E-Mail-Button sichtbar.

## 4) Dev-Server stoppen

- Im selben Terminal `Ctrl + C` druecken.
- Erst danach weitere npm-Kommandos im selben Terminal ausfuehren.

## 5) Produktions-Build testen

```bash
npm run build
```

Build ist "gruen", wenn:
- Keine Zeile mit `error` erscheint.
- Am Ende `built in ...` erscheint.
- Danach wieder normaler Prompt sichtbar ist.

## 6) Wenn `npm`/`node` fehlt

```bash
source ~/.zshrc
which node && node -v
which npm && npm -v
```

Wenn hier nichts ausgegeben wird, ist Node in der aktuellen Shell nicht geladen.
