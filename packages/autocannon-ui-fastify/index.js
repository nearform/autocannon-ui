'use strict'

const cors = require('fastify-cors')
const fastify = require('fastify')({
  logger: { level: 'debug' },
  http2: false
})

fastify.register(cors, { origin: true })

fastify.register(require('./routes/v1/client'), { prefix: '/v1' })

fastify.setErrorHandler((err, request, reply) => {
  reply.status(500).send({
    error: err.message
  })
})

const start = async () => {
  try {
    await fastify.listen(5001)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
