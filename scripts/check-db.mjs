import mysql from "mysql2/promise";

try {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
  });
  console.log("MySQL connected OK");

  const [dbs] = await conn.query("SHOW DATABASES LIKE 'gocozy_caravan'");
  console.log("DB exists:", dbs.length > 0);

  if (dbs.length === 0) {
    console.log("ACTION: Import database/schema.sql in phpMyAdmin");
    await conn.end();
    process.exit(2);
  }

  await conn.changeUser({ database: "gocozy_caravan" });
  const [tables] = await conn.query("SHOW TABLES");
  console.log(
    "Tables:",
    tables.map((t) => Object.values(t)[0])
  );

  const [admins] = await conn.query(
    "SELECT id, email, is_active, LEFT(password_hash, 30) AS hash_prefix FROM admins"
  );
  console.log("Admins:", admins);

  await conn.end();
} catch (e) {
  console.error("CONNECT_ERROR:", e.code || "", e.message);
  console.log("ACTION: Start XAMPP MySQL, then import database/schema.sql");
  process.exit(1);
}
