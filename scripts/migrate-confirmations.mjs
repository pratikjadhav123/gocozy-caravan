import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2].trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const statements = [
  "ALTER TABLE bookings ADD COLUMN confirmed_at DATETIME NULL DEFAULT NULL AFTER quoted_amount",
  "ALTER TABLE bookings ADD COLUMN confirmation_whatsapp_sent TINYINT(1) NOT NULL DEFAULT 0 AFTER whatsapp_sent",
  "ALTER TABLE bookings ADD COLUMN confirmation_email_sent TINYINT(1) NOT NULL DEFAULT 0 AFTER confirmation_whatsapp_sent",
  "ALTER TABLE bookings ADD COLUMN confirmation_sent_at DATETIME NULL DEFAULT NULL AFTER confirmation_email_sent",
];

try {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "gocozy_caravan",
  });

  for (const sql of statements) {
    try {
      await conn.query(sql);
      console.log("OK:", sql);
    } catch (e) {
      if (e.code === "ER_DUP_FIELDNAME") console.log("SKIP (exists):", sql);
      else throw e;
    }
  }

  await conn.end();
  console.log("Migration done");
} catch (e) {
  console.error("Migration failed:", e.code || "", e.message);
  process.exit(1);
}
