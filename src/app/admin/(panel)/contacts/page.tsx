import Link from "next/link";
import { EnquiryCard } from "@/components/admin/EnquiryCard";
import { EnquiriesFilterTabs } from "@/components/admin/EnquiriesFilterTabs";
import { getContactCounts, listContacts, type ContactRow } from "@/lib/bookings";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminContactsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const statusParam = sp.status || "all";
  const status =
    statusParam === "new" || statusParam === "replied" || statusParam === "closed"
      ? statusParam
      : "all";

  const [contacts, counts] = await Promise.all([
    listContacts({ status, limit: 150 }),
    getContactCounts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm text-zinc-400">
          Reply on WhatsApp → discuss → Close, or Book this customer in CRM.
        </p>
        <Link
          href="/admin/bookings/new"
          className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-charcoal hover:bg-gold-light"
        >
          + New booking
        </Link>
      </div>

      <EnquiriesFilterTabs active={status} counts={counts} />

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="rounded-2xl border border-white/10 px-4 py-10 text-center text-zinc-500">
            No enquiries in this tab.
          </p>
        ) : (
          contacts.map((c: ContactRow) => (
            <EnquiryCard
              key={c.id}
              id={c.id}
              reference={c.reference_no}
              status={c.status}
              name={c.name}
              phone={c.phone}
              email={c.email}
              subject={c.subject}
              message={c.message}
              createdAt={c.created_at}
            />
          ))
        )}
      </div>
    </div>
  );
}
