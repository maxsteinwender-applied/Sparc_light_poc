# Regression-Testprotokoll (Vue-Migration)

Stand: 2026-02-10

## Technischer Smoke-Check (bereits erfolgt)

- [x] `npm run build` erfolgreich
- [x] `npm run dev` startet
- [x] Dev-Server antwortet mit `HTTP 200` auf `http://127.0.0.1:4173/`

## Manueller Regressionstest (durchführen und abhaken)

## Setup

```bash
cd "/Users/maxsteinwender/Documents/Codex Projects/Sparc Light POC"
npm run dev
```

App im Browser öffnen:
- `http://127.0.0.1:3000/` (oder die URL aus dem Terminal)

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

- [x] Hero sichtbar inkl. Headline, Top-Aktionen, Monatsraten-KPI
- [x] Renditekarten (Option A/B/C + Individuelle Rendite) umschalten
- [x] Steckbriefkarte: Zielbetrag/Laufzeit inline bearbeiten
- [x] Tab-Logik prüfen (`Übersicht`, `Optimierung`, `Umsetzung`)
- [x] "Wie setzt sich der Zielbetrag zusammen?" öffnet/schließt Modal

Erwartung:
- Werte reagieren plausibel auf Laufzeit/Strategie.

## Testfall 6: PDF-Export

- [x] "Als PDF herunterladen" klicken
- [x] Datei wird heruntergeladen
- [x] PDF-Inhalt ist lesbar und enthält Kerndaten
- [x] PDF enthält DK-Rot-Branding, Titel "Ihr persönlicher Vorsparplan" und prominente Sparrate
- [x] PDF enthält Ergebnis-Link und QR-Code mit identischem Ziel
- [x] PDF enthält "Ihre nächsten Schritte", Kontakt-Platzhalter und rechtliche Hinweise (vorläufig)

Erwartung:
- Kein Fehlerdialog.
- QR-Code und ausgeschriebener Link öffnen die Ergebnisseite mit derselben Konfiguration.

## Testfall 7: Link-Kopie und Top-Aktionen

- [x] "Link kopieren" klicken
- [x] Erfolgsmeldung erscheint
- [x] Kopierter Link enthält `goal`, `target`, `years`, `strategy` und ggf. `rate`
- [x] Kopierten Link in neuem Tab öffnen

Erwartung:
- Ergebnisansicht wird mit derselben Konfiguration wiederhergestellt.

## Abschluss

- [x] `npm run build` nach manuellem Test erneut grün
- [x] Keine Blocker in Console sichtbar
