# UI-Komponenten und Texte (Baseline)

Stand: 13.02.2026  
Projekt: Sparc Light POC  
Zweck: Vollstaendige Bestandsaufnahme der aktuellen UI-Komponenten und aller relevanten Texte als Referenz fuer kuenftige Aenderungen.

## Nutzung dieser Datei

- Diese Datei ist die zentrale Dokumentation fuer UI-Komponenten und Textinhalte.
- Jede kuenftige UI-/Textaenderung wird hier nachgezogen.
- Empfohlener Ablauf nach jeder Aenderung:
  - betroffene Komponente(n) und Textstellen aktualisieren
  - Aenderung im Abschnitt `Aenderungslog` ergaenzen

## Komponentenbaum (Seitenfluss)

- `src/app/App.vue`
  - rendert `MainLayout`
- `src/app/components/MainLayout.vue`
  - Header mit Logo, Produktname und Fortschrittsbalken
  - Step-Switch fuer:
    - `Step1_GoalSelection.vue`
    - `Step2_TargetAmountType.vue`
    - `Step3_CalculateAmount.vue`
    - `Step4_Duration.vue`
    - `Step5_Results.vue`
  - Footer (nur Schritt 1-4)

## Globale Layout-Texte

Quelle: `src/app/components/MainLayout.vue`

- Produktname im Header: `Sparc Light`
- Logo-Alt-Text: `DekaBank Logo`
- Footer: `© 2026 DekaBank Deutsche Girozentrale`

## Schritt 1: Zielauswahl

Quelle: `src/app/components/Step1_GoalSelection.vue`

### Statische Texte

- `Schritt 1 von 5`
- `Wofür möchten Sie sparen?`
- `Ihr Ziel bestimmt alle weiteren Schritte.`
- `Als Nächstes bestimmen wir den Betrag.`
- Button: `Individuelles Sparziel erstellen`
- Label (Custom): `Name Ihres Sparziels`
- Input-Placeholder (Custom): `z. B. Auszeit, Hochzeit, Sicherheitspuffer...`
- Hilfstext (Custom): `Definieren Sie Ihr eigenes Ziel. Wir helfen bei Betrag, Zeitraum und Plan.`
- Button (Custom): `Mit individuellem Ziel fortfahren`
- Link (Custom): `Zurück zur Auswahl`

### Dynamische Texte

- CTA Standardziele: `Mit {{ selectedGoalLabel }} fortfahren`
- Fallback-Label intern: `diesem Ziel`

### Subkomponenten

- `src/app/components/GoalCarousel3D.vue`
  - Aria:
    - `Vorheriges Ziel`
    - `Nächstes Ziel`
- `src/app/components/motion/MotionGoalCard.vue`
  - Aria dynamisch: `Ziel auswählen: {{ goal.label }}`
  - sichtbarer Karten-Titel: `{{ goal.label }}`
- `src/app/components/figma/ImageWithFallback.vue`
  - Fallback-Alt-Text: `Error loading image`

## Schritt 2: Zielbetrag setzen oder ermitteln

Quelle: `src/app/components/Step2_TargetAmountType.vue`

### Statische Texte

- Button oben: `Zurück`
- `Schritt 2 von 5`
- Titel: `Wie viel möchten Sie für {{ goalLabel }} ansparen?`
- Karte 1:
  - Badge: `EUR`
  - Titel: `Betrag eingeben`
  - Text: `Sie haben bereits eine konkrete Summe im Kopf?`
  - Placeholder: `Betrag eingeben`
  - Einheit: `EUR`
  - Infobox-Titel: `Info`
  - Hinweis: `Als Nächstes legen Sie die Laufzeit fest.`
  - CTA: `Mit diesem Betrag fortfahren`
- Karte 2:
  - Badge: `Fx`
  - Titel: `Betrag ermitteln`
  - Text: `Wir helfen Ihnen, den passenden Betrag zu finden, basierend auf:`
  - Hinweis: `Als Nächstes legen wir Prioritäten fest.`
  - CTA: `Betrag ermitteln`

### Dynamische Texte

- Untertitel aus Ziel-Daten: `{{ currentGoal.shortTeaser }}`
- Info-Hinweis aus Ziel-Daten: `{{ currentGoal.avgTargetAmountHint }}`
- Kategorien-Chips aus Ziel-Daten: `{{ category }}`

## Schritt 3: Faktoren fuer Zielbetrag

Quelle: `src/app/components/Step3_CalculateAmount.vue`

### Statische Texte

- Button oben: `Zurück`
- Karte links:
  - Label: `Zielbetrag`
  - Infobox-Titel: `Info`
  - Infotext: `Dieser Wert dient als erste Orientierung für {{ goalLabel }}.`
  - Hinweis: `Im nächsten Schritt legen Sie die Laufzeit fest.`
  - CTA: `Weiter zur Laufzeit`
- Bereich rechts:
  - `Schritt 3 von 5`
  - Titel: `Was ist Ihnen bei {{ goalLabel }} wichtig?`
  - Fussnote: `Ausgangspunkt ist ein typischer Durchschnittswert. Ihre Auswahl kann den Betrag erhoehen oder senken.`

### Dynamische Texte

- Betrag: `{{ formatCurrency(currentTotal) }}`
- Delta: `+/- {{ Betrag }} EUR durch Ihre Auswahl`
- Faktoren-Chips:
  - Emoji: `{{ chip.emoji }}`
  - Label: `{{ chip.label }}`
  - Kostenanzeige:
    - `± 0 EUR`
    - `+{{ Betrag }} EUR`
    - `−{{ Betrag }} EUR`

## Schritt 4: Laufzeit

Quelle: `src/app/components/Step4_Duration.vue`

### Statische Texte

- Button oben: `Zurück`
- `Schritt 4 von 5`
- Titel: `Wann möchten Sie {{ goalLabel }} erreichen?`
- Quick-Optionen: `in {{ years }} Jahren`
- `NumericInputStepper`:
  - Label: `Laufzeit manuell anpassen`
  - Unit: `Jahre`
  - Note: `Zieljahr {{ targetYear }}`
- Infobox:
  - Label: `Info`
  - Titel: `Gut zu wissen:`
- Hinweis: `Fast geschafft. Gleich sehen Sie Ihren Plan.`
- CTA: `Ergebnis anzeigen`

### Dynamische Texte

- Infobox-Liste aus Ziel-Daten: `{{ point }}`

## Schritt 5: Ergebnis (V1 Redesign)

Quelle: `components/Step5_Results.vue`

### Kopfbereich

- Button: `Zurück`
- `Schritt 5 von 5`
- Titel: `Ihr Sparziel {{ goalLabel }} wird greifbar.`
- Untertitel: `Mit Ihrem Plan sparen Sie {{ Betrag }} in {{ durationYears }} Jahren.`

### Top-Aktionen

- `Als PDF herunterladen`
- `Erzeuge PDF...`
- `Link kopieren`
- Erfolgsmeldung: `Link wurde in die Zwischenablage kopiert.`
- Fehlermeldung: `Link konnte nicht kopiert werden. Bitte erneut versuchen.`

### Hero-Links (linke Spalte)

- KPI-Label: `Monatliche Sparrate`
- KPI-Hinweis: `Errechnet für {{ durationYears }} Jahre | {{ selectedAnnualRate }} % p.a. Rendite`
- Renditekarten:
  - `Option A` / `Niedrige Rendite` / `Geringeres Risiko`
  - `Option B` / `Mittlere Rendite` / `Mittleres Risiko`
  - `Option C` / `Höhere Rendite` / `Höheres Risiko`
  - `Option D` / `Individuelle Rendite`
- Custom-Hinweis: `Wert zwischen 0,0 % und 15,0 % p. a.`
- Input-Button: `OK`

### Sparziel-Steckbrief (rechte Spalte)

- Label: `Sparziel-Steckbrief`
- Felder:
  - `Zielbetrag`
  - `Laufzeit`
  - `Zieljahr {{ targetYear }}`
- Edit-Buttons:
  - `Bearbeiten`
  - `Speichern`
  - `Abbrechen`
- Helper-Link: `Wie setzt sich der Zielbetrag zusammen?`

### Zielbetrags-Info-Modal

- Titel: `Wie setzt sich der Zielbetrag zusammen?`
- Text: `Der Zielbetrag basiert auf Ihrem ausgewählten Sparziel und Ihren Eingaben. Sie können Zielbetrag und Laufzeit jederzeit bearbeiten. Die monatliche Sparrate wird danach automatisch neu berechnet.`
- Button: `Schließen`

### Tab-Navigation

- `Übersicht`
- `Optimierung`
- `Umsetzung`

### Tab 1: Übersicht

- Titel: `Warum Wertpapiersparen sinnvoll ist`
- Introtext: `Mit Renditeannahmen kann Ihr Ziel bei gleicher Laufzeit mit einer geringeren monatlichen Sparrate erreicht werden.`
- Karte links:
  - `Mit DKF Sparplan`
  - Badge: `Aktive Annahme`
  - `Monatliche Sparrate`
  - `Ziel erreicht`
  - `Angespartes Kapital`
  - `Voraussichtlicher Endwert`
  - `Davon Erträge`
  - Link: `Mehr zum DKF-Sparplan erfahren`
- Karte rechts:
  - `Ohne Rendite`
  - `Monatliche Sparrate`
  - `Ziel erreicht`
  - `Angespartes Kapital`
  - `Voraussichtlicher Endwert`
  - `Davon Erträge`

### Tab 2: Optimierung

- Titel: `Optimierung`
- Karte 1:
  - `Dynamisierung`
  - `Inflation ausgleichen`
  - `+2 % p. a.`
  - `Mehr erfahren`
- Karte 2:
  - `Starteinlage`
  - `Einmaliger Boost zum Start`
  - `+1.000 € einmalig`
  - `Mehr erfahren`
- Karte 3:
  - `DK-Abräumsparen`
  - `Überschüsse automatisch sparen`
  - `+80 € monatlich`
  - `Mehr erfahren`
- Karte 4:
  - `Höhere Sparrate`
  - `Schneller ans Ziel`
  - `+20 € monatlich`
  - Zeitgewinn: `{{ years/months }} früher am Ziel` oder `Kein zusätzlicher Zeitgewinn im aktuellen Szenario.`
- CTA: `Zum Sparrechner`

### Tab 3: Umsetzung

- Label: `Kundenfavoriten`
- Titel: `Die Sparplan-Favoriten.`
- Introtext: `Nachfolgend zeigen wir Ihnen die Fonds, die von unseren Kunden im letzten Monat am häufigsten für Fondssparpläne im DekaBank Depot ausgewählt wurden.`
- CTA: `Zum Fondsfinder`
- Tabellenspalten:
  - `Rang`
  - `Name`
  - `ISIN`
  - `Fondstyp`

### Weitere Schritte (unter Umsetzung)

- `Weitere Schritte`
- Karte 1:
  - `Abschluss in der Filiale`
  - `So geht's`
- Karte 2:
  - `Abschluss in der Internetfiliale`
  - `So geht's`
- Karte 3:
  - `Abschluss in der S-Invest App`
  - `So geht's`
  - Hinweis: `Aktuell ist kein Direktlink zur S-Invest App hinterlegt.`

### PDF-Export-Inhalt (versteckter Rendercontainer)

- `Sparc Light · Ergebnisbericht`
- `Ihr Sparplan auf einen Blick`
- `Ziel: {{ goalLabel }}`
- `Monatliche Sparrate: {{ ... }}`
- `Laufzeit: {{ ... }}`
- `Angespartes Kapital: {{ ... }}`
- `Davon Erträge: {{ ... }}`
- `Ohne Rendite benötigte Rate: {{ ... }}`
- `Renditeannahme: {{ ... }}`

Bei Exportfehler:

- Alert: `PDF konnte nicht erstellt werden. Bitte versuchen Sie es erneut.`

## Ziel-Datenkatalog (fachliche Textquellen)

Quelle: `src/app/components/goalsData.ts`

### Gemeinsame Strategien (alle Ziele)

- `Sicherheitsorientiert`
  - Produkt: `Deka-Nachhaltigkeit Rentenfonds`
  - Beschreibung: `Solide Basis mit geringen Schwankungen.`
- `Ausgewogen`
  - Produkt: `Deka-Global Champions Fonds`
  - Beschreibung: `Gute Balance aus Chance und Risiko.`
- `Chancenorientiert`
  - Produkt: `Deka-Global Aktienfonds`
  - Beschreibung: `Maximale Ertragschancen langfristig.`

### Ziele (Labels)

- `Urlaub / Reise`
- `Sparen für die Kinder`
- `Altersvorsorge`
- `Immobilie`
- `Auto`
- `Allgemeine Anschaffungen`
- `Vermögen aufbauen`
- `Individuelles Sparziel erstellen`

### Ziele (Teaser)

- Reise: `Machen Sie Ihre Reise planbar – passend zu Ihrem Stil und Ihrem Zeitplan.`
- Kinder: `Geben Sie Ihrem Kind einen finanziellen Startvorteil – passend zu Ihrem Budget.`
- Altersvorsorge: `Sichern Sie Ihren Lebensstandard im Ruhestand – planbar und langfristig.`
- Immobilie: `Bauen Sie Eigenkapital auf – für Kauf, Bau oder Sanierung.`
- Auto: `Planen Sie Ihr Auto ohne Stress – mit klarer Zielsumme und Termin.`
- Anschaffungen: `Finanzieren Sie größere Anschaffungen clever – ohne Ihr Budget zu überfordern.`
- Vermögen: `Bauen Sie Schritt für Schritt Vermögen auf – flexibel und langfristig.`
- Custom: `Definieren Sie Ihr eigenes Ziel – wir helfen bei Betrag, Zeitraum und Plan.`

### Ziele (Orientierungstexte)

- Reise: `Als Orientierung: Eine größere Reise liegt oft bei 3.000–10.000 EUR pro Person.`
- Kinder: `Viele Familien setzen Ziele wie 10.000–30.000 EUR bis zum 18. Lebensjahr.`
- Altersvorsorge: `Als grobe Orientierung: Viele planen mit 100.000–250.000 EUR zusätzlichem Kapital.`
- Immobilie: `Viele planen z. B. 30.000–80.000 EUR Eigenkapital als Zielgröße.`
- Auto: `Viele setzen je nach Fahrzeug z. B. 10.000–30.000 EUR an.`
- Anschaffungen: `Viele planen für Anschaffungen z. B. 2.000–15.000 EUR.`
- Vermögen: `Viele Anlegerinnen und Anleger starten z. B. mit 25.000 EUR als langfristigem Ziel.`
- Custom: `Tipp: Starten Sie mit einer groben Schätzung. Sie können später alles anpassen.`

### Ziele (Disclaimers)

- Reise: `Je nach Strategie können Zwischenstände schwanken.`
- Kinder: `Je nach Anlagestrategie sind Schwankungen möglich.`
- Altersvorsorge: `Die Berechnung basiert auf Annahmen und dient der Orientierung.`
- Immobilie: `Kürzere Laufzeiten bedeuten oft weniger Schwankungstoleranz.`
- Auto: `Bei kürzeren Laufzeiten kann eine konservativere Annahme sinnvoll sein.`
- Anschaffungen: `Für kürzere Ziele ist Planbarkeit besonders wichtig.`
- Vermögen: `Wertentwicklungen sind nicht garantiert und können schwanken.`
- Custom: `Individuelle Ziele erfordern individuelle Planung.`

### Ziele (whatItMeans)

- Reise:
  - `Kurz- bis mittelfristig.`
  - `Budget hängt stark vom Reisestil ab.`
  - `Sie können den Betrag über Ausprägungen ermitteln.`
- Kinder:
  - `Für Ausbildung, Führerschein oder den Start ins Leben.`
  - `Auch kleine Beträge können über Zeit viel bewirken.`
  - `Zeithorizont orientiert sich am Alter des Kindes.`
- Altersvorsorge:
  - `Lange Laufzeiten können Renditechancen erhöhen.`
  - `Regelmäßige Anpassungen helfen gegen Inflation.`
  - `Ein realistischer Zeithorizont ist entscheidend.`
- Immobilie:
  - `Eigenkapital kann die Finanzierung erleichtern.`
  - `Zeithorizont meist mittel- bis langfristig.`
  - `Planbarkeit ist hier besonders wichtig.`
- Auto:
  - `Typisch kurz- bis mittelfristig.`
  - `Je kürzer die Laufzeit, desto wichtiger ist Stabilität.`
  - `Optional: Einmalbetrag kann die Rate spürbar senken.`
- Anschaffungen:
  - `Für Möbel, Technik oder Renovierung.`
  - `Klare Zielsumme, klare Laufzeit.`
  - `Optional: Einmalbetrag reduziert die monatliche Belastung.`
- Vermögen:
  - `Für langfristige Ziele oder finanzielle Freiheit.`
  - `Regelmäßiges Sparen kann Schwankungen ausgleichen.`
  - `Je länger der Zeitraum, desto mehr wirkt der Zinseszinseffekt.`
- Custom:
  - aktuell leer (`[]`)

### Ziele (amountFinderCategories)

- Reise: `Dauer`, `Reisestil`, `Regionen`, `Unterkunft`, `Komfort`
- Kinder: `Ausbildung`, `Start ins Leben`, `Flexibilität`, `Meilensteine`, `Sicherheit`
- Altersvorsorge: `Ruhestand`, `Lebensstandard`, `Inflation`, `Sicherheit`, `Zusatzrente`
- Immobilie: `Kauf`, `Sanierung`, `Puffer`, `Nebenkosten`, `Eigenkapitalquote`
- Auto: `Fahrzeugtyp`, `Neu/Gebraucht`, `Extras`, `Puffer`, `Zeitpunkt`
- Anschaffungen: `Kategorie`, `Qualität`, `Menge`, `Timing`, `Puffer`
- Vermögen: `Zielgröße`, `Risikoneigung`, `Flexibilität`, `Lebensstil`, `Sicherheitsreserve`
- Custom: `Zielgröße`, `Risikoneigung`, `Flexibilität`, `Lebensstil`, `Sicherheitsreserve`

### Ziele (amountFinderChips)

- Reise:
  - `Viele Flüge` (✈️, +800)
  - `Komfort-Unterkünfte` (🏨, +1200)
  - `Mehrere Länder` (🌍, +600)
  - `Reise > 4 Wochen` (🗓️, +900)
  - `Puffer & Rücklagen` (🧰, +500)
  - `Wenige Ziele` (🧭, -500)
  - `Einfache Unterkünfte` (🛏️, -800)
  - `Kurze Reisedauer` (⏱️, -1000)
  - `Reisen zu zweit` (🧑‍🤝‍🧑, 0)
- Kinder:
  - `Langfristige Ausbildung` (🎓, +5000)
  - `Auslandssemester` (🌐, +3000)
  - `Zusätzliche Rücklagen` (🧰, +2000)
  - `Staatliche Unterstützung einkalkuliert` (🏛️, -2500)
  - `Regionale Ausbildung` (📍, -3000)
  - `Flexible Verwendung` (🎁, 0)
- Altersvorsorge:
  - `Früher Ruhestand` (🏖️, +80000)
  - `Höherer Lebensstandard` (🛋️, +60000)
  - `Längere Lebenserwartung` (🧓, +40000)
  - `Zusätzliche private Vorsorge vorhanden` (💼, -50000)
  - `Niedrigere Fixkosten im Alter` (🏠, -40000)
  - `Gesetzliche Pension berücksichtigt` (🧾, 0)
- Immobilie:
  - `Neubau` (🏗️, +70000)
  - `Zentrale Lage` (🏙️, +60000)
  - `Größere Wohnfläche` (📐, +50000)
  - `Bestandsimmobilie` (🏚️, -40000)
  - `Ländliche Lage` (🌲, -50000)
  - `Eigenleistung` (🛠️, -30000)
  - `Förderung möglich` (🧑‍💼, 0)
- Auto:
  - `Neuwagen` (🆕, +10000)
  - `Elektrofahrzeug` (🔋, +8000)
  - `Höhere Ausstattung` (🎛️, +6000)
  - `Gebrauchtwagen` (♻️, -7000)
  - `Kleinwagen` (🚗, -5000)
  - `Finanzierung geplant` (📄, 0)
- Anschaffungen:
  - `Hochwertige Produkte` (💎, +3000)
  - `Mehrere Anschaffungen` (🧺, +2000)
  - `Gebraucht / Refurbished` (🛒, -1500)
  - `Zeitlich gestaffelt` (🗓️, -1000)
  - `Flexible Auswahl` (🎯, 0)
- Vermögen:
  - `Finanzielle Freiheit` (🌟, +15000)
  - `Früher reduzieren (Arbeitszeit)` (⏳, +10000)
  - `Hohe Flexibilität behalten` (🎈, 0)
  - `Zusätzliche Sicherheitsreserve` (🛡️, +5000)
  - `Langfristig wachsen lassen` (📈, +8000)
- Custom:
  - `Puffer einplanen` (🛡️, +2000)
  - `Großzügig kalkulieren` (➕, +5000)
  - `Qualität hat Vorrang` (💎, +3000)
  - `Startkapital` (🏁, +1000)
  - `Nebenkosten` (🧾, +500)

## Aenderungslog

- 2026-02-13: Initiale Baseline erstellt (Komponenteninventar + Textinventar fuer Schritt 1-5, Chart, PDF, E-Mail, Goal-Daten).
