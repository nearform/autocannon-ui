'use strict'

const { startBench } = require('../../services/autocannon')

module.exports = async function (fastify) {
  fastify.post('/execute', function (request, reply) {
    const options = request.body
    const runOptions = {
      url: options.url,
      connections: options.connections || 10,
      pipelining: options.pipelining || 1,
      duration: options.duration || 10,
      renderProgressBar: false,
      renderLatencyTable: false,
      renderResultsTable: false,
      json: true
    }

    function finishedBench(err, result) {
      if (err) {
        return reply.code(500).send('Something went wrong')
      }
      if (!reply.sent) {
        return reply.raw.end(JSON.stringify(result))
      }
    }

    let count = 0
    function getProgress() {
      let ratio = count / runOptions.duration
      ratio = Math.min(Math.max(ratio, 0), 1)
      const percent = Math.floor(ratio * 100)
      count++
      return percent
    }

    const autoInstance = startBench(runOptions, finishedBench)
    autoInstance.on('tick', data => {
      const currentProgress = getProgress(0)
      reply.raw.write(JSON.stringify({ progress: currentProgress }))
    })
  })
}
