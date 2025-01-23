import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

import Fastify from 'fastify'

import index from '../../../index.js'

test('compare', async t => {
  const a = JSON.parse(
    fs.readFileSync('test/fixtures/fixture-a.json').toString()
  )
  const b = JSON.parse(
    fs.readFileSync('test/fixtures/fixture-b.json').toString()
  )

  await t.test(
    'compare: returns 200 for comparing two valid results',
    async () => {
      const fastify = Fastify().register(index)
      const response = await fastify.inject({
        url: '/api/compare',
        method: 'POST',
        body: {
          a,
          b
        }
      })

      assert.equal(response.statusCode, 200)
    }
  )

  await t.test(
    'compare-v2: returns 200 for comparing two valid results',
    async () => {
      const fastify = Fastify().register(index)
      const response = await fastify.inject({
        url: '/api/compare-v2',
        method: 'POST',
        body: {
          a,
          b
        }
      })

      assert.equal(response.statusCode, 200)
    }
  )
})
