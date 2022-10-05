'use strict'

const S = require('fluent-json-schema')
const compare = require('autocannon-compare')

const autocannonModel = S.object()
  .required()
  .prop('duration', S.number().required())
  .prop('latency', S.object().required())
  .prop('requests', S.object().required())
  .prop('throughput', S.object().required())

const schema = {
  body: S.object().prop('a', autocannonModel).prop('b', autocannonModel)
}

module.exports = async function (fastify) {
  fastify.post('/api/compare', { schema }, function (request, reply) {
    reply.raw.setHeader('Access-Control-Allow-Origin', '*')
    reply.send(compare(request.body.a, request.body.b))
  })
}
