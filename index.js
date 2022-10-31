import path from 'path'
import pino from 'pino'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import child_process from 'child_process'
import { fileURLToPath } from 'url'
import autocannonUiBackend from 'autocannon-ui-backend'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    logger.info(`autocannon-ui started on ${address}.`)
  } catch (e) {
    logger.error(e)
  }
}

async function startServer() {
  const fastify = Fastify()
  fastify.register(autocannonUiBackend)

  const uiRoot = path.join(__dirname, 'packages/autocannon-ui-frontend/dist')

  fastify.register(fastifyStatic, {
    root: uiRoot
  })

  const address = await fastify.listen()
  await fastify.ready()

  const start =
    process.platform == 'darwin'
      ? 'open'
      : process.platform == 'win32'
      ? 'start'
      : 'xdg-open'

  child_process.exec(start + ' ' + address)

  return address
}

start()
