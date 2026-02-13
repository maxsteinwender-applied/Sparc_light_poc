# Prototype Ticker Porting (Vue 3 + Tailwind)

Diese Anleitung beschreibt die 1:1-Uebernahme der Prototyp-Ticker-Leiste in ein anderes Codex-Projekt mit Vue 3 und Tailwind.

## 1. Komponente uebernehmen

Kopiere die Datei:

- `/Users/maxsteinwender/Documents/Codex Projects/Sparc Light POC/src/app/components/PrototypeTickerBar.vue`

In dein Zielprojekt, z. B. nach:

- `src/app/components/PrototypeTickerBar.vue`

## 2. Globale CSS-Bloecke uebernehmen

Uebernimm aus `src/styles/theme.css` diese Teile in die globale Theme-/Style-Datei des Zielprojekts:

1. CSS-Variablen in `:root`:
- `--prototype-ticker-height`
- `--app-header-height`
- `--app-sticky-stack-height`
- `--app-sticky-content-offset`

2. Keyframes:
- `@keyframes prototype-ticker-marquee`

3. Utility-Klassen:
- `.prototype-ticker-track`
- `.prototype-ticker-item`

4. Reduced-Motion-Regel:
- `.prototype-ticker-track { animation: none; transform: translateX(0); }` innerhalb von `@media (prefers-reduced-motion: reduce)`

## 3. Im Layout einhaengen

Importiere `PrototypeTickerBar` in deinem zentralen Layout und baue denselben Sticky-Stack:

1. Wrapper setzen:
- `sticky top-0 z-[110]`

2. Reihenfolge:
- Oben `PrototypeTickerBar`
- Darunter dein bestehender Header

3. Bestehende Header-Hoehe beibehalten (im Sparc Light: `h-20`).

## 4. Sticky-Offsets anpassen

Wenn im Zielprojekt bereits weitere sticky Elemente existieren (z. B. Sidebars), passe deren `top` auf:

- `var(--app-sticky-content-offset)`

Beispiel (Tailwind arbitrary value):

- `md:top-[var(--app-sticky-content-offset)]`

## 5. Standardtext und Props

Die Komponente stellt diese Props bereit:

- `message?: string`
- `speedSeconds?: number` (Default `24`)
- `separator?: string` (Default ` • `)

Standardtext in Sparc Light:

- `TESTUMGEBUNG: Diese Lösung ist ein Prototyp und nicht für produktive Nutzung bestimmt.`

## 6. Schnelltest-Checkliste

1. Ticker bleibt beim Scrollen oben sticky sichtbar.
2. Header bleibt direkt unter dem Ticker sticky sichtbar.
3. Ticker laeuft nahtlos ohne sichtbaren Sprung.
4. Bestehende sticky-Elemente ueberlappen nicht mit Header/Ticker.
5. Modal/Overlay kann den Ticker ueberdecken (wenn z-index hoeher als `110`).
6. Bei aktivem `prefers-reduced-motion` stoppt die Laufanimation.
