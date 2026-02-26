import { expect, test, type Page } from '@playwright/test'

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

const goToStep4WithTravelGoal = async (page: Page) => {
  await goToStep2WithTravelGoal(page)
  await page.getByRole('button', { name: /Weiter zur Spardauer/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()
}

test('sparc light smoke test', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await goToStep2WithTravelGoal(page)

  const amountInput = page.getByPlaceholder('z. B. 12.500')
  const amountBefore = Number((await amountInput.inputValue()).replace(/\D/g, ''))

  await page.getByRole('button', { name: /Betrag ermitteln/i }).first().click()
  await page.getByRole('button', { name: /Viele Flüge/i }).click()
  await page.getByRole('button', { name: /Betrag übernehmen/i }).click()

  const amountAfter = Number((await amountInput.inputValue()).replace(/\D/g, ''))
  expect(amountAfter).toBeGreaterThan(amountBefore)

  await page.getByRole('button', { name: /Weiter zur Spardauer/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()

  await page.getByRole('button', { name: 'Ergebnis anzeigen' }).click()

  await expect(page.getByRole('heading', { level: 1, name: /Ihr Sparziel .* wird greifbar\./i })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Als PDF herunterladen' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Link kopieren' }).first()).toBeVisible()

  await page.getByRole('tab', { name: 'Optimierung' }).click()
  await expect(page.locator('#result-panel-optimization')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: /Sparplan zu optimieren/i })).toBeVisible()

  await page.getByRole('tab', { name: 'Umsetzung' }).click()
  const implementationPanel = page.locator('#result-panel-implementation')
  await expect(implementationPanel).toBeVisible()
  await expect(
    implementationPanel.getByRole('heading', { name: /Sparziel zur Realität werden lassen/i }).first(),
  ).toBeVisible()

  await page.goto('/__smoke/chart')
  await expect(page.getByRole('heading', { level: 1, name: 'Chart Smoke' })).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()

  expect(pageErrors).toEqual([])
})

test('step 1 keeps continue disabled until a goal is selected', async ({ page }) => {
  await openHome(page)

  const continueButton = page.getByRole('button', { name: /Mit .* fortfahren/i })
  await expect(continueButton).toBeDisabled()

  await selectTravelGoal(page)
  await expect(continueButton).toBeEnabled()
})

test('step 1 custom goal needs non-empty input to continue', async ({ page }) => {
  await openHome(page)

  await page.getByRole('button', { name: 'Ziel auswählen: Individuelles Sparziel' }).click()
  const continueButton = page.getByRole('button', { name: /Mit .* fortfahren/i })
  const customGoalInput = page.getByLabel('Wie heißt Ihr Sparziel?')

  await expect(customGoalInput).toBeVisible()
  await expect(continueButton).toBeDisabled()

  await customGoalInput.fill('   ')
  await expect(continueButton).toBeDisabled()

  await customGoalInput.fill('Musikstudio')
  await expect(continueButton).toBeEnabled()
})

test('step 4 back button returns to step 2', async ({ page }) => {
  await goToStep4WithTravelGoal(page)

  await page.getByRole('button', { name: 'Zurück' }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
})

test('progress bar shows a check icon for completed steps', async ({ page }) => {
  await goToStep2WithTravelGoal(page)

  const stepOneProgress = page.getByTestId('progress-item-1')
  await expect(stepOneProgress.locator('.material-symbols-outlined')).toHaveText('check')
  await expect(stepOneProgress.getByRole('button', { name: /Zu Schritt 1: Sparziel wechseln/i })).toBeVisible()
})

test('progress bar allows direct backward navigation to completed step 1 from step 4', async ({ page }) => {
  await goToStep4WithTravelGoal(page)

  await page.getByRole('button', { name: /Zu Schritt 1: Sparziel wechseln/i }).click()
  await expect(page.getByRole('heading', { level: 1, name: /Wofür möchten Sie sparen\?/i })).toBeVisible()
})

test('progress bar allows direct backward navigation from step 5 to step 4 via completed step 3', async ({ page }) => {
  await goToStep4WithTravelGoal(page)
  await page.getByRole('button', { name: 'Ergebnis anzeigen' }).click()
  await expect(page.getByRole('heading', { level: 1, name: /Ihr Sparziel .* wird greifbar\./i })).toBeVisible()

  await page.getByRole('button', { name: /Zu Schritt 3: Spardauer wechseln/i }).click()
  await expect(page.getByRole('heading', { level: 2, name: /Wann möchten Sie/i })).toBeVisible()
})

test('progress bar keeps active and upcoming steps non-interactive', async ({ page }) => {
  await goToStep2WithTravelGoal(page)

  const stepTwoProgress = page.getByTestId('progress-item-2')
  const stepThreeProgress = page.getByTestId('progress-item-3')

  await expect(stepTwoProgress.getByRole('button')).toHaveCount(0)
  await expect(stepThreeProgress.getByRole('button')).toHaveCount(0)

  await stepThreeProgress.click()
  await expect(page.getByRole('heading', { level: 2, name: /Wie viel möchten Sie/i })).toBeVisible()
})
