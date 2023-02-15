import chalk from 'chalk'
import { readFile } from 'fs/promises'

export const readJsonFile = async path => {
  return JSON.parse(await readFile(new URL(path, import.meta.url)))
}

export const Kind = {
  lessIsBetter: 'lessIsBetter',
  moreIsBetter: 'moreIsBetter'
}

export const getColor = (diff, kind) => {
  let color = chalk.white

  if (diff > 0) {
    color = kind === Kind.moreIsBetter ? chalk.green : chalk.red
  } else if (diff < 0) {
    color = kind === Kind.lessIsBetter ? chalk.green : chalk.red
  }

  return color
}

export const getDiff = (a, b, kind = Kind.moreIsBetter, unit = '') => ({
  diff: a - b,
  a,
  b,
  kind,
  unit
})

export const withUnit = (value, unit) =>
  unit ? `${value}${unit}` : value.toLocaleString()

export const formatDiff = (diff, unit) => {
  if (diff == 0) {
    return '='
  }

  let res = withUnit(diff.toLocaleString(), unit)

  if (diff > 0) {
    res = `+${res}`
  }
  return res
}
