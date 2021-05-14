'use strict'

module.exports = async function (fastify, options) {
  fastify.register(require('./routes/execute'), options)
}
