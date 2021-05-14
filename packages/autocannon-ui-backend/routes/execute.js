'use strict'

const execute = require('../services/autocannon')

module.exports = async function (fastify) {
  fastify.post('/api/execute', function (request, reply) {
    const { body } = request

    reply.raw.setHeader('content-type', 'text/event-stream')
    reply.raw.flushHeaders()

    const options = {
      url: body.url,
      connections: body.connections || 10,
      pipelining: body.pipelining || 1,
      duration: body.duration || 10,
      renderProgressBar: false,
      renderLatencyTable: false,
      renderResultsTable: false,
      json: true
    }

    function callback(err, result) {
      if (err) {
        return reply.code(500).send()
      }

      reply.raw.end(`result:${JSON.stringify(result)}\n\n`)
    }

    let count = 0

    function getProgress() {
      const ratio = Math.min(Math.max(++count / options.duration, 0), 1)
      return Math.floor(ratio * 100)
    }

    const instance = execute(options, callback)

    instance.on('tick', () => {
      const progress = getProgress()

      if (progress < 100) {
        reply.raw.write(`progress:${progress}\n\n`)
      }
    })
  })
}
