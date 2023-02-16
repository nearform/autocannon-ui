import chalk from 'chalk'
import { readFile } from 'fs/promises'

export const readJsonFile = async path =>
  JSON.parse(await readFile(new URL(path, import.meta.url)))

export const Kind = {
  lessIsBetter: 'lessIsBetter',
  moreIsBetter: 'moreIsBetter'
}

export const getColor = (diff, kind) => {
  let color = chalk.white

  if (diff.startsWith('+')) {
    color = kind === Kind.moreIsBetter ? chalk.green : chalk.red
  } else if (diff.startsWith('-')) {
    color = kind === Kind.lessIsBetter ? chalk.green : chalk.red
  }

  return color
}

export const compareValues = (a, b, kind = Kind.moreIsBetter) => ({
  diff: calculateDiffPercentage(a, b),
  a,
  b,
  kind
})

export const calculateDiffPercentage = (valueA, valueB) => {
  if (valueA === valueB || valueA / valueB === 1) {
    return '='
  }

  if (valueA === 0) {
    return '-100%'
  }

  if (valueB === 0) {
    return '+100%'
  }

  const sign = valueA > valueB ? '+' : ''

  const percentage = (
    Math.round(((valueA - valueB) / valueB) * 100 * 100, 2) / 100
  ).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })

  return `${sign}${percentage}%`
}

export const formatBytes = x => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  let l = 0
  let n = parseInt(x, 10) || 0

  while (n >= 1024 && ++l) {
    n = n / 1024
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]
}

export const formatValue = (value, measure) => {
  if (measure.includes('throughput')) {
    return formatBytes(value)
  }

  if (measure.includes('latency')) {
    return `${value}ms`
  }

  return value.toLocaleString()
}
