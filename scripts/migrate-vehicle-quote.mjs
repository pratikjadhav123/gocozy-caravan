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

try {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "gocozy_caravan",
    multipleStatements: true,
  });

  // MariaDB may not support ADD COLUMN IF NOT EXISTS on older versions — try/catch each
  for (const col of ["included_json", "excluded_json"]) {
    try {
      await conn.query(
        `ALTER TABLE cms_vehicles ADD COLUMN \`${col}\` TEXT NULL`
      );
      console.log(`Added column ${col}`);
    } catch (e) {
      if (e && (e.code === "ER_DUP_FIELDNAME" || String(e.message).includes("Duplicate"))) {
        console.log(`Column ${col} already exists`);
      } else {
        throw e;
      }
    }
  }

  const included = JSON.stringify([
    "Professional chauffeur (on request)",
    "Pre-trip vehicle walkthrough",
    "Basic insurance on trips",
    "Roadside assistance coordination",
    "WhatsApp booking support",
  ]);
  const excluded = JSON.stringify([
    "Toll taxes & state entry permits",
    "Parking charges",
    "Driver allowance / night halt",
    "Fuel (quoted separately by trip)",
  ]);

  await conn.query(
    `UPDATE cms_vehicles
     SET included_json = COALESCE(NULLIF(included_json, ''), ?),
         excluded_json = COALESCE(NULLIF(excluded_json, ''), ?)`,
    [included, excluded]
  );

  console.log("Vehicle quote lists migration done");
  await conn.end();
} catch (e) {
  console.error("Vehicle quote migration failed:", e.code || "", e.message);
  process.exit(1);
}
