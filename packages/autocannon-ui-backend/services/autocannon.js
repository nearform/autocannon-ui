'use strict'

const autocannon = require('autocannon')

function execute(options, cb) {
  const {
    url,
    connections,
    pipelining,
    duration,
    timeout,
    maxConnectionRequests,
    maxOverallRequests,
    connectionRate,
    overallRate,
    reconnectRate,
    renderProgressBar,
    renderLatencyTable,
    renderResultsTable
  } = options

  const instance = autocannon(
    {
      url,
      connections,
      pipelining,
      duration,
      timeout,
      maxConnectionRequests,
      maxOverallRequests,
      connectionRate,
      overallRate,
      reconnectRate
    },
    cb
  )

  autocannon.track(instance, {
    renderProgressBar,
    renderLatencyTable,
    renderResultsTable
  })

  return instance
}

module.exports = execute
