import { describe, expect, it } from 'vitest'
import { buildResultPdfViewModel } from '../../services/resultPdf'

describe('resultPdf payload mapping', () => {
  it('maps numeric values into formatted PDF copy', () => {
    const model = buildResultPdfViewModel({
      goalLabel: 'Urlaub / Reise',
      durationYears: 12,
      targetYear: 2038,
      targetAmount: 85_000,
      monthlySavings: 420,
      annualRate: 0.056,
      totalInvested: 60_480,
      totalReturn: 24_520,
      generatedAt: new Date('2026-02-19T09:00:00.000Z'),
      resultDeepLink: 'https://example.test/?goal=travel&target=85000&years=12&strategy=balanced',
    })

    expect(model.title).toBe('Ihr persönlicher Vorsparplan')
    expect(model.overviewTitle).toBe('Ihr Ergebnis im Überblick')
    expect(model.monthlySavingsLabel).toBe('420 EUR')
    expect(model.overviewSentence).toContain('12 Jahren')
    expect(model.overviewSentence).toContain('420 EUR')
    expect(model.overviewSentence).toContain('5,6 %')
    expect(model.overviewSentence).toContain('85.000 EUR')
    expect(model.profileRows).toHaveLength(8)
    expect(model.profileRows.find((entry) => entry.label === 'Sparziel')?.value).toBe('Urlaub / Reise')
    expect(model.profileRows.find((entry) => entry.label === 'Erträge')?.value).toBe('+24.520 EUR')
  })

  it('keeps next steps and placeholder legal/contact blocks', () => {
    const model = buildResultPdfViewModel({
      goalLabel: 'Altersvorsorge',
      durationYears: 20,
      targetYear: 2046,
      targetAmount: 150_000,
      monthlySavings: 390,
      annualRate: 0.05,
      totalInvested: 93_600,
      totalReturn: 56_400,
      generatedAt: new Date('2026-02-19T09:00:00.000Z'),
      resultDeepLink: 'https://example.test/?goal=retirement&target=150000&years=20&strategy=growth',
    })

    expect(model.nextSteps).toEqual([
      'Abschluss in der Filiale',
      'Abschluss in der Internetfiliale',
      'Abschluss in der S-Invest-App',
    ])
    expect(model.contactLines).toHaveLength(3)
    expect(model.legalTitle).toContain('vorläufig')
    expect(model.legalText.length).toBeGreaterThan(120)
  })
})
