import { expect, test, type Page } from '@playwright/test'

const openHome = async (page: Page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
}

const normalizeFontFamily = (value: string) => value.toLowerCase().replaceAll('"', '').replaceAll("'", '')

test('typography: app root, hero heading, and icons use the configured font families', async ({ page }) => {
  await openHome(page)

  const bodyFontFamily = await page.evaluate(() => window.getComputedStyle(document.body).fontFamily)
  expect(normalizeFontFamily(bodyFontFamily)).toContain('dekafrutiger')

  const heroHeading = page.getByRole('heading', { level: 1, name: /Wofür möchten Sie sparen\?/i })
  await expect(heroHeading).toBeVisible()
  const headingFontFamily = await heroHeading.evaluate((element) => window.getComputedStyle(element).fontFamily)
  expect(normalizeFontFamily(headingFontFamily)).toContain('dekafrutiger')
  const headingFontWeight = await heroHeading.evaluate((element) => window.getComputedStyle(element).fontWeight)
  expect(Number.parseInt(headingFontWeight, 10)).toBe(400)

  const icon = page.locator('.material-symbols-outlined').first()
  await expect(icon).toBeVisible()
  const iconFontFamily = await icon.evaluate((element) => window.getComputedStyle(element).fontFamily)
  expect(normalizeFontFamily(iconFontFamily)).toContain('material symbols outlined')
})

test('typography: branded font files load without failed requests', async ({ page }) => {
  const brandedFontResponses: Array<{ url: string; status: number }> = []
  const failedBrandedFontResponses: string[] = []

  page.on('response', (response) => {
    const url = response.url()
    if (!/\.(woff2?|otf|ttf)(\?|$)/i.test(url)) {
      return
    }
    if (!/(DekaFrutiger|DKFrutiger)/i.test(url)) {
      return
    }

    const status = response.status()
    brandedFontResponses.push({ url, status })

    if (status >= 400) {
      failedBrandedFontResponses.push(`${status} ${url}`)
    }
  })

  await openHome(page)

  await expect
    .poll(() => page.evaluate(() => document.fonts.check('400 16px "DekaFrutiger"')))
    .toBe(true)

  await expect
    .poll(() => page.evaluate(() => document.fonts.check('400 32px "DekaFrutiger"')))
    .toBe(true)

  await page.waitForTimeout(500)

  expect(brandedFontResponses.length).toBeGreaterThan(0)
  expect(failedBrandedFontResponses).toEqual([])
})
