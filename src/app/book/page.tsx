import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book Now",
};

export default function BookPage() {
  return (
    <>
      <PageHero
        title="Book your caravan"
        subtitle="Select dates and vehicle. We will review slot availability and confirm by WhatsApp or email."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
          <aside className="space-y-4 lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-white">How booking works</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm text-zinc-400">
              <li>Submit your preferred pick-up and return dates.</li>
              <li>Receive a reference number instantly.</li>
              <li>Our team checks the calendar and confirms pricing.</li>
              <li>Pay advance to lock your slot (details shared on WhatsApp).</li>
            </ol>
            <p className="text-sm text-zinc-500">
              Need help? Call or WhatsApp{" "}
              <strong className="text-gold">{SITE.phoneDisplay}</strong>
            </p>
          </aside>
          <div className="lg:col-span-3">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
