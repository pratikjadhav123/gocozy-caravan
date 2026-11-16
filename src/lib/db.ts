import "server-only";
import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __gocozyPool: Pool | undefined;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env ${name}. Copy .env.example to .env.local and set MySQL credentials.`);
  }
  return value;
}

export function getPool(): Pool {
  if (!global.__gocozyPool) {
    global.__gocozyPool = mysql.createPool({
      host: process.env.DATABASE_HOST || "127.0.0.1",
      port: Number(process.env.DATABASE_PORT || 3306),
      user: requiredEnv("DATABASE_USER"),
      password: process.env.DATABASE_PASSWORD ?? "",
      database: requiredEnv("DATABASE_NAME"),
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
      timezone: "+05:30",
      dateStrings: true,
    });
  }
  return global.__gocozyPool;
}

type SqlParams = Record<string, string | number | boolean | null | Date> | Array<string | number | boolean | null | Date>;

function formatDbError(err: unknown): Error {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("ECONNREFUSED")) {
    return new Error(
      "MySQL is not running on 127.0.0.1:3306. Start MySQL/XAMPP, then restart next dev."
    );
  }
  return err instanceof Error ? err : new Error(message);
}

export async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params?: SqlParams
): Promise<T> {
  try {
    const [rows] = await getPool().execute<T>(sql, params as never);
    return rows;
  } catch (err) {
    throw formatDbError(err);
  }
}

export async function queryExec(sql: string, params?: SqlParams): Promise<ResultSetHeader> {
  try {
    const [result] = await getPool().execute<ResultSetHeader>(sql, params as never);
    return result;
  } catch (err) {
    throw formatDbError(err);
  }
}

export type { RowDataPacket, ResultSetHeader };
