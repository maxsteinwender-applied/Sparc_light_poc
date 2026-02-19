import { expect, test } from '@playwright/test'

test('sparc light smoke test', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await page.goto('/')

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
  await page.getByRole('button', { name: 'Optimierung' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Optimierung' })).toBeVisible()
  await page.getByRole('button', { name: 'Umsetzung' }).click()
  await expect(page.getByRole('heading', { level: 2, name: 'Die Sparplan-Favoriten.' })).toBeVisible()

  await page.goto('/__smoke/chart')
  await expect(page.getByRole('heading', { level: 1, name: 'Chart Smoke' })).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()

  expect(pageErrors).toEqual([])
})
