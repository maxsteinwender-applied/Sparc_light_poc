export type GoalId = 'wealth' | 'retirement' | 'kids' | 'property' | 'car' | 'travel' | 'purchase' | 'custom'

export interface GoalStrategy {
  label: string
  rate: number
}

export interface AmountFinderChip {
  label: string
  emoji: string
  cost: number
}

export interface GoalData {
  id: GoalId
  label: string
  icon?: string
  image: string
  shortTeaser: string
  whatItMeans: string[]
  typicalTimeHorizonOptions: number[]
  defaultTimeHorizonYears: number
  avgTargetAmountHint: string
  amountFinderCategories: string[]
  amountFinderChips: AmountFinderChip[]
  baseTargetAmount: number
  strategies: {
    security: GoalStrategy
    balanced: GoalStrategy
    growth: GoalStrategy
  }
  defaultStrategy: 'security' | 'balanced' | 'growth'
}

const COMMON_STRATEGIES = {
  security: {
    label: 'Sicherheitsorientiert',
    rate: 0.03,
  },
  balanced: {
    label: 'Ausgewogen',
    rate: 0.056,
  },
  growth: {
    label: 'Chancenorientiert',
    rate: 0.065,
  }
}

export const GOALS: GoalData[] = [
  {
    id: 'travel',
    label: 'Urlaub / Reise',
    icon: 'globe',
    image: "https://images.unsplash.com/photo-1649522864970-668297e255f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMHRyYXZlbCUyMGdsb2JlJTIwbWFwfGVufDF8fHx8MTc3MDAzNjAyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Machen Sie Ihre Reise planbar – passend zu Ihrem Stil und Ihrem Zeitplan.",
    whatItMeans: [
      "Kurz- bis mittelfristig.",
      "Budget hängt stark vom Reisestil ab.",
      "Sie können den Betrag über Ausprägungen ermitteln."
    ],
    typicalTimeHorizonOptions: [1, 2, 5],
    defaultTimeHorizonYears: 2,
    avgTargetAmountHint: "Als Orientierung: Eine größere Reise liegt oft bei 3.000–10.000 EUR pro Person.",
    amountFinderCategories: ["Dauer", "Reisestil", "Regionen", "Unterkunft", "Komfort"],
    amountFinderChips: [
      { label: "Viele Flüge", emoji: "✈️", cost: 800 },
      { label: "Komfort-Unterkünfte", emoji: "🏨", cost: 1200 },
      { label: "Mehrere Länder", emoji: "🌍", cost: 600 },
      { label: "Reise > 4 Wochen", emoji: "🗓️", cost: 900 },
      { label: "Puffer & Rücklagen", emoji: "🧰", cost: 500 },
      { label: "Wenige Ziele", emoji: "🧭", cost: -500 },
      { label: "Einfache Unterkünfte", emoji: "🛏️", cost: -800 },
      { label: "Kurze Reisedauer", emoji: "⏱️", cost: -1000 },
      { label: "Reisen zu zweit", emoji: "🧑‍🤝‍🧑", cost: 0 }
    ],
    baseTargetAmount: 6000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'balanced',
  },
  {
    id: 'kids',
    label: 'Sparen für die Kinder',
    icon: 'heart',
    image: "https://images.unsplash.com/photo-1599585183326-87b1fff61c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMHNhdmluZyUyMG1vbmV5fGVufDF8fHx8MTc3MDA0MTk4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Geben Sie Ihrem Kind einen finanziellen Startvorteil – passend zu Ihrem Budget.",
    whatItMeans: [
      "Für Ausbildung, Führerschein oder den Start ins Leben.",
      "Auch kleine Beträge können über Zeit viel bewirken.",
      "Zeithorizont orientiert sich am Alter des Kindes."
    ],
    typicalTimeHorizonOptions: [10, 15, 20],
    defaultTimeHorizonYears: 15,
    avgTargetAmountHint: "Viele Familien setzen Ziele wie 10.000–30.000 EUR bis zum 18. Lebensjahr.",
    amountFinderCategories: ["Ausbildung", "Start ins Leben", "Flexibilität", "Meilensteine", "Sicherheit"],
    amountFinderChips: [
      { label: "Langfristige Ausbildung", emoji: "🎓", cost: 5000 },
      { label: "Auslandssemester", emoji: "🌐", cost: 3000 },
      { label: "Zusätzliche Rücklagen", emoji: "🧰", cost: 2000 },
      { label: "Staatliche Unterstützung einkalkuliert", emoji: "🏛️", cost: -2500 },
      { label: "Regionale Ausbildung", emoji: "📍", cost: -3000 },
      { label: "Flexible Verwendung", emoji: "🎁", cost: 0 }
    ],
    baseTargetAmount: 15000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'balanced',
  },
  {
    id: 'retirement',
    label: 'Altersvorsorge',
    icon: 'hourglass',
    image: "https://images.unsplash.com/photo-1764816633859-136c97741472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGVsZGVybHklMjBjb3VwbGUlMjByZWxheGluZyUyMGJlYWNofGVufDF8fHx8MTc3MDAzNjAyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Sichern Sie Ihren Lebensstandard im Ruhestand – planbar und langfristig.",
    whatItMeans: [
      "Lange Laufzeiten können Renditechancen erhöhen.",
      "Regelmäßige Anpassungen helfen gegen Inflation.",
      "Ein realistischer Zeithorizont ist entscheidend."
    ],
    typicalTimeHorizonOptions: [15, 25, 35],
    defaultTimeHorizonYears: 25,
    avgTargetAmountHint: "Als grobe Orientierung: Viele planen mit 100.000–250.000 EUR zusätzlichem Kapital.",
    amountFinderCategories: ["Ruhestand", "Lebensstandard", "Inflation", "Sicherheit", "Zusatzrente"],
    amountFinderChips: [
      { label: "Früher Ruhestand", emoji: "🏖️", cost: 80000 },
      { label: "Höherer Lebensstandard", emoji: "🛋️", cost: 60000 },
      { label: "Längere Lebenserwartung", emoji: "🧓", cost: 40000 },
      { label: "Zusätzliche private Vorsorge vorhanden", emoji: "💼", cost: -50000 },
      { label: "Niedrigere Fixkosten im Alter", emoji: "🏠", cost: -40000 },
      { label: "Gesetzliche Pension berücksichtigt", emoji: "🧾", cost: 0 }
    ],
    baseTargetAmount: 250000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'balanced',
  },
  {
    id: 'property',
    label: 'Immobilie',
    icon: 'home',
    image: "https://images.unsplash.com/photo-1627141234469-24711efb373c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc3MDAwMTQyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Bauen Sie Eigenkapital auf – für Kauf, Bau oder Sanierung.",
    whatItMeans: [
      "Eigenkapital kann die Finanzierung erleichtern.",
      "Zeithorizont meist mittel- bis langfristig.",
      "Planbarkeit ist hier besonders wichtig."
    ],
    typicalTimeHorizonOptions: [5, 8, 12],
    defaultTimeHorizonYears: 8,
    avgTargetAmountHint: "Viele planen z. B. 30.000–80.000 EUR Eigenkapital als Zielgröße.",
    amountFinderCategories: ["Kauf", "Sanierung", "Puffer", "Nebenkosten", "Eigenkapitalquote"],
    amountFinderChips: [
      { label: "Neubau", emoji: "🏗️", cost: 20000 },
      { label: "Zentrale Lage", emoji: "🏙️", cost: 15000 },
      { label: "Größere Wohnfläche", emoji: "📐", cost: 12000 },
      { label: "Eigenkapitalquote erhöhen", emoji: "📊", cost: 8000 },
      { label: "Bestandsimmobilie", emoji: "🏚️", cost: -10000 },
      { label: "Ländliche Lage", emoji: "🌲", cost: -12000 },
      { label: "Eigenleistung", emoji: "🛠️", cost: -8000 },
      { label: "Förderung möglich", emoji: "🧑‍💼", cost: 0 }
    ],
    baseTargetAmount: 60000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'security',
  },
  {
    id: 'car',
    label: 'Auto',
    icon: 'gauge',
    image: "https://images.unsplash.com/photo-1609465397944-be1ce3ebda61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkYXNoYm9hcmQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njk5NDc2MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Planen Sie Ihr Auto ohne Stress – mit klarer Zielsumme und Termin.",
    whatItMeans: [
      "Typisch kurz- bis mittelfristig.",
      "Je kürzer die Laufzeit, desto wichtiger ist Stabilität.",
      "Optional: Einmalbetrag kann die Rate spürbar senken."
    ],
    typicalTimeHorizonOptions: [2, 4, 6],
    defaultTimeHorizonYears: 4,
    avgTargetAmountHint: "Viele setzen je nach Fahrzeug z. B. 10.000–30.000 EUR an.",
    amountFinderCategories: ["Fahrzeugtyp", "Neu/Gebraucht", "Extras", "Puffer", "Zeitpunkt"],
    amountFinderChips: [
      { label: "Neuwagen", emoji: "🆕", cost: 10000 },
      { label: "Elektrofahrzeug", emoji: "🔋", cost: 8000 },
      { label: "Höhere Ausstattung", emoji: "🎛️", cost: 6000 },
      { label: "Gebrauchtwagen", emoji: "♻️", cost: -7000 },
      { label: "Kleinwagen", emoji: "🚗", cost: -5000 },
      { label: "Finanzierung geplant", emoji: "📄", cost: 0 }
    ],
    baseTargetAmount: 25000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'security',
  },
  {
    id: 'purchase',
    label: 'Allgemeine Anschaffungen',
    icon: 'credit-card',
    image: "https://images.unsplash.com/photo-1668365011614-9c4a49a0e89d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwZnVybml0dXJlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwMDQxOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Finanzieren Sie größere Anschaffungen clever – ohne Ihr Budget zu überfordern.",
    whatItMeans: [
      "Für Möbel, Technik oder Renovierung.",
      "Klare Zielsumme, klare Laufzeit.",
      "Optional: Einmalbetrag reduziert die monatliche Belastung."
    ],
    typicalTimeHorizonOptions: [1, 3, 5],
    defaultTimeHorizonYears: 3,
    avgTargetAmountHint: "Viele planen für Anschaffungen z. B. 2.000–15.000 EUR.",
    amountFinderCategories: ["Kategorie", "Qualität", "Menge", "Timing", "Puffer"],
    amountFinderChips: [
      { label: "Hochwertige Produkte", emoji: "💎", cost: 3000 },
      { label: "Mehrere Anschaffungen", emoji: "🧺", cost: 2000 },
      { label: "Gebraucht / Refurbished", emoji: "🛒", cost: -1500 },
      { label: "Zeitlich gestaffelt", emoji: "🗓️", cost: -1000 },
      { label: "Flexible Auswahl", emoji: "🎯", cost: 0 }
    ],
    baseTargetAmount: 5000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'security',
  },
  {
    id: 'wealth',
    label: 'Vermögen aufbauen',
    icon: 'piggy-bank',
    image: "https://images.unsplash.com/photo-1769676391614-ee47569b1c69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWdneSUyMGJhbmslMjBjb2lucyUyMHNhdmluZ3N8ZW58MXx8fHwxNzcwMDM2MDI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Bauen Sie Schritt für Schritt Vermögen auf – flexibel und langfristig.",
    whatItMeans: [
      "Für langfristige Ziele oder finanzielle Freiheit.",
      "Regelmäßiges Sparen kann Schwankungen ausgleichen.",
      "Je länger der Zeitraum, desto mehr wirkt der Zinseszinseffekt."
    ],
    typicalTimeHorizonOptions: [10, 20, 30],
    defaultTimeHorizonYears: 20,
    avgTargetAmountHint: "Viele Anlegerinnen und Anleger starten z. B. mit 25.000 EUR als langfristigem Ziel.",
    amountFinderCategories: ["Zielgröße", "Risikoneigung", "Flexibilität", "Lebensstil", "Sicherheitsreserve"],
    amountFinderChips: [
      { label: "Finanzielle Freiheit", emoji: "🌟", cost: 15000 },
      { label: "Früher reduzieren (Arbeitszeit)", emoji: "⏳", cost: 10000 },
      { label: "Hohe Flexibilität behalten", emoji: "🎈", cost: 0 },
      { label: "Zusätzliche Sicherheitsreserve", emoji: "🛡️", cost: 5000 },
      { label: "Langfristig wachsen lassen", emoji: "📈", cost: 8000 }
    ],
    baseTargetAmount: 25000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'balanced',
  },
  {
    id: 'custom',
    label: 'Individuelles Sparziel erstellen',
    icon: 'pen-tool',
    image: "https://images.unsplash.com/photo-1568818693338-19e2a77d504c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwam91cm5hbCUyMHBlbiUyMHBsYW5uZXJ8ZW58MXx8fHwxNzcwMDQxOTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    shortTeaser: "Definieren Sie Ihr eigenes Ziel – wir helfen bei Betrag, Zeitraum und Plan.",
    whatItMeans: [],
    typicalTimeHorizonOptions: [3, 5, 10],
    defaultTimeHorizonYears: 5,
    avgTargetAmountHint: "Tipp: Starten Sie mit einer groben Schätzung. Sie können später alles anpassen.",
    amountFinderCategories: ["Zielgröße", "Risikoneigung", "Flexibilität", "Lebensstil", "Sicherheitsreserve"],
    amountFinderChips: [
      { label: "Puffer einplanen", emoji: "🛡️", cost: 2000 },
      { label: "Großzügig kalkulieren", emoji: "➕", cost: 5000 },
      { label: "Qualität hat Vorrang", emoji: "💎", cost: 3000 },
      { label: "Startkapital", emoji: "🏁", cost: 1000 },
      { label: "Nebenkosten", emoji: "🧾", cost: 500 }
    ],
    baseTargetAmount: 10000,
    strategies: COMMON_STRATEGIES,
    defaultStrategy: 'balanced',
  }
]

export const getGoal = (id: GoalId) => GOALS.find(g => g.id === id) || GOALS[0]
