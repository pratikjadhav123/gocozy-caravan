import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvLocal();

const sqlPath = path.join(process.cwd(), "database", "migration_cms.sql");
const raw = fs.readFileSync(sqlPath, "utf8");

// Split on semicolons while keeping statements simple
const statements = raw
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--") && s.toUpperCase() !== "USE `GOCOZY_CARAVAN`");

try {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "gocozy_caravan",
    multipleStatements: true,
  });

  await conn.query(raw.replace(/^USE\s+`gocozy_caravan`\s*;/im, ""));
  console.log("CMS migration applied");
  await conn.end();
} catch (e) {
  console.error("CMS migration failed:", e.code || "", e.message);
  process.exit(1);
}
