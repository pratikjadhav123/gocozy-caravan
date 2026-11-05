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

export async function queryRows<T extends RowDataPacket[]>(
  sql: string,
  params?: SqlParams
): Promise<T> {
  const [rows] = await getPool().execute<T>(sql, params as never);
  return rows;
}

export async function queryExec(sql: string, params?: SqlParams): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params as never);
  return result;
}

export type { RowDataPacket, ResultSetHeader };
