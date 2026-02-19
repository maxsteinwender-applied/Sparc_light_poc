# PROJ-2 - Ergebnisseite V1 Redesign

## Status
- In Progress

## Ziel
Die Ergebnisseite (Schritt 5) wird von einem Placeholder zu einer nutzbaren Abschlussseite mit klaren Handlungsoptionen, verständlicher Renditeauswahl und konkreten Umsetzungswegen ausgebaut.

## Scope
- Neuer 2-Spalten-Hero mit:
  - großer Monatsraten-KPI,
  - 3 Standard-Renditekarten (A/B/C) inkl. Risiko-Erklärung,
  - 1 individueller Renditekarte mit Eingabe (0,0% bis 15,0%).
- Steckbriefkarte rechts mit Icon, Zielbetrag, Laufzeit, Zieljahr und Inline-Edit.
- Top-Aktionen:
  - PDF-Export,
  - Link kopieren (Deep-Link mit Queryparametern).
- Neuer 3-Tab-Bereich:
  - Übersicht,
  - Optimierung,
  - Umsetzung.
- Umsetzungstab mit statischer Kundenfavoriten-Komponente inkl. Tabelle und CTA.
- Weitere Schritte mit drei Abschlusswegen (Filiale, Internetfiliale, S-Invest App).

## Nicht im Scope (V1)
- E-Mail-/Messenger-/Wallet-Export.
- API-Integration für Fondsfavoriten.
- Interaktive Optimierungsaktivierung.

## Daten- und Interfaceänderungen
- `StrategyType` erweitert um `custom`.
- Neuer Wizard-State `customAnnualRate` inkl. Setter.
- Deep-Link Restore über Query (`goal`, `target`, `years`, `strategy`, `rate`) beim Laden.
- Neue Domain-Hilfsfunktion für Zeitgewinn bei höherer monatlicher Sparrate.

## Linkmatrix
- Sparrechner: `https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/vorsorge-und-sparen#Sparrechner`
- Fondsfinder: `https://www.deka.de/privatkunden/fondssuche`
- Terminvereinbarung: `https://www.deka.de/privatkunden/kontaktaufnahme/persoenliche-beratung`
- Internetfiliale: `https://www.sparkasse.de/`
- S-Invest App: kein Link
- Dynamisierung: `https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-fondssparplan#Dynamisierung`
- Starteinlage: `https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-fondssparplan`
- DK-Abräumsparen: `https://www.deka.de/privatkunden/unser-angebot/wertpapiersparen/deka-abraeumsparen`
- Höhere Sparrate: kein Link (Zeitgewinn-Metrik statt Link)

## Testbare Akzeptanzkriterien
1. Renditeauswahl A/B/C/custom ändert alle Ergebniswerte unmittelbar.
2. Custom-Rendite wird auf 0,0% bis 15,0% begrenzt.
3. Zielbetrag und Laufzeit sind in der Steckbriefkarte inline editierbar.
4. Helper-Link öffnet ein Modal.
5. PDF-Export bleibt funktionsfähig.
6. Copy-Link erzeugt valide URL mit den vereinbarten Queryparametern.
7. Tabs Übersicht/Optimierung/Umsetzung sind bedienbar und zeigen die vorgesehenen Inhalte.
8. Optimierungskarte "Höhere Sparrate" zeigt einen berechneten Zeitgewinn statt eines Links.
9. Umsetzungstab zeigt statische Favoritenliste und korrekte Abschlusslinks.
10. Vorherige E-Mail/Share-Flows sind in Step 5 nicht mehr sichtbar.
