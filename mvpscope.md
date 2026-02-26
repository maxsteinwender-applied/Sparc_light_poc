# Sparc Light MVP Scope

## Dokumentstatus
- Quelle: [Notion – Sparc Light MVP Scoping](https://www.notion.so/30c36743f26b8085b84fd851ccf56a15)
- Letzter Notion-Stand (Snapshot): 2026-02-20
- Letzte Markdown-Aktualisierung: 2026-02-26
- Zweck: Zentrale, laufend gepflegte MVP-Scope-Dokumentation für Product, UX, FE und QA.

## 1) MVP Ziel
Der MVP ist eine ab Tag 1 auf `deka.de` nutzbare, vermarktbare und conversion-orientierte Lösung. Der Scope ist bewusst reduziert, soll aber als runde und wertstiftende erste Version funktionieren (im Deka-Kontext nahe MMP).

Erfolgsbild im MVP:
- Nutzer erreicht die Ergebnisseite mit einem vollständigen personalisierten Ergebnis.
- Nutzer wird über klare Next Steps in Richtung Conversion geführt.
- Zielabschlusswege: Filiale, Internetfiliale, S-Invest App.

## 2) Einstieg und Platzierung
Definierte Einstiegspunkte:
- Kampagnenseiten
- Themenseiten
- Direkte Navigation (Menü/Header)
- SIM-Beraterwelt
- Sparkassenseite im Sparkassen-Branding
- Kommunikationskanäle (z. B. Newsletter/CRM/Social)
- Direkte Werbeanzeigen (Paid Ads)

Priorisierter MVP-Einstieg:
- Sparwelt-Kampagnenseite auf `deka.de`
- Einbindung als eigene Sektion
- Exakte Seitenposition ist noch offen

## 3) Core Flow (MVP Seiten)
### 3.1 Intro / Einstiegsseite
- Pflicht im MVP
- Setzt Erwartungshaltung und Nutzenversprechen
- Senkt Einstiegshürde (kurz, verständlich, ohne Fachsprache)
- Vermittelt: persönliche Strecke in wenigen Schritten + konkrete nächste Schritte zur Umsetzung

### 3.2 Sparziel-Auswahl
- Pflicht im MVP
- 7 vordefinierte Ziele + 1 individuelles Ziel
- Bei individuellem Ziel: generalistischer Flow ohne Empfehlungen/Durchschnittswerte
- UI-Ansatz: aktuell Karussell (Liste/Karten ebenfalls denkbar)

MVP-Sparziele:
1. Vermögen aufbauen
2. Für das Alter sparen
3. Sparen für die Kinder
4. Immobilie
5. Auto
6. Urlaub / Reise
7. Allgemeine Anschaffungen
8. Individuelles Sparziel

### 3.3 Zielbetrag konkretisieren
- Pflicht im MVP
- Number Input als Berechnungsbasis
- Anzeige von Orientierungs-/Durchschnittswert abhängig vom Sparziel

Feature „Betrag ermitteln" (offen, empfohlen für MVP):
- Statische Logik je Sparziel (Basiswert + Ausprägungen mit Plus/Minus-Effekten)
- Ausprägungen beeinflussen nur den Zielbetrag
- Finale Werte durch Deka/Projektteam freizugeben
- Perspektive Ausbaustufe: später dynamischer (z. B. KI-gestützt)

### 3.4 Laufzeit / Spardauer
- Pflicht im MVP
- Empfehlungen + vorgeschlagene Laufzeiten (Presets)
- Zusätzlich individueller numerischer Eingabewert

## 4) Ergebnisseite Teil 1: Sparrate
### 4.1 Grundanforderungen
- Pflicht im MVP
- Personalisierte Sparrate und Sparziel prominent
- Direkte Anpassung ohne Rücksprung in den Flow:
  - Renditeannahme wechseln
  - Zielbetrag ändern
  - Laufzeit ändern
- Sofortige Aktionen:
  - Link teilen (Copy Link)
  - PDF Download (wenn technisch im Zeitrahmen machbar)

### 4.2 Renditeannahmen
- Pflicht im MVP
- 3 Varianten (z. B. risikoarm / mittel / risikoreich)
- Optionaler Custom-Input 0–15 % ist als Entscheidung offen

### 4.3 Export / Speichern
- Link teilen ist MVP-Scope
- PDF Download ist MVP-gewünscht, technische Prüfung ausstehend

URL-Parameter für teilbare Ergebnisansicht:
- `goal` (Pflicht)
- `target` (Pflicht, > 0)
- `years` (Pflicht, > 0, fachlich max. 40)
- `interest` (Pflicht: variant 1 | variant 2 | variant 3 | custom)
- `rate` (bedingt, nur bei `interest=custom`, 0–0.15)

Datenschutzregel:
- Keine personenbezogenen Daten in URL-Parametern

### 4.4 Quick Edits
- MVP-Scope
- Direkt auf Ergebnisseite änderbar:
  - Laufzeit
  - Zielbetrag

## 5) Ergebnisseite Teil 2: Tabs
Tabs sind Teil des MVP (inhaltlich reduziert):
- Übersicht
- Optimierung
- Umsetzung

### 5.1 Tab „Übersicht"
- Ziel: Nutzen von Wertpapiersparen aufzeigen
- Vergleich mit/ohne Rendite
- Verlinkung auf Deka-FondsSparplan-Produktseite

### 5.2 Tab „Optimierung"
- 4 statische Empfehlungskarten:
  1. Dynamisierung
  2. Starteinlage
  3. Deka Bündel AbräumSparen
  4. Höhere Sparrate
- Nicht interaktiv (ändert Ergebnis nicht)
- Mit weiterführenden Links + Absprung zum Sparrechner

### 5.3 Tab „Umsetzung"
- Ziel: konkrete Abschlusswege
- Inhalte:
  - Sparplan-Favoriten (Design-System-Komponente)
  - Next Steps zu:
    1. Filiale
    2. Internetfiliale
    3. S-Invest App

## 6) Offene Entscheidungen
1. „Betrag ermitteln" mit statischen Werten: MVP oder Ausbaustufe?
2. Custom-Rendite-Input (0–15 %): MVP oder nur 3 Presets?
3. PDF-Download: technische Machbarkeit im Zeitrahmen / Scope (inkl. Backend-Bedarf)?
4. Exakte Positionierung des MVP-Einstiegs auf der Sparwelt-Kampagnenseite.

## 7) Out of Scope (aktuell)
- Dynamische/KI-basierte Betragsermittlung im MVP
- Tiefere Interaktivität in Optimierungs-Tabs (über statische Karten hinaus)
- Erweiterte Varianten außerhalb der oben beschriebenen MVP-Funktionen

## 8) Laufende Aktualisierung (Arbeitsmodus)
Bei jeder Scope-/Feature-Änderung in Notion:
1. Änderung in diesem Dokument in den fachlich betroffenen Abschnitten einpflegen.
2. `Letzte Markdown-Aktualisierung` auf aktuelles Datum setzen.
3. Neue Zeile im Änderungsprotokoll ergänzen.
4. Bei offenen Entscheidungen Status ergänzen (`offen`, `entschieden`, `verschoben`).

Status-Konvention:
- `offen`: noch nicht final abgestimmt
- `entschieden`: abgestimmt und für Umsetzung bindend
- `verschoben`: nicht im MVP, in spätere Iteration ausgelagert

## 9) Änderungsprotokoll
| Datum | Quelle | Änderung | Verantwortlich |
|---|---|---|---|
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v5) | CTA „Betrag übernehmen“ in der „Errechneter Zielbetrag“-Box neu ausgerichtet: Desktop vertikal mittig rechts neben dem Textblock; Mobile Umbruch unter den Textblock mit voller Breite (`w-full`). | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v4) | „Errechneter Zielbetrag“-Card von Beige auf hellblauen Akzent (`#F4F9FA`) umgestellt; „Betrag übernehmen“-Button in der Card-Kopfzeile vertikal mittig ausgerichtet. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v3) | Accordion-Header „Betrag ermitteln“ auf 4px-Radius und saubere Clipping-Kanten angepasst (Visual-Bug-Fix). „Errechneter Zielbetrag“-Box auf Beige-Akzent `#F5EFE4` umgestellt; Wert nicht mehr grün. „Betrag übernehmen“ in die Ergebnis-Box rechts verschoben und mit Arrow-Right-Icon ergänzt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v2) | Headerbereich von „Betrag ermitteln“ mit hellem Blau hinterlegt zur klareren visuellen Trennung von der Zielbetrag-Card; Orientierungswert im Info-Satz zusätzlich fett hervorgehoben. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite) | Step-2-UI verfeinert: Titel zu „Zielbetrag angeben“ mit linksbündigem „Direkter Weg“-Chip, Label „Schnellauswahl“, aktive Quick-Option als gefüllter Button, zusätzliches Label „Zielbetrag“ über Input, Orientierungswert als Plain-Text mit Info-Icon und „(übernehmen)“-Link, flexible Wrap-Darstellung der Ausprägungen mit Checkmark wiederhergestellt, Accordion schließt nach „Betrag übernehmen“ automatisch. | Codex (/fe) |
| 2026-02-26 | Codex UI-Änderung (Zielbetrag-Seite) | Schritt 2 grundlegend umgebaut: Fokus auf Zielbetrag-Input mit Orientierungswert-Übernahme, 4 Schnellauswahl-Buttons und integriertem „Betrag ermitteln“-Accordion (inkl. Selektieren/Deselektieren der Ausprägungen, errechnetem Zielbetrag, Differenzanzeige und „Betrag übernehmen“). Navigation führt von Schritt 2 direkt zu Schritt 4, separate Betrag-ermitteln-Seite ist damit aus dem aktiven Flow entfernt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Änderung (Wizard Schritt 1) | „Sparziel auswählen“ ohne vorausgewähltes Ziel umgesetzt; CTA bleibt deaktiviert bis zur aktiven Zielauswahl durch den Nutzer | Codex (/fe) |
| 2026-02-26 | Codex UI-Umsetzung (Figma-Make-Layout-Alignment) | Heading-Harmonisierung auf 32 px im Wizard, Hero-Sublines auf 16 px, Sparziel-Icon-Hintergrund auf `#1A6B80`, neue Summary-Zeilen über den Headlines in Schritt 2 (Icon + Sparziel) und Schritt 4 (Icon + Sparziel + Zielbetrag) | Codex (/fe) |
| 2026-02-25 | Notion Snapshot vom 2026-02-20 | Initiale Überführung des MVP-Scopes nach `mvpscope.md` inkl. Struktur für laufende Iterationen | Codex (/prod) |
