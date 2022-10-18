import { spawn } from 'child_process'
import path from 'path'

import electron from 'electron'

const appPath = path.join(__dirname, 'main.js')
const proc = spawn(electron, [appPath], { stdio: 'inherit' })

proc.on('close', code => process.exit(code))
