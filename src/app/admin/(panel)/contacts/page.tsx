import { listContacts } from "@/lib/bookings";
import { ContactStatusButtons } from "@/components/admin/ContactStatusButtons";

export default async function AdminContactsPage() {
  const contacts = await listContacts(150);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-zinc-400">Contact form messages with enquiry references.</p>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="rounded-2xl border border-white/10 px-4 py-10 text-center text-zinc-500">
            No enquiries yet.
          </p>
        ) : (
          contacts.map((c) => (
            <article key={c.id} className="rounded-2xl border border-white/10 bg-charcoal-light p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gold">{c.reference_no}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-zinc-400">
                    +91 {c.phone}
                    {c.email ? ` · ${c.email}` : ""}
                  </p>
                </div>
                <ContactStatusButtons id={c.id} status={c.status} />
              </div>
              {c.subject ? <p className="mt-3 text-sm font-medium text-zinc-200">{c.subject}</p> : null}
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-400">{c.message}</p>
              <p className="mt-3 text-xs text-zinc-600">{c.created_at}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
