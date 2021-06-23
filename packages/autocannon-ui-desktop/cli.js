#!/usr/bin/env node
'use strict'

const { spawn } = require('child_process')
const path = require('path')

const electron = require('electron')

const appPath = path.join(__dirname, 'main.js')
const proc = spawn(electron, [appPath], { stdio: 'inherit' })

proc.on('close', code => process.exit(code))
