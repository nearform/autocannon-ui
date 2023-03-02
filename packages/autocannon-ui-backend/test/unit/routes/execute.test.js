import t from 'tap'
import Fastify from 'fastify'

import index from '../../../index.js'

t.test('execute', async t => {
  t.test('returns 400 if url is not valid', async t => {
    const fastify = Fastify().register(index)

    const response = await fastify.inject({
      url: '/api/execute',
      method: 'POST',
      body: {
        url: 'whatever'
      }
    })

    t.same(response.statusCode, 400)
  })

  t.test('supports localhost urls with port', async t => {
    const fastify = Fastify().register(index)

    const response = await fastify.inject({
      url: '/api/execute',
      method: 'POST',
      body: {
        url: 'http://localhost:3000'
      }
    })

    t.same(response.statusCode, 200)
  })
})
