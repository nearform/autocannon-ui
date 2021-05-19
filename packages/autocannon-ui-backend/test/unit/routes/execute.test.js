'use strict'

const t = require('tap')
const Fastify = require('fastify')

t.test('execute', async t => {
  t.test('returns 404 if url is not valid', async t => {
    const fastify = Fastify().register(require('../../'))

    const response = await fastify.inject({
      url: '/api/execute',
      method: 'POST',
      body: {
        url: 'whatever'
      }
    })

    t.same(response.statusCode, 400)
  })
})
