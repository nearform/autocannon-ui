'use strict'

const autocannon = require('autocannon')

function execute(options, cb) {
  const {
    url,
    connections,
    pipelining,
    duration,
    timeout,
    title,
    header,
    body,
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
      title,
      header,
      body
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
