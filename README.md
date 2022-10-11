# autocannon-ui

[![ci](https://github.com/nearform/autocannon-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/nearform/autocannon-ui/actions/workflows/ci.yml)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

This monorepo contains packages and applications which provide a GUI for using autocannon while maintaining the same user experience. 
It provides the ability to compare two autocannon results.

To compare, the user must tick two results and press the `Compare` button. The popup that appeared will display the comparing result.
For understanding the result, please see the `autocannon-compare` [documentation](https://github.com/mcollina/autocannon-compare).

<!-- toc -->

- [Screenshots](#screenshots)
- [Getting started](#getting-started)
- [Development](#development)
  * [Designs](#designs)
- [Packages](#packages)
  * [`autocannon-ui-frontend`](#autocannon-ui-frontend)
  * [`autocannon-ui-backend`](#autocannon-ui-backend)
  * [`autocannon-ui-desktop`](#autocannon-ui-desktop)
  * [`autocannon-ui-web`](#autocannon-ui-web)
- [Running standalone application](#running-standalone-application)

<!-- tocstop -->

## Screenshots
![Autocannon Options](./images/app.jpg?raw=true "Autocannon Options")  

![Autocannon Report](./images/report.jpg?raw=true "Autocannon Report")  

![Autocannon Compare](./images/compare.jpg?raw=true "Autocannon Compare") 

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

### Designs

Designs can be found [here](https://www.figma.com/file/f7DQ7Ev8Wk7MQKQehYphSP/Autocannon).

## Packages

### `autocannon-ui-frontend`

A library of React components which provide the UI.

### `autocannon-ui-backend`

A standalone Fastify application.

### `autocannon-ui-desktop`

Electron wrapper for running both frontend and backend.

### `autocannon-ui-web`

Web wrapper for running both frontend and backend.

## Running standalone application

The application can be installed as a global npm package and run as a standalone tool from command line.

To install it and run:

```sh
npm install -g autocannon-ui-desktop
autocannon-ui-desktop
```

or for running web application:

```sh
npm install -g autocannon-ui-web
autocannon-ui-web
```
