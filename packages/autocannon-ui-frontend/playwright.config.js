import { defineConfig } from '@playwright/test'

export default defineConfig({
  timeout: 60000,
  outputDir: '.test_results'
})
