import Link from "next/link";
import { AdminCreateBookingForm } from "@/components/admin/AdminCreateBookingForm";
import { getContactById } from "@/lib/bookings";

type PageProps = {
  searchParams: Promise<{ enquiryId?: string }>;
};

export default async function AdminNewBookingPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const enquiryId = sp.enquiryId ? Number(sp.enquiryId) : undefined;
  const enquiry =
    enquiryId && Number.isFinite(enquiryId) ? await getContactById(enquiryId) : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link href={enquiry ? "/admin/contacts" : "/admin/bookings"} className="text-sm text-gold hover:underline">
          ← Back
        </Link>
        <p className="mt-3 text-sm text-zinc-400">
          {enquiry
            ? `Create a CRM booking for enquiry ${enquiry.reference_no}.`
            : "Create a new booking directly from admin CRM."}
        </p>
      </div>

      <AdminCreateBookingForm
        enquiryId={enquiry?.id}
        defaultName={enquiry?.name || ""}
        defaultPhone={enquiry?.phone || ""}
        defaultEmail={enquiry?.email || ""}
        defaultMessage={
          enquiry
            ? [`Enquiry: ${enquiry.reference_no}`, enquiry.subject, enquiry.message]
                .filter(Boolean)
                .join("\n")
            : ""
        }
      />
    </div>
  );
}
