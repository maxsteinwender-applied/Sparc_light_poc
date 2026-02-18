import { expect, test } from '@playwright/test'

test('sparc light smoke test', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await page.goto('/')

  await expect(page.getByText('Sparc Light')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1, name: 'Wofür möchten Sie sparen?' })).toBeVisible()

  await page.goto('/__smoke/chart')
  await expect(page.getByRole('heading', { level: 1, name: 'Chart Smoke' })).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()

  expect(pageErrors).toEqual([])
})
