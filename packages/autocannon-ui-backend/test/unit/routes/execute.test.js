import { test } from 'node:test'
import assert from 'node:assert/strict'

import Fastify from 'fastify'

import index from '../../../index.js'

test('execute', async t => {
  await t.test('returns 400 if url is not valid', async () => {
    const fastify = Fastify().register(index)

    const response = await fastify.inject({
      url: '/api/execute',
      method: 'POST',
      body: {
        url: 'whatever'
      }
    })

    assert.equal(response.statusCode, 400)
  })

  await t.test('supports localhost urls with port', async () => {
    const fastify = Fastify().register(index)

    const response = await fastify.inject({
      url: '/api/execute',
      method: 'POST',
      body: {
        url: 'http://localhost:3000'
      }
    })

    assert.equal(response.statusCode, 200)
  })
})
