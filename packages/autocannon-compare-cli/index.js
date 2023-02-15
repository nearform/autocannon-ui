import chalkTable from 'chalk-table'
import {
  readJsonFile,
  Kind,
  getColor,
  getDiff,
  formatDiff,
  withUnit
} from './util.js'
import optimist from 'optimist'

const parseArgs = () => {
  const argv = optimist
    .usage('Usage: $0 -a [path] -b [path]')
    .demand(['a', 'b']).argv
  return argv
}

const compareVersions = async (pathA, pathB) => {
  const a = await readJsonFile(pathA)
  const b = await readJsonFile(pathB)

  const createCompare = (a, b) => ({
    'requests.total': getDiff(a.requests.total, b.requests.total),
    'throughput.total': getDiff(a.throughput.total, b.throughput.total),
    'latency.max': getDiff(
      a.latency.max,
      b.latency.max,
      Kind.lessIsBetter,
      'ms'
    ),
    'latency.min': getDiff(
      a.latency.min,
      b.latency.min,
      Kind.lessIsBetter,
      'ms'
    ),
    'latency.average': getDiff(
      a.latency.average,
      b.latency.average,
      Kind.lessIsBetter,
      'ms'
    ),
    errors: getDiff(a.errors, b.errors, Kind.lessIsBetter),
    timeouts: getDiff(a.timeouts, b.timeouts, Kind.lessIsBetter)
  })

  const result = createCompare(a, b)

  const table = chalkTable(
    {
      columns: [
        { field: 'measure', name: 'measure' },
        { field: 'diff', name: 'diff from #a to #b' },
        { field: 'a', name: 'a' },
        { field: 'b', name: 'b' }
      ]
    },
    Object.entries(result).reduce(
      (acc, [measure, { diff, a, b, kind, unit }]) => {
        const withColor = getColor(diff, kind)

        return [
          ...acc,
          {
            measure: withColor(measure),
            diff: withColor(formatDiff(diff, unit)),
            a: withColor(withUnit(a, unit)),
            b: withColor(withUnit(b, unit))
          }
        ]
      },
      []
    )
  )
  console.log(table)
}

const { a: pathA, b: pathB } = parseArgs()

compareVersions(pathA, pathB)
