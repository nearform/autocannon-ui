# autocannon-ui

[![ci](https://github.com/nearform/autocannon-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/nearform/autocannon-ui/actions/workflows/ci.yml)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

This monorepo contains packages and applications which provide a GUI for using autocannon while maintaining the same user experience.

<!-- toc -->

- [Getting started](#getting-started)
- [Development](#development)
- [Packages](#packages)
  * [`autocannon-frontend`](#autocannon-frontend)
  * [`autocannon-backend`](#autocannon-backend)
- [Running standalone application](#running-standalone-application)

<!-- tocstop -->

## Getting started

- `yarn`

The easiest way to try this out is to run:

- `yarn dev`
- browse to [`http://localhost:3000`](http://localhost:3000)

## Development

To easily develop the packages of this repo you can execute:

```sh
yarn dev
```

This will run:

- `autocannon-frontend` build in watch mode so you can change the React components and see the result immediately
- `autocannon-backend` in standalone mode to have a server running

## Packages

### `autocannon-frontend`

A library of React components which provide the UI.

### `autocannon-backend`

A standalone Fastify application.

## Running standalone application

The package can run as a standalone application via Electron wrapper that runs both frontend and backend on localhost.

To run standalone application execute:

```sh
yarn desktop
```
