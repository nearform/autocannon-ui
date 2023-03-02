import { Kind, calculateDiff, formatValue } from './util.js'

const formatValues = comparison =>
  Object.entries(comparison).map(([measure, result]) => ({
    ...result,
    a: formatValue(result.a, measure),
    b: formatValue(result.b, measure),
    measure
  }))

export const compareResults = async (a, b) => {
  const comparison = {
    'requests.total': calculateDiff(a.requests.total, b.requests.total),
    'throughput.total': calculateDiff(a.throughput.total, b.throughput.total),
    'latency.max': calculateDiff(
      a.latency.max,
      b.latency.max,
      Kind.lessIsBetter
    ),
    'latency.min': calculateDiff(
      a.latency.min,
      b.latency.min,
      Kind.lessIsBetter
    ),
    'latency.average': calculateDiff(
      a.latency.average,
      b.latency.average,
      Kind.lessIsBetter
    ),
    errors: calculateDiff(a.errors, b.errors, Kind.lessIsBetter),
    timeouts: calculateDiff(a.timeouts, b.timeouts, Kind.lessIsBetter)
  }

  return formatValues(comparison)
}
