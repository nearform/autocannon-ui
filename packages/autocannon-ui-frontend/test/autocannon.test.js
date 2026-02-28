import { test, expect } from '@playwright/test'

test('should run the test and can see the progress bar', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })
  await page.locator('[data-testid="run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'visible' })
})

test('should run the test and can cancel the progress bar', async ({
  page
}) => {
  await page.goto('http://localhost:3000/')
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })
  await page.locator('[data-testid="run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'visible' })
  await page.locator('[data-testid="cancel-run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })
})

test('should run the test and can clear the run test results', async ({
  page
}) => {
  await page.goto('http://localhost:3000/')
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })
  await page.locator('[data-testid="run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'visible' })
  await page.locator('[data-testid="clear-all-button"]').click()
})

test('should run the test and download the result as JSON', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })
  await page.locator('[data-testid="run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })

  await expect(
    page.locator('[data-testid="download-result-button"]')
  ).toBeVisible()

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-testid="download-result-button"]').click()
  ])

  expect(download.suggestedFilename()).toMatch(/^autocannon-result-\d+\.json$/)

  const path = await download.path()
  const fs = await import('fs')
  const content = fs.readFileSync(path, 'utf-8')
  const parsed = JSON.parse(content)
  expect(parsed).toHaveProperty('requests')
  expect(parsed).toHaveProperty('latency')
  expect(parsed).toHaveProperty('throughput')
})

test('should run the two tests and can compare them', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })

  // First run
  await page.locator('#url').fill('https://www.google.com')
  await page.locator('[data-testid="run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })

  await expect(page.locator('[data-testid="compare-button"]')).toBeDisabled()

  // Second run
  await page.locator('#url').fill('https://www.yahoo.com')
  await page.locator('[data-testid="run-button"]').click()
  await page.locator('span.MuiLinearProgress-bar').waitFor({ state: 'hidden' })

  const resultsCheckboxes = await page.$$('[data-testid="result-checkbox"]')
  for (let i = 0; i < resultsCheckboxes.length; i++) {
    await resultsCheckboxes[i].click()
  }

  await expect(page.locator('[data-testid="compare-button"]')).toBeEnabled()

  await page.locator('[data-testid="compare-button"]').click()

  await page.locator('.compare-dialog')
})
