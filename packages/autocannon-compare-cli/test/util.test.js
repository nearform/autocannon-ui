import { test } from 'node:test'
import assert from 'node:assert/strict'

import chalk from 'chalk'
import {
  calculateDiffPercentage,
  formatBytes,
  formatValue,
  getColor,
  Kind
} from '../util.js'

test('formatBytes', async () => {
  assert.strictEqual(formatBytes(100), '100 bytes')
  assert.strictEqual(formatBytes(1024), '1.0 KB')
  assert.strictEqual(formatBytes(1024000), '1000 KB')
  assert.strictEqual(formatBytes(1073741824), '1.0 GB')
})

test('calculateDiffPercentage', async () => {
  assert.strictEqual(calculateDiffPercentage(1, 1), '=')
  assert.strictEqual(calculateDiffPercentage(0, 0), '=')
  assert.strictEqual(calculateDiffPercentage(0, 10), '-100%')
  assert.strictEqual(calculateDiffPercentage(10, 0), '+100%')
  assert.strictEqual(calculateDiffPercentage(10, 2), '+400%')
  assert.strictEqual(calculateDiffPercentage(2, 10), '-80%')
  assert.strictEqual(calculateDiffPercentage(6.5, 10), '-35%')
})

test('getColor', async () => {
  assert.strictEqual(getColor('+100%', Kind.moreIsBetter), chalk.green)
  assert.strictEqual(getColor('-100%', Kind.moreIsBetter), chalk.red)
  assert.strictEqual(getColor('-100%', Kind.lessIsBetter), chalk.green)
  assert.strictEqual(getColor('+100%', Kind.lessIsBetter), chalk.red)
})

test('formatValue', async t => {
  await t.test('should format generic integers', async () => {
    assert.strictEqual(formatValue(1300, 'requests.total'), '1,300')
  })
  await t.test('should format latency value with unit', async () => {
    assert.strictEqual(formatValue(100, 'latency.average'), '100ms')
  })
  await t.test('should format throughput value with unit', async () => {
    assert.strictEqual(formatValue(100, 'throughput.total'), '100 bytes')
  })
})
