import { test } from 'node:test'
import puppeteer from 'puppeteer'

test('Autocannon UI Puppeteer Test', async t => {
  let browser
  let page

  t.before(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      devtools: false,
      timeout: 60000
    })
    page = await browser.newPage()
  })

  t.after(async () => {
    await browser.close()
  })

  await t.test('should run the test and can see the progress bar', async () => {
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })
    await page.click('[data-testid="run-button"]')
    await page.waitForSelector('span.MuiLinearProgress-bar')
  })

  await t.test(
    'should run the test and can cancel the progress bar',
    async () => {
      await page.goto('http://localhost:3000/')
      await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })
      await page.click('[data-testid="run-button"]')
      await page.waitForSelector('span.MuiLinearProgress-bar')
      await page.click('[data-testid="cancel-run-button"]')
      await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })
    }
  )

  await t.test(
    'should run the test and can clear the run test results',
    async () => {
      await page.goto('http://localhost:3000/')
      await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })
      await page.click('[data-testid="run-button"]')
      await page.waitForSelector('span.MuiLinearProgress-bar')
      await page.waitForSelector('[data-testid="clear-all-button"]')
      await page.click('[data-testid="clear-all-button"]')
    }
  )

  await t.test('should run the two tests and can compare them', async () => {
    const navigationPromise = page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    })

    await page.goto('http://localhost:3000/')
    await navigationPromise

    await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })

    await page.$eval('#url', el => (el.value = 'https://www.google.com'))
    await page.click('[data-testid="run-button"]')
    await navigationPromise

    await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })

    await page.evaluate(
      () =>
        document.querySelector('[data-testid="compare-button"][disabled]') !==
        null
    )

    await navigationPromise
    await page.waitForSelector('#url')
    await page.$eval('#url', el => (el.value = 'https://www.yahoo.com'))
    await page.click('[data-testid="run-button"]')
    await navigationPromise

    await page.waitForSelector('span.MuiLinearProgress-bar', { hidden: true })

    const resultsCheckboxes = await page.$$('[data-testid="result-checkbox"]')
    for (let i = 0; i < resultsCheckboxes.length; i++) {
      await resultsCheckboxes[i].click()
    }

    await navigationPromise

    await page.waitForSelector('[data-testid="compare-button"]')
    await page.click('[data-testid="compare-button"]')
    await navigationPromise

    await page.waitForSelector('.compare-dialog')
  })
})
