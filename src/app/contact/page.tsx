import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { SITE, whatsappUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  const wa = whatsappUrl("Hello GoCozyCaravan, I need help with a booking.");

  return (
    <>
      <PageHero
        title="Contact us"
        subtitle="Questions about routes, pricing, or availability? Message us anytime."
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-charcoal-light p-6">
              <h2 className="font-display text-lg font-semibold text-white">Direct contact</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                <li>
                  <span className="block text-xs uppercase text-zinc-500">WhatsApp</span>
                  <a href={wa} className="font-medium text-gold hover:underline" target="_blank" rel="noopener noreferrer">
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase text-zinc-500">Email</span>
                  <a href={`mailto:${SITE.email}`} className="font-medium text-gold hover:underline">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <span className="block text-xs uppercase text-zinc-500">Location</span>
                  {SITE.address}
                </li>
              </ul>
            </div>
            <p className="text-sm text-zinc-500">
              Typical response time: same day on WhatsApp, within 24 hours on email.
            </p>
          </div>
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
