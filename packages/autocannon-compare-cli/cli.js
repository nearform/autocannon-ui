import optimist from 'optimist'
import { compareResults } from './lib.js'
import chalkTable from 'chalk-table'
import { readJsonFile, getColor } from './util.js'

const addColor = rows =>
  rows.map(row => {
    const { diff, kind } = row
    const color = getColor(diff, kind)
    return Object.entries(row).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: color(val) }),
      {}
    )
  })

const main = async () => {
  const parseArgs = () =>
    optimist.usage('Usage: $0 -a [path] -b [path]').demand(['a', 'b']).argv

  const { a: pathA, b: pathB } = parseArgs()
  const resultA = await readJsonFile(pathA)
  const resultB = await readJsonFile(pathB)
  const resultsComparison = await compareResults(resultA, resultB)

  const tableOptions = {
    columns: [
      { field: 'measure', name: 'measure' },
      { field: 'diff', name: 'diff from #a to #b' },
      { field: 'a', name: 'a' },
      { field: 'b', name: 'b' }
    ]
  }
  const tableRows = addColor(resultsComparison)
  const table = chalkTable(tableOptions, tableRows)

  console.log(table)
}

main()
