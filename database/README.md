# Go Cozy Caravan — Database (phpMyAdmin)

## 1. Import schema

1. Open **phpMyAdmin** (XAMPP: `http://localhost/phpmyadmin`)
2. Click **Import**
3. Choose `database/schema.sql`
4. Click **Go**

Or paste the SQL into the **SQL** tab and run it.

This creates:

| Table | Purpose |
|---|---|
| `admins` | Admin CRM login |
| `bookings` | Website bookings + reference numbers |
| `booking_status_logs` | Status change history |
| `contacts` | Contact form enquiries |

## 2. Default admin login

- **URL:** `/admin/login`
- **Email:** `admin@gocozycaravan.com`
- **Password:** `Admin@123`

Change this password after first login (update `admins.password_hash` or add a change-password screen later).

## 3. Connect Next.js

Copy `.env.example` → `.env.local`:

```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=gocozy_caravan
ADMIN_JWT_SECRET=replace-with-a-long-random-secret-at-least-32-chars
```

Restart `npm run dev`.

## 4. Flow

1. Customer fills **/book** on the website
2. API `POST /api/book` saves row + generates `GCC-YYYYMMDD-XXXX`
3. WhatsApp opens with the same reference
4. Admin opens **/admin/bookings** → booking detail
5. Admin enters **price** → clicks **Confirm & send WhatsApp / Email**
6. Status becomes `confirmed`, customer gets WhatsApp confirmation (email if SMTP set)

### Extra migration (existing DB)

If you already imported `schema.sql` earlier, also run:

```bash
node scripts/migrate-confirmations.mjs
```

Or import `database/migration_confirmations.sql` in phpMyAdmin.
