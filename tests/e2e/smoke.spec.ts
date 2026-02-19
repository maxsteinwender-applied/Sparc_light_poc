import { expect, test, type Page } from '@playwright/test'

const openHome = async (page: Page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
}

test('sparc light smoke test', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await openHome(page)

  await expect(page.getByText('Sparc Light')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Wofür möchten Sie sparen?' })).toBeVisible()
  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
  await page.getByRole('button', { name: 'Mit diesem Betrag fortfahren' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()
  await page.getByRole('button', { name: 'Ergebnis anzeigen' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Ihre Weltreise wird greifbar.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Als PDF herunterladen' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Link kopieren' })).toBeVisible()
  await page.getByRole('tab', { name: 'Optimierung' }).click()
  await expect(page.locator('#result-panel-optimization')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Optimierung' })).toBeVisible()
  await page.getByRole('tab', { name: 'Umsetzung' }).click()
  await expect(page.locator('#result-panel-implementation')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Die Sparplan-Favoriten.' })).toBeVisible()

  await page.goto('/__smoke/chart')
  await expect(page.getByRole('heading', { level: 1, name: 'Chart Smoke' })).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()

  expect(pageErrors).toEqual([])
})

test('step 4 back button returns to step 3 when factors are selected', async ({ page }) => {
  await openHome(page)

  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
  await page.getByRole('button', { name: 'Betrag ermitteln' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()

  await page.getByRole('button', { name: /Viele Flüge/i }).click()
  await page.getByRole('button', { name: 'Weiter zur Laufzeit' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()

  await page.getByRole('button', { name: 'Zurück' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()
})

test('step 4 back button returns to step 2 when no factors are selected', async ({ page }) => {
  await openHome(page)

  await page.getByRole('button', { name: /Mit .* fortfahren/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
  await page.getByRole('button', { name: 'Betrag ermitteln' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Was ist Ihnen bei/i })).toBeVisible()

  await page.getByRole('button', { name: 'Weiter zur Laufzeit' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()

  await page.getByRole('button', { name: 'Zurück' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
})
