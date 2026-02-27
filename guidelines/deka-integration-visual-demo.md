# Deka.de Integration Demo (Visual Only)

Stand: 2026-02-27

## Ziel
Diese Notiz beschreibt eine rein visuelle Simulation der späteren Einbindung auf der Sparwelt-Kampagnenseite in der deka.de-Umgebung.

## Erwartete Platzierung
- Der Wizard wird als eigene Inhaltssektion innerhalb der Sparwelt-Kampagnenseite eingebunden.
- Oberhalb der Sektion bleiben Kampagnen-Headline, Intro-Teaser und ggf. bestehende Inhaltsmodule der Seite erhalten.
- Die exakte Position im finalen Seitenverlauf bleibt fachlich offen und wird mit dem Kunden abgestimmt.

## Viewport- und Spacing-Annahmen
- Mobile: 375 px Breite als Referenz für die engste Hauptstrecke.
- Tablet: 768 px Breite als Zwischenstufe.
- Desktop: 1280 px+ Breite für die volle Inhaltsbreite.
- Seitencontainer der Kampagnenseite soll den Wizard horizontal zentriert einbetten; keine seitlichen Overflow-Effekte.

## Sticky/Header/Ticker-Annahmen
- In der Prototyp-Variante ist ein roter Test-Ticker aktiv.
- Für die visuelle Integration dient der Ticker nur als Platzhalter für globale Banner-/Hinweisflächen.
- Sticky-Offsets müssen in der Zielumgebung mit vorhandenen deka.de Header-Höhen abgestimmt werden, damit keine Überlagerung entsteht.

## Bekannte Unterschiede Prototyp vs. Produktion
- Prototyp enthält explizite Testumgebungs-/Internal-Use-Kennzeichnung.
- SEO-Titel/Description sind auf Prototyp-Branding gesetzt.
- Die Integration erfolgt aktuell nicht technisch in die deka.de Runtime (kein iframe/postMessage-Contract in dieser Iteration).
- Ziel dieser Phase ist Scope-/UX-Validierung, nicht Produktions-Deployment.
