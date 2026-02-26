# Erinnerungs-Taskliste fuer Wiedereinstieg

Stand: 2026-02-25

## Iterationsstatus
- [x] Iteration 0: Doku-Sync + Quality Gate
- [x] Iteration 1: Schritt 1 Einstiegsseite
- [x] Iteration 2: Schritt 2 Auswahl Sparbetrag
- [x] Iteration 3: Schritt 3 Ermittlung Sparbetrag
- [x] Iteration 4: Schritt 4 Auswahl Spardauer
- [x] Iteration 5: Schritt 5 Ergebnisseite
- [ ] Iteration 6: Decision-Pass (gesammelte offene Punkte)

## Mittwoch Start
- [x] Inhalte aus der MVP-Scoping-Doku in lokale Projekt-Doku/Checkliste uebernehmen
- [x] Kurzueberblick: Schritt 1 (Bilder -> Icons + Sparzielkarte anpassen)
- [x] Kurzueberblick: Navigation ueber alle Schritte konsistent machen
- [x] Kurzueberblick: Schritt 2 (beide Karten UI optimieren + Werte je Sparziel pruefen/anpassen)
- [x] Kurzueberblick: Schritt 4 (Laufzeit-Screen + Komponenten funktional stabilisieren)
- [x] Danach den Screen-Backlog von 1 bis 5 durcharbeiten

## MVP-Scoping Sync (lokale Kurzfassung)
- Wizard bleibt 5-stufig, keine neue Public API
- Fokus auf Verstaendlichkeit, stabile Navigation und klare Auswahlzustaende
- Offene Produktentscheidungen werden gesammelt und im Decision-Pass gebuendelt
- Quality Gate: `oxc-parser` Binding-Blocker fuer `typecheck`/`nuxt prepare` wurde behoben

## 1) Einstiegsseite
### Was passt (keep)
- Schritt-Indikator im Wizard inkl. Kicker ueber der Headline

### Aenderungen (fix/improve)
- [x] Klarer machen, dass der Nutzer ein Ziel auswaehlen muss
- [x] Slider/Karussell mit Indikator versehen (Anzahl Items + aktuelle Position)
- [x] Mobile: Karussell swipebar machen
- [x] Mobile/Tablet: Tap auf Kachel muss als Interaktion funktionieren (Button darf nicht hinter der Falz verschwinden)
- [x] Checkbox-/Radio-Button-Placement verbessern

### Offene Punkte (discuss/decide)
- [ ] Entscheiden: Position von "Schritt x von y" als Kicker (ja/nein und genaue Position)
- [ ] Entscheiden: Reihenfolge/Position der finalen Buttons und Infos
- [ ] Entscheiden: "Individuelles Sparziel" als letztes Karussell-Item aufnehmen statt abseits der Auswahl

## 2) Auswahl Sparbetrag
### Was passt (keep)
- Zwei Wege sind uebersichtlich gestaltet (auch wenn in MMP evtl. nur einer bleibt)
- Kriterien fuer die Sparbetrag-Ermittlung sind sichtbar

### Aenderungen (fix/improve)
- [x] "Zurueck"-Button auffaelliger machen
- [x] Klarer machen, dass genau einer der zwei Wege gewaehlt werden muss (inkl. kurzer Unterschied-Erklaerung)
- [x] Tag oberhalb der Headline in den Cards klaeren (wirkt derzeit widerspruechlich)
- [x] Tausender-Trennzeichen im Freitextfeld ergaenzen
- [x] Erklaertexte unter den initialen Werten sprachlich konkreter machen
- [x] Widerspruch aufloesen: Beispiel Immobilie (Sparziel 350.000 vs. Text "30k-80k Eigenkapital")
- [x] Button-Hierarchie in den Cards vereinheitlichen (klarer Primary, konsistent zwischen Cards)
- [x] Bug beheben: Klick auf "Mit diesem Betrag fortfahren" darf Schritt 3 nicht ueberspringen

### Offene Punkte (discuss/decide)
- [ ] Entscheiden: Hover-Effekt beibehalten (Karte klickbar machen) oder Hover-Effekt entfernen
- [ ] Entscheiden: Sollen Cards generell direkt klickbar sein

## 3) Ermittlung Sparbetrag
### Was passt (keep)
- Auswahloptionen sind sehr intuitiv
- Emojis passen und wirken nicht kindlich
- Bei selbstgewaehltem Ziel sind Kriterien generisch, aber passend

### Aenderungen (fix/improve)
- [x] Inkonsistenz aufloesen: Faktoren in Schritt 2 vs. modifizierbare Faktoren in Schritt 3 angleichen
- [x] Beispiel Immobilie korrigieren: Eigenkapitalquote wird erwaehnt, muss dann auch aenderbar sein (oder Text anpassen)
- [x] Hinweis-/Erklaertext oberhalb der Auswahlen platzieren
- [x] "Fortfahren"-Button klar priorisieren (nicht nur Secondary)
- [x] Navigation/Buttons stabilisieren (kein springendes Verhalten zwischen Screens)

### Offene Punkte (discuss/decide)
- [ ] Entscheiden: Welche Kriterien und Betraege hier fachlich gezeigt werden sollen (Deka-Klaerung)
- [ ] Entscheiden: Optionen mit +/- 0 anzeigen oder weglassen

## 4) Auswahl Spardauer
### Was passt (keep)
- Empfohlene Spardauern sind plakativ und leicht waehlbar
- Manuelle Anpassung via +/- ist gut
- "Gut zu wissen" ist stark

### Aenderungen (fix/improve)
- [x] Klarer machen, dass einer der zwei Wege gewaehlt werden muss
- [x] Optional kurz erklaeren, wie die Wahl das Ergebnis veraendert (Sparziel/Sparrate)
- [x] Begruenden, warum genau diese Zeitraeume empfohlen werden
- [x] "Gut zu wissen" ausfuehrlicher und erklaerender formulieren
- [x] "Fortfahren"-Button klar priorisieren (nicht nur Secondary)
- [x] Verstaendlichkeit der +/- Buttons verbessern

### Offene Punkte (discuss/decide)
- [ ] Entscheiden: Direkte Zahleneingabe erlauben (statt nur +/-)

## 5) Ergebnisseite
### Was passt (keep)
- CTAs direkt unter der Ueberschrift
- Sparrate prominent und klar
- Sparziel und Laufzeit direkt editierbar

### Aenderungen (fix/improve)
- [x] Renditeannahmen verstaendlicher erklaeren
- [x] Konkretisieren, was "3,0% geringes Risiko" bedeutet (Produkt/Produktklasse)
- [x] Pruefen, ob Deka-Produkte schon hier eingebunden/konkretisiert werden
- [x] Sprung im benoetigten Know-how gegenueber Rest-Wizard reduzieren
- [x] "Wie setzt sich der Zielbetrag zusammen" spezifischer machen
- [x] Inhalt statt Modal direkt unter den Bearbeitungsoptionen anzeigen
- [x] Erklaerungen zur Umsetzung immer sichtbar machen (nicht nur im Tab "Umsetzung")
- [x] Externe Links bzw. neuer Tab bei Optimierungs-Cards klar kennzeichnen
- [x] CTAs am Seitenende wiederholen
- [x] Mobile: bei Rendite-Anpassung unmittelbares Feedback zur Betragsaenderung zeigen

### Offene Punkte (discuss/decide)
- [ ] Entscheiden: Rendite-Auswahl als eigener Schritt statt auf Ergebnisseite
- [ ] Entscheiden: Tab-Reihenfolge aendern auf "Uebersicht, Umsetzung, Optimierung"
- [ ] Entscheiden: "Monatliche Sparrate" sticky machen (Desktop + Mobile)
- [ ] Entscheiden: Inhalt "Sparziel zur Realitaet werden lassen" aus Tab "Umsetzung" herausziehen und permanent unterhalb platzieren

## Decision-Pass Backlog (Iteration 6)
- [ ] Schritt-1-Kickerposition finalisieren
- [ ] Button-Reihenfolge in Schritt 1 finalisieren
- [ ] Platzierung "Individuelles Sparziel" im Karussell finalisieren
- [ ] Hover-/Klickmodell fuer Schritt-2-Cards finalisieren
- [ ] Fachliche Kriterien-/Betragslogik in Schritt 3 finalisieren
- [ ] Entscheidung zur direkten Zahleneingabe in Schritt 4
- [ ] Entscheidung: Rendite-Auswahl als eigener Schritt
- [ ] Entscheidung: finale Tab-Reihenfolge in Schritt 5
- [ ] Entscheidung: sticky "Monatliche Sparrate"
- [ ] Entscheidung: permanenter Placement-Block "Sparziel zur Realitaet werden lassen"
