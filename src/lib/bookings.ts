import type { RowDataPacket } from "mysql2";
import { queryExec, queryRows } from "@/lib/db";
import { getVehicle, vehicleCapacityLabel } from "@/lib/constants";

export type BookingStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BookingRow = RowDataPacket & {
  id: number;
  reference_no: string;
  status: BookingStatus;
  customer_name: string;
  phone: string;
  email: string | null;
  guests: number | null;
  vehicle_id: string;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  destination: string;
  pickup_city: string | null;
  message: string | null;
  admin_notes: string | null;
  quoted_amount: string | null;
  confirmed_at: string | null;
  currency: string;
  source: string;
  assigned_admin_id: number | null;
  whatsapp_sent: number;
  confirmation_whatsapp_sent: number;
  confirmation_email_sent: number;
  confirmation_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactRow = RowDataPacket & {
  id: number;
  reference_no: string;
  status: "new" | "replied" | "closed";
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBookingInput = {
  name: string;
  phone: string;
  email?: string;
  guests?: number | null;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  message?: string;
  whatsappSent?: boolean;
};

function randomPart(len = 4) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/** Public reference: GCC-YYYYMMDD-XXXX */
export function generateBookingReference(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `GCC-${y}${m}${d}-${randomPart(4)}`;
}

export function generateContactReference(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `GCC-ENQ-${y}${m}${d}-${randomPart(4)}`;
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRow> {
  const vehicle = getVehicle(input.vehicleId);
  const vehicleName = vehicle
    ? `${vehicle.name} (${vehicleCapacityLabel(vehicle)})`
    : input.vehicleId;

  let reference = generateBookingReference();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const result = await queryExec(
        `INSERT INTO bookings (
          reference_no, status, customer_name, phone, email, guests,
          vehicle_id, vehicle_name, pickup_date, return_date, destination,
          message, source, whatsapp_sent
        ) VALUES (
          :reference_no, 'new', :customer_name, :phone, :email, :guests,
          :vehicle_id, :vehicle_name, :pickup_date, :return_date, :destination,
          :message, 'website', :whatsapp_sent
        )`,
        {
          reference_no: reference,
          customer_name: input.name,
          phone: input.phone,
          email: input.email || null,
          guests: input.guests ?? null,
          vehicle_id: input.vehicleId,
          vehicle_name: vehicleName,
          pickup_date: input.pickupDate,
          return_date: input.returnDate,
          destination: input.destination,
          message: input.message || null,
          whatsapp_sent: input.whatsappSent ? 1 : 0,
        }
      );

      const rows = await queryRows<BookingRow[]>(
        `SELECT * FROM bookings WHERE id = :id LIMIT 1`,
        { id: result.insertId }
      );
      const booking = rows[0];
      if (!booking) throw new Error("Booking insert failed");

      await queryExec(
        `INSERT INTO booking_status_logs (booking_id, old_status, new_status, note)
         VALUES (:booking_id, NULL, 'new', 'Created from website')`,
        { booking_id: booking.id }
      );

      return booking;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("Duplicate") || message.includes("uq_bookings_reference")) {
        reference = generateBookingReference();
        continue;
      }
      throw err;
    }
  }
  throw new Error("Could not generate unique booking reference");
}

export async function createContact(input: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}): Promise<ContactRow> {
  let reference = generateContactReference();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const result = await queryExec(
        `INSERT INTO contacts (reference_no, name, phone, email, subject, message)
         VALUES (:reference_no, :name, :phone, :email, :subject, :message)`,
        {
          reference_no: reference,
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          subject: input.subject || null,
          message: input.message,
        }
      );
      const rows = await queryRows<ContactRow[]>(
        `SELECT * FROM contacts WHERE id = :id LIMIT 1`,
        { id: result.insertId }
      );
      if (!rows[0]) throw new Error("Contact insert failed");
      return rows[0];
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("Duplicate") || message.includes("uq_contacts_reference")) {
        reference = generateContactReference();
        continue;
      }
      throw err;
    }
  }
  throw new Error("Could not generate unique contact reference");
}

export async function listBookings(filters?: {
  status?: string;
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
}) {
  const where: string[] = ["1=1"];
  const params: Record<string, string | number | null> = {};
  const limit = Math.min(Math.max(Number(filters?.limit ?? 100) || 100, 1), 300);

  if (filters?.status && filters.status !== "all") {
    where.push("status = :status");
    params.status = filters.status;
  }
  if (filters?.from) {
    where.push("pickup_date >= :from");
    params.from = filters.from;
  }
  if (filters?.to) {
    where.push("pickup_date <= :to");
    params.to = filters.to;
  }
  if (filters?.q?.trim()) {
    where.push(
      `(reference_no LIKE :q OR customer_name LIKE :q OR phone LIKE :q OR destination LIKE :q OR vehicle_name LIKE :q)`
    );
    params.q = `%${filters.q.trim()}%`;
  }

  return queryRows<BookingRow[]>(
    `SELECT * FROM bookings
     WHERE ${where.join(" AND ")}
     ORDER BY created_at DESC
     LIMIT ${limit}`,
    params
  );
}

export async function getBookingById(id: number) {
  const rows = await queryRows<BookingRow[]>(`SELECT * FROM bookings WHERE id = :id LIMIT 1`, {
    id,
  });
  return rows[0] ?? null;
}

export async function getBookingByReference(reference: string) {
  const rows = await queryRows<BookingRow[]>(
    `SELECT * FROM bookings WHERE reference_no = :reference LIMIT 1`,
    { reference }
  );
  return rows[0] ?? null;
}

export async function updateBooking(
  id: number,
  patch: {
    status?: BookingStatus;
    admin_notes?: string;
    quoted_amount?: number | null;
    assigned_admin_id?: number | null;
  },
  adminId?: number
) {
  const current = await getBookingById(id);
  if (!current) return null;

  await queryExec(
    `UPDATE bookings SET
      status = COALESCE(:status, status),
      admin_notes = COALESCE(:admin_notes, admin_notes),
      quoted_amount = COALESCE(:quoted_amount, quoted_amount),
      assigned_admin_id = COALESCE(:assigned_admin_id, assigned_admin_id)
     WHERE id = :id`,
    {
      id,
      status: patch.status ?? null,
      admin_notes: patch.admin_notes ?? null,
      quoted_amount: patch.quoted_amount ?? null,
      assigned_admin_id: patch.assigned_admin_id ?? null,
    }
  );

  if (patch.status && patch.status !== current.status) {
    await queryExec(
      `INSERT INTO booking_status_logs (booking_id, old_status, new_status, changed_by_admin_id)
       VALUES (:booking_id, :old_status, :new_status, :admin_id)`,
      {
        booking_id: id,
        old_status: current.status,
        new_status: patch.status,
        admin_id: adminId ?? null,
      }
    );
  }

  return getBookingById(id);
}

export async function confirmBooking(
  id: number,
  input: {
    price: number;
    adminNotes?: string;
    whatsappSent?: boolean;
    emailSent?: boolean;
  },
  adminId?: number
) {
  const current = await getBookingById(id);
  if (!current) return null;

  await queryExec(
    `UPDATE bookings SET
      status = 'confirmed',
      quoted_amount = :price,
      admin_notes = COALESCE(:admin_notes, admin_notes),
      confirmed_at = NOW(),
      confirmation_whatsapp_sent = CASE WHEN :whatsapp_sent = 1 THEN 1 ELSE confirmation_whatsapp_sent END,
      confirmation_email_sent = CASE WHEN :email_sent = 1 THEN 1 ELSE confirmation_email_sent END,
      confirmation_sent_at = NOW(),
      assigned_admin_id = COALESCE(:admin_id, assigned_admin_id)
     WHERE id = :id`,
    {
      id,
      price: input.price,
      admin_notes: input.adminNotes?.trim() || null,
      whatsapp_sent: input.whatsappSent ? 1 : 0,
      email_sent: input.emailSent ? 1 : 0,
      admin_id: adminId ?? null,
    }
  );

  if (current.status !== "confirmed") {
    await queryExec(
      `INSERT INTO booking_status_logs (booking_id, old_status, new_status, changed_by_admin_id, note)
       VALUES (:booking_id, :old_status, 'confirmed', :admin_id, :note)`,
      {
        booking_id: id,
        old_status: current.status,
        admin_id: adminId ?? null,
        note: `Confirmed at INR ${input.price}`,
      }
    );
  }

  return getBookingById(id);
}

export async function listContacts(limit = 100) {
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 300);
  return queryRows<ContactRow[]>(
    `SELECT * FROM contacts ORDER BY created_at DESC LIMIT ${safeLimit}`
  );
}

export async function updateContactStatus(
  id: number,
  status: ContactRow["status"],
  adminNotes?: string
) {
  await queryExec(
    `UPDATE contacts SET status = :status, admin_notes = COALESCE(:admin_notes, admin_notes)
     WHERE id = :id`,
    { id, status, admin_notes: adminNotes ?? null }
  );
}

export async function getDashboardStats() {
  const [pipeline, today, recent] = await Promise.all([
    queryRows<(RowDataPacket & { status: string; total: number })[]>(
      `SELECT status, COUNT(*) AS total FROM bookings GROUP BY status`
    ),
    queryRows<(RowDataPacket & { c: number })[]>(
      `SELECT COUNT(*) AS c FROM bookings
       WHERE DATE(created_at) = CURDATE() OR pickup_date = CURDATE()`
    ),
    queryRows<BookingRow[]>(
      `SELECT * FROM bookings ORDER BY created_at DESC LIMIT 8`
    ),
  ]);

  const byStatus = Object.fromEntries(pipeline.map((r) => [r.status, Number(r.total)]));
  return {
    todayCount: Number(today[0]?.c || 0),
    byStatus,
    recent,
    totalOpen:
      Number(byStatus.new || 0) +
      Number(byStatus.contacted || 0) +
      Number(byStatus.confirmed || 0) +
      Number(byStatus.in_progress || 0),
  };
}
