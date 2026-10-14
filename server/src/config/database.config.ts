/**
 * Database connection — Postgres.
 *
 * Keeps the two exports the application already wires up, so `app.module.ts`
 * and `src/index.ts` are unchanged by the cutover:
 *
 *   connctDatabase           (sic — the original spelling, kept to avoid an
 *                            unrelated rename in the same commit)
 *   ensureDatabaseConnection per-request middleware
 *
 * The Mongo implementation retried five times with a 5s sleep, which on a cold
 * serverless start could burn 25 seconds of a 60 second budget before failing.
 * There is no retry loop here: postgres.js already retries at the socket level,
 * and a pooled Postgres endpoint either answers quickly or is genuinely down.
 *
 * The legacy string-date healer that lived here is gone. It existed to repair
 * `transactions.date` values written as strings by an old client; the backfill
 * parses both forms, so the column is uniformly `timestamptz` on arrival.
 */
import type { NextFunction, Request, Response } from "express";

import { verifyConnection } from "../db/client";
import { isDevFallbackMode, setDevFallbackMode } from "../db/dev-store";
import { Env } from "./env.config";

let connectionPromise: Promise<void> | null = null;
let connected = false;

export const connctDatabase = async (): Promise<void> => {
  if (connected) return;

  if (!connectionPromise) {
    connectionPromise = verifyConnection()
      .then(() => {
        connected = true;
        setDevFallbackMode(false);
        console.log("Connected to Postgres");
      })
      .catch((err) => {
        setDevFallbackMode(true);
        console.warn(
          "\n======================================================\n" +
          "ℹ️  PostgreSQL not reachable at " + Env.DATABASE_URL + "\n" +
          "🚀 MONETRA AUTO DEV MODE ACTIVATED:\n" +
          "   Authentication, Sign-Up, Sign-In, and data storage\n" +
          "   are running via persistent Local Dev Store (.dev-data.json).\n" +
          "======================================================\n"
        );
      })
      .finally(() => {
        connectionPromise = null;
      });
  }

  await connectionPromise;
};

export const ensureDatabaseConnection = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await connctDatabase();
    next();
  } catch (error) {
    if (isDevFallbackMode()) {
      next();
    } else {
      connected = false;
      next(error);
    }
  }
};

/**
 * Whether the database is reachable RIGHT NOW, for the health endpoint.
 *
 * Deliberately an active probe rather than a cached flag. `mongoose.connection
 * .readyState` reported live state and dropped to 0 on disconnect; a sticky
 * boolean set true by the first successful query would answer "connected" for
 * the rest of the process's life, including throughout a total outage — which
 * inverts the purpose of a health check.
 */
export const isDatabaseConnected = async (): Promise<boolean> => {
  try {
    await verifyConnection();
    connected = true;
    return true;
  } catch {
    connected = false;
    return false;
  }
};
