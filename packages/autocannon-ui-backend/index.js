import fastifyCors from '@fastify/cors'

import execute from './routes/execute.js'
import compare from './routes/compare.js'
import comparev2 from './routes/compare-v2.js'

export default async function (fastify, options) {
  fastify.register(fastifyCors, { origin: '*' })

  fastify.register(execute, options)
  fastify.register(compare, options)
  fastify.register(comparev2, options)
}
