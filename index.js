import path from 'path'
import pino from 'pino'
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import child_process from 'child_process'
import { program } from 'commander'
import { fileURLToPath } from 'url'
import autocannonUiBackend from './packages/autocannon-ui-backend/index.js'

program
  .option("-p, --port <port>", "listening port")
  .option("-h, --host <host>", "host to bind", "localhost")
  .parse();

const options = program.opts();
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

  let address = ""
  if (options.port || options.host) {
    address = await fastify.listen({port: options.port, host: options.host})
  } else {
    address = await fastify.listen()
  }
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
