import { expect, test, type Page } from '@playwright/test'

const openHome = async (page: Page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
}

const confirmTravelGoalSelection = async (page: Page) => {
  await page.getByRole('option', { name: 'Ziel auswählen: Urlaub / Reise' }).click()
}

test('sparc light smoke test', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await openHome(page)

  await expect(page.getByText('TESTUMGEBUNG:', { exact: false }).first()).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Wofür möchten Sie sparen?' })).toBeVisible()
  await confirmTravelGoalSelection(page)
  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
  await page.getByPlaceholder('z. B. 12.500').click()
  await page.getByRole('button', { name: 'Mit diesem Betrag fortfahren', exact: true }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()
  await page.getByRole('button', { name: 'Weiter zur Laufzeit' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()
  await page.getByRole('button', { name: 'in 2 Jahren' }).click()
  await page.getByRole('button', { name: 'Ergebnis anzeigen' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Ihr Sparziel Urlaub / Reise wird greifbar.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Als PDF herunterladen', exact: true })).toHaveCount(2)
  await expect(page.getByRole('button', { name: 'Link kopieren', exact: true })).toHaveCount(2)
  await page.getByRole('tab', { name: 'Optimierung' }).click()
  await expect(page.locator('#result-panel-optimization')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Finde Wege um deinen Sparplan zu optimieren' })).toBeVisible()
  await page.getByRole('tab', { name: 'Umsetzung' }).click()
  await expect(page.locator('#result-panel-implementation')).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'Sparziel zur Realität werden lassen' })).toBeVisible()

  await page.goto('/__smoke/chart')
  await expect(page.getByRole('heading', { level: 1, name: 'Chart Smoke' })).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()

  expect(pageErrors).toEqual([])
})

test('step 1 preselects first goal and keeps continue enabled', async ({ page }) => {
  await openHome(page)

  const continueButton = page.getByRole('button', { name: /Mit .* fortfahren/i })
  await expect(continueButton).toBeEnabled()
})

test('step 1 shows custom goal input when custom item is selected', async ({ page }) => {
  await openHome(page)

  await page.getByRole('option', { name: 'Ziel auswählen: Individuelles Sparziel' }).click()
  await expect(page.getByLabel('Wie heißt Ihr Sparziel?')).toBeVisible()
})

test('step 4 back button returns to step 3 when factors are selected', async ({ page }) => {
  await openHome(page)

  await confirmTravelGoalSelection(page)
  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
  await page.getByText('Geführter Weg').first().click()
  await page.getByRole('button', { name: 'Betrag ermitteln', exact: true }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()

  await page.getByRole('button', { name: /Viele Flüge/i }).click()
  await page.getByRole('button', { name: 'Weiter zur Laufzeit' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()

  await page.getByRole('button', { name: 'Zurück' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()
})

test('step 4 back button returns to step 2 when no factors are selected', async ({ page }) => {
  await openHome(page)

  await confirmTravelGoalSelection(page)
  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
  await page.getByText('Geführter Weg').first().click()
  await page.getByRole('button', { name: 'Betrag ermitteln', exact: true }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()

  await page.getByRole('button', { name: 'Weiter zur Laufzeit' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()

  await page.getByRole('button', { name: 'Zurück' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
})
