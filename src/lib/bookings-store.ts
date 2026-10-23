import { promises as fs } from "fs";
import path from "path";

export type BookingRecord = {
  reference: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  destination: string;
  message: string;
};

export type ContactRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const dataDir = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function refId() {
  return `GCC-${Date.now().toString(36).toUpperCase()}`;
}

export async function saveBooking(
  payload: Omit<BookingRecord, "reference" | "createdAt">
): Promise<BookingRecord> {
  await ensureDataDir();
  const record: BookingRecord = {
    ...payload,
    reference: refId(),
    createdAt: new Date().toISOString(),
  };
  const file = path.join(dataDir, "bookings.json");
  let list: BookingRecord[] = [];
  try {
    const raw = await fs.readFile(file, "utf-8");
    list = JSON.parse(raw) as BookingRecord[];
  } catch {
    list = [];
  }
  list.push(record);
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf-8");
  return record;
}

export async function saveContact(
  payload: Omit<ContactRecord, "id" | "createdAt">
): Promise<ContactRecord> {
  await ensureDataDir();
  const record: ContactRecord = {
    ...payload,
    id: refId(),
    createdAt: new Date().toISOString(),
  };
  const file = path.join(dataDir, "contacts.json");
  let list: ContactRecord[] = [];
  try {
    const raw = await fs.readFile(file, "utf-8");
    list = JSON.parse(raw) as ContactRecord[];
  } catch {
    list = [];
  }
  list.push(record);
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf-8");
  return record;
}
