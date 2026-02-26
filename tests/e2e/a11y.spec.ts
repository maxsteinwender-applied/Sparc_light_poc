import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const openHome = async (page: Page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
}

const selectTravelGoal = async (page: Page) => {
  await page.getByRole('button', { name: 'Ziel auswählen: Urlaub / Reise' }).click()
}

const goToStep2WithTravelGoal = async (page: Page) => {
  await openHome(page)
  await selectTravelGoal(page)
  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
}

const expectNoCriticalA11yViolations = async (page: Page, context: string) => {
  const { violations } = await new AxeBuilder({ page }).analyze()
  const criticalViolations = violations.filter((violation) => violation.impact === 'critical')
  const details = criticalViolations
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(' | ')}`)
    .join('\n')

  expect(
    criticalViolations,
    `Critical accessibility violations found in ${context}${details ? `\n${details}` : ''}`,
  ).toEqual([])
}

test('a11y: step 1 has no critical axe violations', async ({ page }) => {
  await openHome(page)
  await expect(page.getByRole('heading', { level: 1, name: /Wofür möchten Sie sparen\?/i })).toBeVisible()
  await expectNoCriticalA11yViolations(page, 'step 1')
})

test('a11y: steps 2, 4 and 5 have no critical axe violations', async ({ page }) => {
  await goToStep2WithTravelGoal(page)
  await expectNoCriticalA11yViolations(page, 'step 2')

  await page.getByRole('button', { name: /Weiter zur Spardauer/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()
  await expectNoCriticalA11yViolations(page, 'step 4')

  await page.getByRole('button', { name: 'Ergebnis anzeigen' }).click()
  await expect(page.getByRole('heading', { level: 1, name: /Ihr Sparziel .* wird greifbar\./i })).toBeVisible()
  await expectNoCriticalA11yViolations(page, 'step 5')
})
