# Autocannon-ui

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

This monorepo contains packages and applications which provide a GUI for using autocannon while maintaining the same user experience.


<!-- toc -->

- [Getting started](#getting-started)
- [Development](#development)
- [Packages](#packages)
  * [`autocannon-fastify`](#autocannon-fastify)
  * [`autocannon-react`](#autocannon-react)

<!-- tocstop -->

## Getting started

You'll need yarn and lerna installed globally:

- `npm i -g yarn lerna`

The easiest way to try this out is to run:

- `yarn dev`
- browse to [`http://localhost:3000`](http://localhost:3000)

## Development

To easily develop the packages of this repo you can execute:

```sh
yarn dev
```

This will run:

- `autocannon-react` build in watch mode so you can change the React components and see the result immediately
- `autocannon-fastify` in standalone mode to have a server running

## Packages

### `autocannon-react`

A library of React components which provide the UI.

### `autocannon-fastify`

- a standalone Fastify application
