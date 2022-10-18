import path from 'path'

import { app, BrowserWindow } from 'electron'
import Fastify from 'fastify'
import autocannonUiBackend from 'autocannon-ui-backend'
import autoCannonUiFrontend from 'autocannon-ui-frontend'
import * as pkgDir from 'pkg-dir'
import fastifyStatic from '@fastify/static'
import * as Store from 'electron-store'
import { setContentSecurityPolicy } from 'electron-util'

const store = new Store()

async function start() {
  const address = await startServer()
  await app.whenReady()
  await createWindow(address)
}

async function startServer() {
  const fastify = Fastify()
  fastify.register(autocannonUiBackend)

  const uiRoot = path.join(
    pkgDir.packageDirectorySync(autoCannonUiFrontend),
    'dist'
  )
  fastify.register(fastifyStatic, {
    root: uiRoot
  })

  const address = await fastify.listen()
  await fastify.ready()
  return address
}

async function createWindow(address) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js'),
      additionalArguments: [JSON.stringify(store.store)]
    }
  })

  await win.loadURL(address)

  win.on('close', async () => {
    const localStorage = await win.webContents.executeJavaScript(
      'JSON.stringify(window.localStorage)'
    )

    store.store = JSON.parse(localStorage)
  })

  setContentSecurityPolicy(`
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
 `)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

start()
