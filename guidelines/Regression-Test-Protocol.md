# Regression-Testprotokoll (Vue-Migration)

Stand: 2026-02-10

## Technischer Smoke-Check (bereits erfolgt)

- [x] `npm run build` erfolgreich
- [x] `npm run dev` startet
- [x] Dev-Server antwortet mit `HTTP 200` auf `http://127.0.0.1:4173/`

## Manueller Regressionstest (durchführen und abhaken)

## Setup

```bash
cd "/Users/maxsteinwender/Documents/Codex Projects/Sparc Light MVP"
npm run dev
```

App im Browser öffnen:
- `http://localhost:5173/` (oder die URL aus dem Terminal)

## Testfall 1: Schritt 1 Zielauswahl

- [x] Ein Standardziel im Carousel wählen
- [x] CTA "Mit ... fortfahren" ist klickbar
- [x] "Individuelles Sparziel erstellen" öffnet Custom-Modus

Erwartung:
- Schrittwechsel auf Schritt 2 funktioniert.

## Testfall 2: Schritt 2 Zielbetrag

- [x] Zielbetrag direkt eingeben (Known Amount)
- [x] Weiter klicken
- [x] Zurück-Button prüfen

Erwartung:
- Betrag bleibt im State erhalten.
- Navigation Schritt 1 <-> 2 funktioniert.

## Testfall 3: Schritt 3 Berechnung/Schieber

- [x] Eingaben/Optionen verändern
- [x] Prüfen, ob Zielbetrag dynamisch neu berechnet wird
- [x] Weiter klicken

Erwartung:
- Rechenlogik reagiert ohne UI-Fehler.

## Testfall 4: Schritt 4 Laufzeit

- [x] Laufzeit mit `+`/`-` (Stepper) aendern
- [x] Weiter zu Schritt 5

Erwartung:
- Laufzeit wird korrekt uebernommen.

## Testfall 5: Schritt 5 Ergebnisansicht

- [x] Kennzahlen sichtbar (Sparrate, Laufzeit, Zielbetrag)
- [x] Strategieauswahl umschalten
- [x] Tabelle / Übersicht aktualisiert sich
- [x] "0 % Vergleich" ein-/ausblenden

Erwartung:
- Werte reagieren plausibel auf Laufzeit/Strategie.

## Testfall 6: PDF-Export

- [x] "PDF exportieren" klicken
- [x] Datei wird heruntergeladen
- [x] PDF-Inhalt ist lesbar und enthält Kerndaten

Erwartung:
- Kein Fehlerdialog.

## Testfall 7: E-Mail-Versand (nur wenn EmailJS konfiguriert)

Voraussetzung:
- `.env` enthält `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

- [x] "Ergebnis per E-Mail" öffnet Dialog
- [x] Ungültige E-Mail zeigt Validierungsfehler
- [x] Gültige E-Mail senden

Erwartung:
- Erfolgsfeedback wird angezeigt.
- Cooldown (30s) verhindert direktes Spammen.

## Abschluss

- [x] `npm run build` nach manuellem Test erneut grün
- [x] Keine Blocker in Console sichtbar
