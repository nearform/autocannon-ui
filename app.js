import path from 'path'

import pino from 'pino'
import Fastify from 'fastify'
import * as autocannonUiBackend from 'autocannon-ui-backend'
import fastifyStatic from '@fastify/static'

const transport = pino.transport({
  target: 'pino-pretty',
  options: { colorize: true }
})

const logger = pino(
  {
    level: 'info',
    base: null,
    timestamp: false
  },
  transport
)

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
    process.cwd(),
    'packages/autocannon-ui-frontend/dist'
  )

  fastify.register(fastifyStatic, {
    root: uiRoot
  })

  const address = await fastify.listen()
  await fastify.ready()
  return address
}

start()
