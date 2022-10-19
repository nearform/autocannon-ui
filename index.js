#!/usr/bin/env node
const { exec } = require("child_process");

function main() {
  exec("npm run start", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
}

if (require.main === module) {
  main();
}
