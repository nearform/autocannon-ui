import path from "path";

import pino from "pino";
import Fastify from "fastify";
import * as autocannonUiBackend from "autocannon-ui-backend";
import * as pkgDir from "pkg-dir";
import fastifyStatic from "@fastify/static";
import child_process from "child_process";

const transport = pino.transport({
  target: "pino-pretty",
  options: { colorize: true },
});

const logger = pino(
  {
    level: "info",
    base: null,
    timestamp: false,
  },
  transport
);

async function start() {
  try {
    const address = await startServer();
    logger.info(`Autocannon-UI started. Open ${address} in your browser.`);
  } catch (e) {
    logger.error(e);
  }
}

async function startServer() {
  const fastify = Fastify();
  fastify.register(autocannonUiBackend);

  const uiRoot = path.join(
    pkgDir.packageDirectorySync(),
    "package/packages/autocannon-ui-frontend/dist"
  );

  fastify.register(fastifyStatic, {
    root: uiRoot,
  });

  const address = await fastify.listen();
  await fastify.ready();

  const start =
    process.platform == "darwin"
      ? "open"
      : process.platform == "win32"
      ? "start"
      : "xdg-open";

  child_process.exec(start + " " + address);

  return address;
}

start();
