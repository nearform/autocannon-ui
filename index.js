#!/usr/bin/env node
const { spawn } = require("child_process");

function main() {
  spawn("npm start")
}

if (require.main === module) {
  main();
}
