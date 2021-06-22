'use strict'

const store = JSON.parse(process.argv.slice(-1))

console.log('Restoring localStorage from store')
console.dir(store)

Object.entries(store).forEach(([key, value]) =>
  window.localStorage.setItem(key, value)
)
