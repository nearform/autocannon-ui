import chalk from 'chalk'
import tap from 'tap'
import {
  calculateDiffPercentage,
  formatBytes,
  formatValue,
  getColor,
  Kind
} from '../util.js'

tap.test('formatBytes', async t => {
  t.equal(formatBytes(100), '100 bytes')
  t.equal(formatBytes(1024), '1.0 KB')
  t.equal(formatBytes(1024000), '1000 KB')
  t.equal(formatBytes(1073741824), '1.0 GB')
})

tap.test('calculateDiffPercentage', async t => {
  t.equal(calculateDiffPercentage(1, 1), '=')
  t.equal(calculateDiffPercentage(0, 0), '=')
  t.equal(calculateDiffPercentage(0, 10), '-100%')
  t.equal(calculateDiffPercentage(10, 0), '+100%')
  t.equal(calculateDiffPercentage(10, 2), '+400%')
  t.equal(calculateDiffPercentage(2, 10), '-80%')
  t.equal(calculateDiffPercentage(6.5, 10), '-35%')
})

tap.test('getColor', async t => {
  t.equal(getColor('+100%', Kind.moreIsBetter), chalk.green)
  t.equal(getColor('-100%', Kind.moreIsBetter), chalk.red)
  t.equal(getColor('-100%', Kind.lessIsBetter), chalk.green)
  t.equal(getColor('+100%', Kind.lessIsBetter), chalk.red)
})

tap.test('formatValue', async t => {
  t.test('should format generic integers', async t => {
    t.equal(formatValue(1300, 'requests.total'), '1,300')
  })
  t.test('should format latency value with unit', async t => {
    t.equal(formatValue(100, 'latency.average'), '100ms')
  })
  t.test('should format throughput value with unit', async t => {
    t.equal(formatValue(100, 'throughput.total'), '100 bytes')
  })
})
