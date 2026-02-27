import { expect, test, type Page } from '@playwright/test'

const openHome = async (page: Page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const startWizardButton = page.getByRole('button', { name: 'Sparziel berechnen' })
  if (await startWizardButton.isVisible()) {
    await startWizardButton.click()
  }
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
  await expect(page.getByRole('button', { name: 'Als PDF herunterladen' })).toHaveCount(0)
  const copyLinkButtons = page.getByRole('button', { name: 'Link kopieren' })
  await expect(copyLinkButtons).toHaveCount(2)
  await expect(copyLinkButtons.first()).toHaveClass(/ui-button-primary/)

  await page.getByRole('tab', { name: 'Optimierung' }).click()
  await expect(page.locator('#result-panel-optimization')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: /Sparplan zu optimieren/i })).toBeVisible()

  await page.getByRole('tab', { name: 'Umsetzung' }).click()
  const implementationPanel = page.locator('#result-panel-implementation')
  await expect(implementationPanel).toBeVisible()
  await expect(
    implementationPanel.getByRole('heading', { name: /Sparziel zur Realität werden lassen/i }),
  ).toHaveCount(0)
  const implementationCardsHeading = page.getByRole('heading', { name: /Sparziel zur Realität werden lassen/i })
  const persistentCardsSection = page.getByTestId('implementation-cards-section')
  const planShareHeading = page.getByRole('heading', { name: /Plan speichern oder teilen/i })
  await expect(implementationCardsHeading).toBeVisible()
  await expect(persistentCardsSection).toBeVisible()
  await expect(planShareHeading).toBeVisible()

  const cardsSectionBox = await persistentCardsSection.boundingBox()
  const planShareBox = await planShareHeading.boundingBox()
  expect(cardsSectionBox?.y).toBeDefined()
  expect(planShareBox?.y).toBeDefined()
  expect((cardsSectionBox?.y ?? 0)).toBeLessThan(planShareBox?.y ?? 0)

  await page.goto('/__smoke/chart')
  await expect(page.getByRole('heading', { level: 1, name: 'Chart Smoke' })).toBeVisible()
  await expect(page.locator('canvas').first()).toBeVisible()

  expect(pageErrors).toEqual([])
})

test('custom rate calculate scrolls to monthly savings and shows temporary success toast', async ({ page }) => {
  await goToStep4WithTravelGoal(page)
  await page.getByRole('button', { name: 'Ergebnis anzeigen' }).click()

  const monthlySavingsHeading = page.getByText('Ihre monatliche Sparrate')
  const customRateToggle = page.getByRole('checkbox', { name: 'Eigene Rendite verwenden' })
  const customRateInput = page.getByLabel('Individuelle Rendite in Prozent')
  const calculateButton = page.getByRole('button', { name: 'Berechnen' })
  const successToast = page.getByText('Sparrate wurde aktualisiert.')

  await expect(monthlySavingsHeading).toBeVisible()
  await customRateToggle.check()
  await customRateInput.fill('4,2')
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }))

  await calculateButton.click()

  await expect(successToast).toBeVisible()
  await expect(monthlySavingsHeading).toBeInViewport()
  await expect(successToast).toBeHidden({ timeout: 7000 })
})

test('step 1 keeps continue disabled until a goal is selected', async ({ page }) => {
  await openHome(page)

  const continueButton = page.getByRole('button', { name: /Mit .* fortfahren/i })
  await expect(continueButton).toBeDisabled()

  await selectTravelGoal(page)
  await expect(continueButton).toBeEnabled()
})

test('result deep link with canonical interest restores configuration', async ({ page }) => {
  await page.goto('/?goal=travel&target=12000&years=8&interest=variant2', {
    waitUntil: 'domcontentloaded',
  })

  await expect(page.getByRole('heading', { level: 1, name: /Ihr Sparziel .* wird greifbar\./i })).toBeVisible()
  await expect(page.getByText('Urlaub / Reise').first()).toBeVisible()
  await expect(page.getByText('bei ca. 5,6 % p.a. · 8 Jahre · Ziel: 12.000 EUR')).toBeVisible()
})

test('result deep link supports legacy strategy parameter during migration', async ({ page }) => {
  await page.goto('/?goal=travel&target=12000&years=8&strategy=growth', {
    waitUntil: 'domcontentloaded',
  })

  await expect(page.getByRole('heading', { level: 1, name: /Ihr Sparziel .* wird greifbar\./i })).toBeVisible()
  await expect(page.getByRole('button', { name: /Variante C/i })).toBeVisible()
  await expect(page.getByText('Ihre Auswahl').first()).toBeVisible()
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

test('step 2 info icon shows tooltip on hover and focus', async ({ page }) => {
  await goToStep2WithTravelGoal(page)

  const infoButton = page.getByRole('button', { name: 'Info zum Orientierungswert' })
  const tooltip = page.getByRole('tooltip', { name: /Der Orientierungswert basiert auf dem Durchschnittswert/i })

  await infoButton.hover()
  await expect(tooltip).toBeVisible()

  await infoButton.focus()
  await expect(tooltip).toBeVisible()
})

test('step 4 info icon shows tooltip on tap in mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await goToStep4WithTravelGoal(page)

  const infoButton = page.getByRole('button', { name: 'Info zur Spardauer' })
  const tooltip = page.getByRole('tooltip', { name: /Die Spardauer ist der Zeitraum bis zu Ihrem Sparziel/i })

  await infoButton.click()
  await expect(tooltip).toBeVisible()
})

test('step 4 marks matching preset as selected when entering a recommended duration', async ({ page }) => {
  await goToStep4WithTravelGoal(page)

  const durationInput = page.getByLabel('Spardauer in Jahren')
  const matchingPresetButton = page.getByRole('button', { name: /in 5 Jahren/i })

  await durationInput.fill('5')
  await expect(matchingPresetButton).toHaveAttribute('aria-pressed', 'true')
})

test('step 4 shows validation error for invalid custom duration input', async ({ page }) => {
  await goToStep4WithTravelGoal(page)

  const durationInput = page.getByLabel('Spardauer in Jahren')
  const resultButton = page.getByRole('button', { name: 'Ergebnis anzeigen' })
  const errorMessage = page.locator('p.text-\\[\\#AD1111\\]')

  await durationInput.fill('41')
  await expect(errorMessage).toHaveText('Bitte wählen Sie eine Spardauer zwischen 1 und 40 Jahren.')
  await expect(resultButton).toBeDisabled()

  await durationInput.fill('5.5')
  await expect(errorMessage).toHaveText('Bitte geben Sie nur ganze Zahlen ohne Dezimalstellen oder Buchstaben ein.')
  await expect(resultButton).toBeDisabled()

  await durationInput.fill('5')
  await expect(errorMessage).toHaveCount(0)
  await expect(resultButton).toBeEnabled()
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
