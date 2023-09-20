import fs from 'fs'
import path from 'path'
import t from 'tap'
import Fastify from 'fastify'

import index from '../../../index.js'

t.test('compare', async t => {

  const a = JSON.parse(fs.readFileSync('test/fixtures/fixture-a.json').toString());
  const b = JSON.parse(fs.readFileSync('test/fixtures/fixture-b.json').toString());
  
  t.test('compare: returns 200 for comparing two valid results', async t => {
    const fastify = Fastify().register(index)
    const response = await fastify.inject({
      url: '/api/compare',
      method: 'POST',
      body: { 
        a, 
        b 
      }
    })

    t.same(response.statusCode, 200)
  })

  t.test('compare-v2: returns 200 for comparing two valid results', async t => {
    const fastify = Fastify().register(index)

    const response = await fastify.inject({
      url: '/api/compare-v2',
      method: 'POST',
      body: {
        a,
        b
      }
    })

    t.same(response.statusCode, 200)
  })
})
