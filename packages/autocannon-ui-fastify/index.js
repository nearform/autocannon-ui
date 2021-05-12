'use strict'

module.exports = async function (fastify, options) {
  fastify.register(require('fastify-cors'))

  fastify.register(require('./routes/v1/client'), { prefix: '/v1' })
}
