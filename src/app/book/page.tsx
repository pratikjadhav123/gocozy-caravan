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
        subtitle="Fill your dates and vehicle — we open WhatsApp with your details so our team can confirm availability."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
          <aside className="animate-fade-up space-y-4 lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-white">How booking works</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm text-zinc-400">
              <li>Enter pick-up / return dates and choose a caravan.</li>
              <li>Submit — WhatsApp opens with your booking message ready.</li>
              <li>Send the message and our team confirms pricing & slot.</li>
              <li>Pay advance to lock your trip (details shared on WhatsApp).</li>
            </ol>
            <p className="text-sm text-zinc-500">
              Need help? Call or WhatsApp{" "}
              <strong className="text-gold">{SITE.phoneDisplay}</strong>
            </p>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-gold hover:underline"
            >
              See trips on Instagram →
            </a>
          </aside>
          <div className="lg:col-span-3">
            <BookingForm />
          </div>
        </div>
      </section>
    </>
  );
}
