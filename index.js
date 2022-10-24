#!/usr/bin/env node
const { spawn } = require("child_process");

function main() {
  spawn("npm start", [], { stdio: 'inherit', shell: true })
}

if (require.main === module) {
  main();
}
