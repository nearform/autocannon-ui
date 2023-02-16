import optimist from 'optimist'
import { compareResults } from './lib.js'

const parseArgs = () =>
  optimist.usage('Usage: $0 -a [path] -b [path]').demand(['a', 'b']).argv

const { a: pathA, b: pathB } = parseArgs()

compareResults(pathA, pathB)
