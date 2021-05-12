'use strict'

const autocannon = require('autocannon')

function startBench(options, finishedBench) {
  const { url, connections, pipelining, duration } = options
  const autoInstance = autocannon(
    {
      url,
      connections,
      pipelining,
      duration
    },
    finishedBench
  )

  const { renderProgressBar, renderLatencyTable, renderResultsTable } = options
  autocannon.track(autoInstance, {
    renderProgressBar,
    renderLatencyTable,
    renderResultsTable
  })
  return autoInstance
}

module.exports = {
  startBench
}
