import chalkTable from 'chalk-table'
import {
  readJsonFile,
  Kind,
  getColor,
  compareValues,
  formatValue
} from './util.js'

const createTableRows = comparisonResult =>
  Object.entries(comparisonResult).reduce(
    (results, [measure, { diff, a, b, kind }]) => {
      const color = getColor(diff, kind)

      const addColor = row =>
        Object.entries(row).reduce(
          (rows, [measure, value]) => ({ ...rows, [measure]: color(value) }),
          {}
        )

      return [
        ...results,
        addColor({
          measure,
          diff,
          a: formatValue(a, measure),
          b: formatValue(b, measure)
        })
      ]
    },
    []
  )

export const compareResults = async (pathA, pathB) => {
  const a = await readJsonFile(pathA)
  const b = await readJsonFile(pathB)

  const compareTests = (a, b) => ({
    'requests.total': compareValues(a.requests.total, b.requests.total),
    'throughput.total': compareValues(a.throughput.total, b.throughput.total),
    'latency.max': compareValues(
      a.latency.max,
      b.latency.max,
      Kind.lessIsBetter
    ),
    'latency.min': compareValues(
      a.latency.min,
      b.latency.min,
      Kind.lessIsBetter
    ),
    'latency.average': compareValues(
      a.latency.average,
      b.latency.average,
      Kind.lessIsBetter
    ),
    errors: compareValues(a.errors, b.errors, Kind.lessIsBetter),
    timeouts: compareValues(a.timeouts, b.timeouts, Kind.lessIsBetter)
  })

  const comparisonResult = compareTests(a, b)

  const table = chalkTable(
    {
      columns: [
        { field: 'measure', name: 'measure' },
        { field: 'diff', name: 'diff from #a to #b' },
        { field: 'a', name: 'a' },
        { field: 'b', name: 'b' }
      ]
    },
    createTableRows(comparisonResult)
  )
  console.log(table)
}
