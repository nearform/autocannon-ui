'use strict'

const S = require('fluent-json-schema')

const execute = require('../services/autocannon')

const schema = {
  body: S.object()
    .prop('url', S.string().format('url').required())
    .prop('connections', S.integer().default(10))
    .prop('duration', S.anyOf([S.number(), S.string()]).default(10))
    .prop('pipelining', S.integer().default(1))
    .prop('method', S.string().default('GET'))
    .prop('timeout', S.integer().default(10))
    .prop('title', S.string())
    .prop('headers', S.string())
    .prop('body', S.string())
}

module.exports = async function (fastify) {
  fastify.register(require('@fastify/cors'), { origin: '*' })
  fastify.post('/api/execute', { schema }, function (request, reply) {
    reply.raw.setHeader('Access-Control-Allow-Origin', '*')
    reply.raw.setHeader('content-type', 'text/event-stream')
    reply.raw.flushHeaders()

    const options = {
      ...request.body,
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

    request.socket.on('close', () => {
      request.log.info('Connection closed.')
      instance.stop()
    })
  })
}
