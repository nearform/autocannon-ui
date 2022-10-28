import execute from './routes/execute.js'
import compare from './routes/compare.js'

export default async function (fastify, options) {
  fastify.register(execute, options)
  fastify.register(compare, options)
}
