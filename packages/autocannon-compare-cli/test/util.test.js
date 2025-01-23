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
  assert.equal(formatBytes(100), '100 bytes')
  assert.equal(formatBytes(1024), '1.0 KB')
  assert.equal(formatBytes(1024000), '1000 KB')
  assert.equal(formatBytes(1073741824), '1.0 GB')
})

test('calculateDiffPercentage', async () => {
  assert.equal(calculateDiffPercentage(1, 1), '=')
  assert.equal(calculateDiffPercentage(0, 0), '=')
  assert.equal(calculateDiffPercentage(0, 10), '-100%')
  assert.equal(calculateDiffPercentage(10, 0), '+100%')
  assert.equal(calculateDiffPercentage(10, 2), '+400%')
  assert.equal(calculateDiffPercentage(2, 10), '-80%')
  assert.equal(calculateDiffPercentage(6.5, 10), '-35%')
})

test('getColor', async () => {
  assert.equal(getColor('+100%', Kind.moreIsBetter), chalk.green)
  assert.equal(getColor('-100%', Kind.moreIsBetter), chalk.red)
  assert.equal(getColor('-100%', Kind.lessIsBetter), chalk.green)
  assert.equal(getColor('+100%', Kind.lessIsBetter), chalk.red)
})

test('formatValue', async t => {
  await t.test('should format generic integers', async () => {
    assert.equal(formatValue(1300, 'requests.total'), '1,300')
  })
  await t.test('should format latency value with unit', async () => {
    assert.equal(formatValue(100, 'latency.average'), '100ms')
  })
  await t.test('should format throughput value with unit', async () => {
    assert.equal(formatValue(100, 'throughput.total'), '100 bytes')
  })
})
