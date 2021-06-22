'use strict'

const path = require('path')

const logger = require('pino')({
  level: 'info',
  prettyPrint: true,
  base: null,
  timestamp: false
})
const Fastify = require('fastify')
const autocannonUiBackend = require('autocannon-ui-backend')
const pkgDir = require('pkg-dir')

async function start() {
  try {
    const address = await startServer()
    logger.info(`Autocannon-UI started. Open ${address} in your browser.`)
  } catch (e) {
    logger.error(e)
  }
}

async function startServer() {
  const fastify = Fastify()
  fastify.register(autocannonUiBackend)

  const uiRoot = path.join(
    pkgDir.sync(require.resolve('autocannon-ui-frontend')),
    'dist'
  )
  fastify.register(require('fastify-static'), {
    root: uiRoot
  })

  const address = await fastify.listen()
  await fastify.ready()
  return address
}

start()
