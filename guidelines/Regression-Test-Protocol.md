# Regression-Testprotokoll (Vue-Migration)

Stand: 2026-02-25

## Technischer Smoke-Check

- [x] `npm run build` erfolgreich
- [x] `npm run dev` startet
- [x] `npm run typecheck` erfolgreich

## Manueller Regressionstest (durchfuehren und abhaken)

## Setup

```bash
cd "/Users/maxsteinwender/Documents/Codex Projects/Sparc Light POC"
npm run dev
```

App im Browser oeffnen:
- `http://127.0.0.1:3000/` (oder die URL aus dem Terminal)

## Testfall 1: Schritt 1 Zielauswahl

- [ ] Continue-CTA ist initial deaktiviert
- [ ] Ziel aktiv auswaehlen (Pfeile, Tap oder Swipe)
- [ ] Continue-CTA ist danach aktiv
- [ ] Karussell-Indikator zeigt Position korrekt

Erwartung:
- Schrittwechsel auf Schritt 2 funktioniert erst nach aktiver Auswahl.

## Testfall 2: Schritt 2 Zielbetrag (genau ein Weg)

- [ ] Direkten Weg aktivieren und Betrag im Feld mit Tausendertrennzeichen eingeben
- [ ] CTA "Mit diesem Betrag fortfahren" klicken
- [ ] Gefuehrten Weg aktivieren und CTA "Betrag ermitteln" pruefen
- [ ] Zurueck-Button auf Sichtbarkeit/Prioritaet pruefen

Erwartung:
- Es ist klar, dass genau ein Weg aktiv sein muss.
- Beide Wege fuehren nach Schritt 3.

## Testfall 3: Schritt 3 Berechnung/Schieber

- [ ] Eingaben/Optionen veraendern
- [ ] Pruefen, ob Zielbetrag dynamisch neu berechnet wird
- [ ] Continue-CTA "Weiter zur Laufzeit" klicken

Erwartung:
- Rechenlogik reagiert ohne UI-Fehler.
- Kriterienbezug aus Schritt 2 ist sichtbar/konsequent.

## Testfall 4: Schritt 4 Laufzeit

- [ ] Ein empfohlenes Zeitfenster waehlen
- [ ] Manuelle Anpassung via `+`/`-` pruefen
- [ ] Hinweis auf Auswirkung (Sparrate) pruefen
- [ ] Continue-CTA auf Aktivierung erst nach Moduswahl pruefen

Erwartung:
- Laufzeitweg ist eindeutig (Preset oder Stepper).
- Sparratenwirkung ist fuer Nutzer erkennbar.

## Testfall 5: Schritt 5 Ergebnisansicht

- [ ] Renditekarten A/B/C umschalten
- [ ] Individuelle Rendite aktivieren und Wert live anpassen
- [ ] Inline-Block "Wie setzt sich der Zielbetrag zusammen" sichtbar
- [ ] Dauerhaft sichtbarer Umsetzungs-Hinweis oberhalb Tabs sichtbar
- [ ] CTA-Wiederholung am Seitenende vorhanden
- [ ] Externe Links sind als neuer Tab gekennzeichnet

Erwartung:
- Monatsrate aktualisiert sich unmittelbar bei Renditeanpassung.
- Ergebnisseite ist ohne Modal-only-Erklaerungen verstaendlich.

## Testfall 6: PDF-Export

- [ ] "Als PDF herunterladen" klicken
- [ ] Datei wird heruntergeladen
- [ ] PDF-Inhalt ist lesbar und enthaelt Kerndaten
- [ ] PDF enthaelt DK-Rot-Branding, Titel "Ihr persoenlicher Vorsparplan" und prominente Sparrate
- [ ] PDF enthaelt Ergebnis-Link und QR-Code mit identischem Ziel
- [ ] PDF enthaelt "Ihre naechsten Schritte", Kontakt-Platzhalter und rechtliche Hinweise (vorlaeufig)

Erwartung:
- Kein Fehlerdialog.
- QR-Code und ausgeschriebener Link oeffnen die Ergebnisseite mit derselben Konfiguration.

## Testfall 7: Link-Kopie und Top-/Bottom-CTAs

- [ ] "Link kopieren" oben klicken
- [ ] Erfolgsmeldung erscheint
- [ ] CTA-Wiederholung unten pruefen (PDF + Link)
- [ ] Kopierter Link enthaelt `goal`, `target`, `years`, `strategy` und ggf. `rate`
- [ ] Kopierten Link in neuem Tab oeffnen

Erwartung:
- Ergebnisansicht wird mit derselben Konfiguration wiederhergestellt.

## Abschluss

- [ ] `npm run check:ci` gruener Durchlauf
- [ ] Keine Blocker in Console sichtbar
