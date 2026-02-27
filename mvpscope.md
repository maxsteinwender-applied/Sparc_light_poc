# Sparc Light MVP Scope

## Dokumentstatus
- Quelle: [Notion – Sparc Light MVP Scoping](https://www.notion.so/30c36743f26b8085b84fd851ccf56a15)
- Letzter Notion-Stand (Snapshot): 2026-02-20
- Letzte Markdown-Aktualisierung: 2026-02-27
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
- Visuelle Integrationsannahmen für den Prototyp: siehe `guidelines/deka-integration-visual-demo.md`

## 3) Core Flow (MVP Seiten)
### 3.1 Intro / Einstiegsseite
- Pflicht im MVP
- Setzt Erwartungshaltung und Nutzenversprechen
- Senkt Einstiegshürde (kurz, verständlich, ohne Fachsprache)
- Vermittelt: persönliche Strecke in wenigen Schritten + konkrete nächste Schritte zur Umsetzung
- Aktueller Prototyp-Status: Intro ist als nächster Build-Schritt vorgesehen und aktuell kein Blocker für die Prototyp-Abnahme

### 3.2 Sparziel-Auswahl
- Pflicht im MVP
- 7 vordefinierte Ziele + 1 individuelles Ziel
- Bei individuellem Ziel: Betrag ermitteln + Orientierungslogik sind im MVP vorgesehen; finale Freigabe mit dem Kunden ist noch `offen`
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
- UI-Contract (Stand 2026-02-26):
  - Karte „Spardauer angeben“ analog zum Aufbau von „Zielbetrag angeben“ (ohne Chip)
  - Schnellauswahl als Outlined/Filled-Buttons mit zusätzlicher Monatsraten-Vorschau bei 4 % p.a.
  - Vollbreiter Counter-Input (+/-) mit Label „Spardauer“ und Hinweistext zum Zieljahr (1–40 Jahre)
  - Separate Sparraten-Preview-Card unterhalb des Inputs: „Vorraussichtliche monatliche Sparrate (bei 4 % p.a.)“

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
- `years` (Pflicht, ganzzahlig, 1–40; Werte außerhalb werden verworfen)
- `interest` (Pflicht: `variant1` | `variant2` | `variant3` | `custom`)
- `rate` (bedingt, nur bei `interest=custom`, 0–0.15)
- Übergangsregel (Backward Compatibility): Legacy-Links mit `strategy` werden weiterhin gelesen, neue Links werden nur mit `interest` erzeugt

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
- Prototyp-Baseline: Absprung zum Sparrechner ist verpflichtend
- Kartenlinks sind im Prototyp optional (inhaltlich reduzierte MVP-Interpretation)

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
5. Freigabe der Betragsermittlung/Orientierungslogik für „Individuelles Sparziel“ durch den Kunden (`offen`)

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
| 2026-02-27 | Product-Abgleich (Feedback-Runde) | Scope-Präzisierung umgesetzt: Intro als pending/non-blocking im Prototyp, individuelles Ziel mit Betragsermittlung als MVP-intended aber `offen` bis Kundenfreigabe, Deep-Link-Contract auf `interest` (`variant1/2/3/custom`) mit `years` 1–40 und Legacy-Read von `strategy`, Optimierung-Tab auf Prototyp-Baseline (Sparrechner Pflicht, Kartenlinks optional) angepasst. | Codex (/prod) |
| 2026-02-26 | Codex UI-Experiment (Option-Selection Outline) | Pseudo-Ring-Variante zurückgebaut und auf Alternative mit `outline` als zweitem Pixel umgestellt: Basis `1px` Border bleibt, im Selected-State zusätzlich `outline: 1px solid` für stärkere Kontur ohne Layout-Sprung. | Codex (/fe) |
| 2026-02-26 | Codex UI-Experiment (Option-Selection Pseudo-Ring) | Alternative Selection-Darstellung für `ui-option-card` umgesetzt: Basis bleibt `1px` Border, zusätzlicher `::after`-Ring erzeugt optische „2px“-Anmutung im Selected-State ohne Layout-Sprung. Änderung ist lokal auf den `ui-option-card`-Block begrenzt und damit einfach rückgängig zu machen. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Option-Border 1px/2px) | `ui-option-card` auf gewünschtes Border-Verhalten gesetzt: Default `1px` Border, Selected `2px` Border; weiterhin ohne Inset-Ring und ohne Scale-Effekt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Option-Border ohne Inset) | `ui-option-card` von Inset-Ring zurück auf reines Border-Selection-Muster umgestellt. Border-Breite in Default und Selected auf konstant `2px` gesetzt (nur Farbwechsel), damit die Auswahl ohne Layout-Sprung funktioniert und kein Ring-Effekt sichtbar ist. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Option-Selection Stabilität + Reihenfolge Hinweis) | Reihenfolge der zwei festen „Gut zu wissen“-Bulletpoints getauscht. Zusätzlich globale `ui-option-card`-Selektion stabilisiert: Click-Scale-Effekt entfernt und Selected-Rahmen als innerer Inset-Ring umgesetzt, damit bei Sparziel- und Betrag-Optionen kein Layout-Sprung mehr durch Border-Dickenwechsel entsteht. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Input Standardisierung + Stepper-Typografie) | `NumericInputStepper` angepasst: Value links in `18px` und `font-normal`, Unit rechts in `16px` (weiterhin `#1A6B80`). Zusätzlich `.ui-input` global standardisiert auf `border-radius: 0` und Border `#003745`, lokale Zielbetrag-Overrides damit entfernt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Fix (Input-Spezifität) | Zielbetrag-Input mit hartem Stil-Override (`!rounded-none`, `!border-[#003745]`) versehen, damit Radius 0 und Borderfarbe trotz `.ui-input` Basisklasse sicher angewendet werden. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Gut-zu-wissen Texte fixiert) | Bulletpoints der „Gut zu wissen“-Card in Schritt 4 von zielabhängigen Inhalten auf eine feste Liste umgestellt: „Regelmäßiges Sparen kann Schwankungen ausgleichen.“ und „Je länger der Zeitraum, desto mehr wirkt der Zinseszinseffekt.“ | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Input Feldstil) | Normales Zielbetrag-Input an Stepper-Stil angeglichen: Radius auf 0, Border-Farbe auf `#003745`, Unit-Label „EUR“ farblich auf `#1A6B80` (fett) angepasst. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Number Counter Typografie) | Textgröße im `NumericInputStepper` für Value und Unit auf `text-lg` angepasst, damit die Typografie mit dem Zielbetrag-Input konsistent ist. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Number Counter Input) | `NumericInputStepper` visuell an Screenshot angenähert: Radius auf 0 (`rounded-none`), zusätzliche Trenn-Borders für Minus/Plus-Segmente ergänzt, Value linksbündig und fett formatiert (Farbe unverändert), Unit rechtsbündig und fett auf `#1A6B80` gesetzt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Spacing/Link-Hover/Copy) | Vertikalen Abstand zwischen Abschnittstiteln („Zielbetrag angeben“, „Spardauer angeben“) und den jeweiligen Auswahl-Labels vergrößert; Link-Style der Zurück-Buttons so angepasst, dass beim Hover nur der Text unterstrichen wird (Icon bleibt ohne Underline); Hinweistext „Als Nächstes bestimmen wir den Betrag.“ in der Sparziel-Auswahl entfernt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (CTA/Width/Defaults) | CTA-Buttons „Weiter zur Spardauer“ und „Ergebnis anzeigen“ auf Primary-Button-Variante analog „Mit Sparziel fortfahren“ umgestellt; Zurück-Aktionen in Schritt 2/4 als Link-Button mit `chevron_left` und gleicher vertikaler Ausrichtung umgesetzt; Inhaltsbreite von Schritt 1 und 2 auf `max-w-3xl` (wie Schritt 4) vereinheitlicht; Abstand des Spardauer-Info-Hinweises unter dem Counter auf das gleiche Muster wie bei Zielbetrag angepasst; in Schritt 4 wird beim Erstaufruf standardmäßig die mittlere empfohlene Spardauer als Preset gesetzt; in Schritt 2 Label auf „Passende Zielbeträge für dieses Ziel“ geändert und Presets so angepasst, dass der Orientierungswert nicht als Schnellwert enthalten ist (bleibt als Default im Input sichtbar). | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Spardauer-Seite / Schritt 4 – Follow-up) | Info-Icon bei „Sie erreichen Ihr Ziel …“ ergänzt (inkl. fettem „Jahr 20XX“), Label auf „Empfohlene Spardauern für dieses Ziel“ angepasst, Preview-Card auf Sparziel-Icon-Farbe (`#1A6B80`) umgestellt, „Gut zu wissen“-Bereich neu strukturiert (Icon ohne Box neben Heading, größere Heading-Textgröße, Bullet-Liste linksbündig zum Icon). | Codex (/fe) |
| 2026-02-26 | Codex UI-Änderung (Spardauer-Seite / Schritt 4) | Headline und Subline auf Figma-Make-Referenztext angepasst; Status-Quo-Hinweisblock entfernt; neue Card „Spardauer angeben“ im Stil von Schritt 2 mit Schnellauswahl (outlined/filled) plus Monatsraten-Schätzung bei 4 % p.a.; Counter-Input vollbreit mit Label „Spardauer“ und Zieljahr-Hinweistext; Card „Auswirkung Ihrer Laufzeitwahl“ durch dunkle Preview-Card „Vorraussichtliche monatliche Sparrate (bei 4 % p.a.)“ ersetzt; „Gut zu wissen“-Card auf Lightbulb-Icon umgestellt und bereinigt; Hinweis „Fast geschafft …“ entfernt; CTA „Ergebnis anzeigen“ wie in Schritt 2 rechts im Footer ausgerichtet. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v5) | CTA „Betrag übernehmen“ in der „Errechneter Zielbetrag“-Box neu ausgerichtet: Desktop vertikal mittig rechts neben dem Textblock; Mobile Umbruch unter den Textblock mit voller Breite (`w-full`). | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v4) | „Errechneter Zielbetrag“-Card von Beige auf hellblauen Akzent (`#F4F9FA`) umgestellt; „Betrag übernehmen“-Button in der Card-Kopfzeile vertikal mittig ausgerichtet. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v3) | Accordion-Header „Betrag ermitteln“ auf 4px-Radius und saubere Clipping-Kanten angepasst (Visual-Bug-Fix). „Errechneter Zielbetrag“-Box auf Beige-Akzent `#F5EFE4` umgestellt; Wert nicht mehr grün. „Betrag übernehmen“ in die Ergebnis-Box rechts verschoben und mit Arrow-Right-Icon ergänzt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite v2) | Headerbereich von „Betrag ermitteln“ mit hellem Blau hinterlegt zur klareren visuellen Trennung von der Zielbetrag-Card; Orientierungswert im Info-Satz zusätzlich fett hervorgehoben. | Codex (/fe) |
| 2026-02-26 | Codex UI-Feinschliff (Zielbetrag-Seite) | Step-2-UI verfeinert: Titel zu „Zielbetrag angeben“ mit linksbündigem „Direkter Weg“-Chip, Label „Schnellauswahl“, aktive Quick-Option als gefüllter Button, zusätzliches Label „Zielbetrag“ über Input, Orientierungswert als Plain-Text mit Info-Icon und „(übernehmen)“-Link, flexible Wrap-Darstellung der Ausprägungen mit Checkmark wiederhergestellt, Accordion schließt nach „Betrag übernehmen“ automatisch. | Codex (/fe) |
| 2026-02-26 | Codex UI-Änderung (Zielbetrag-Seite) | Schritt 2 grundlegend umgebaut: Fokus auf Zielbetrag-Input mit Orientierungswert-Übernahme, 4 Schnellauswahl-Buttons und integriertem „Betrag ermitteln“-Accordion (inkl. Selektieren/Deselektieren der Ausprägungen, errechnetem Zielbetrag, Differenzanzeige und „Betrag übernehmen“). Navigation führt von Schritt 2 direkt zu Schritt 4, separate Betrag-ermitteln-Seite ist damit aus dem aktiven Flow entfernt. | Codex (/fe) |
| 2026-02-26 | Codex UI-Änderung (Wizard Schritt 1) | „Sparziel auswählen“ ohne vorausgewähltes Ziel umgesetzt; CTA bleibt deaktiviert bis zur aktiven Zielauswahl durch den Nutzer | Codex (/fe) |
| 2026-02-26 | Codex UI-Umsetzung (Figma-Make-Layout-Alignment) | Heading-Harmonisierung auf 32 px im Wizard, Hero-Sublines auf 16 px, Sparziel-Icon-Hintergrund auf `#1A6B80`, neue Summary-Zeilen über den Headlines in Schritt 2 (Icon + Sparziel) und Schritt 4 (Icon + Sparziel + Zielbetrag) | Codex (/fe) |
| 2026-02-25 | Notion Snapshot vom 2026-02-20 | Initiale Überführung des MVP-Scopes nach `mvpscope.md` inkl. Struktur für laufende Iterationen | Codex (/prod) |
