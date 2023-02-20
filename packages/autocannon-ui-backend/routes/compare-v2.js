import S from 'fluent-json-schema'
import compare from '../../autocannon-compare-cli/lib'

const autocannonModel = S.object()
  .required()
  .prop('duration', S.number().required())
  .prop('latency', S.object().required())
  .prop('requests', S.object().required())
  .prop('throughput', S.object().required())

const schema = {
  body: S.object().prop('a', autocannonModel).prop('b', autocannonModel)
}

export default async function (fastify) {
  fastify.post('/api/compare-v2', { schema }, async function (request, reply) {
    reply.raw.setHeader('Access-Control-Allow-Origin', '*')
    reply.send(await compare(request.body.a, request.body.b))
  })
}
