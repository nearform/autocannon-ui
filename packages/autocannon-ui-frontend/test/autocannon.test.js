const puppeteer = require('puppeteer')

describe('Autocannon UI Puppeteer Test', function () {
  let browser
  let page

  before(async function () {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      devtools: false,
      timeout: 60000
    })
    page = await browser.newPage()
  })

  after(async function () {
    await browser.close()
  })

  it('should run the test and can see the progress bar', async function () {
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })
    await page.click('[data-testid="run-button"]')
    await page.waitForSelector('div.MuiLinearProgress-bar')
  })

  it('should run the test and can cancel the progress bar', async function () {
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })
    await page.click('[data-testid="run-button"]')
    await page.waitForSelector('div.MuiLinearProgress-bar')
    await page.click('[data-testid="cancel-run-button"]')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })
  })

  it('should run the test and can clear the run test results', async function () {
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })
    await page.click('[data-testid="run-button"]')
    await page.waitForSelector('div.MuiLinearProgress-bar')
    await page.waitForSelector('[data-testid="clear-all-button"]')
    await page.click('[data-testid="clear-all-button"]')
  })

  it('should run the two tests and can compare them', async function () {
    await page.goto('http://localhost:3000/')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })

    await page.$eval('#url', el => (el.value = 'https://www.google.com'))
    await page.click('[data-testid="run-button"]')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })

    await page.evaluate(
      () =>
        document.querySelector('[data-testid="compare-button"][disabled]') !==
        null
    )

    await page.$eval('#url', el => (el.value = 'https://www.yahoo.com'))
    await page.click('[data-testid="run-button"]')
    await page.waitForSelector('div.MuiLinearProgress-bar', { hidden: true })

    const resultsCheckboxes = await page.$$('[data-testid="result-checkbox"]')
    for (let i = 0; i < resultsCheckboxes.length; i++) {
      await resultsCheckboxes[i].click()
    }

    await page.click('[data-testid="compare-button"]')
    await page.waitForSelector('.compare-dialog')
  })
})
