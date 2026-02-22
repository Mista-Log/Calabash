#!/usr/bin/env node

import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import process from "node:process";

const DEFAULT_PORT = 3000;
const LOCK_PATH = path.join(process.cwd(), ".next", "dev", "lock");
const LOGS_PATH = path.join(process.cwd(), ".next", "dev", "logs");

function parsePortFromArgs(args) {
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--port" && args[index + 1]) {
      const parsed = Number.parseInt(args[index + 1], 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }

    if (token.startsWith("--port=")) {
      const parsed = Number.parseInt(token.slice("--port=".length), 10);
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return null;
}

function parsePortFromNpmOriginalArgs() {
  const raw = process.env.npm_config_argv;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const original = Array.isArray(parsed?.original) ? parsed.original : [];
    return parsePortFromArgs(original);
  } catch {
    return null;
  }
}

function resolvePort() {
  const argvPort =
    parsePortFromArgs(process.argv.slice(2)) ?? parsePortFromNpmOriginalArgs();
  if (argvPort) {
    return argvPort;
  }

  const envPort = Number.parseInt(process.env.PORT ?? "", 10);
  if (Number.isInteger(envPort) && envPort > 0) {
    return envPort;
  }

  return DEFAULT_PORT;
}

async function isDashboardReachable(port) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(`http://127.0.0.1:${port}/dashboard`, {
      method: "GET",
      signal: controller.signal,
    });
    return response.ok || response.status >= 300;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const onDone = (open) => {
      socket.destroy();
      resolve(open);
    };

    socket.setTimeout(1200);
    socket.once("connect", () => onDone(true));
    socket.once("timeout", () => onDone(false));
    socket.once("error", () => onDone(false));
    socket.connect(port, "127.0.0.1");
  });
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function runReset() {
  await fs.rm(LOCK_PATH, { force: true });
  await fs.rm(LOGS_PATH, { recursive: true, force: true });
  console.warn("Removed .next/dev lock and logs.");
}

async function main() {
  const shouldReset = process.argv.includes("--reset");
  if (shouldReset) {
    await runReset();
  }

  const lockExists = await pathExists(LOCK_PATH);
  if (!lockExists) {
    console.warn("Dev preflight passed.");
    return;
  }

  const port = resolvePort();
  const reachable =
    (await isDashboardReachable(port)) || (await isPortOpen(port));

  if (reachable) {
    console.error(
      `Another next dev instance is already running on port ${port}. Stop it or use a different port.`,
    );
    process.exit(1);
  }

  await fs.rm(LOCK_PATH, { force: true });
  console.warn(`Removed stale lock at ${LOCK_PATH}.`);
  console.warn("Dev preflight passed.");
}

await main();
