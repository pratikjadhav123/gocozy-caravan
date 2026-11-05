import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/PageHero";
import { SITE, getVehicle } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book Now",
};

type BookPageProps = {
  searchParams: Promise<{ vehicle?: string; destination?: string }>;
};

export default async function BookPage({ searchParams }: BookPageProps) {
  const { vehicle: vehicleId, destination } = await searchParams;
  const selected = vehicleId ? getVehicle(vehicleId) : undefined;

  return (
    <>
      <PageHero
        title={selected ? `Book ${selected.name}` : "Book your caravan"}
        subtitle={
          selected
            ? `You selected ${selected.name}. Fill dates — WhatsApp opens with this vehicle ready.`
            : "Fill your dates and vehicle — we open WhatsApp so our team can confirm availability."
        }
        image={selected?.image ?? "/images/slider/slide-3.png"}
        imageAlt={selected ? selected.name : "Book Go Cozy Caravan"}
      />
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-5">
          <aside className="animate-fade-up space-y-4 lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-white">How booking works</h2>
            <ol className="list-decimal space-y-3 pl-5 text-sm text-zinc-400">
              <li>Open a van detail page or pick a caravan here.</li>
              <li>Enter pick-up / return dates and trip notes.</li>
              <li>Submit — WhatsApp opens with your booking message.</li>
              <li>Our team confirms pricing & locks the slot.</li>
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
            <BookingForm
              defaultVehicleId={selected?.id}
              defaultDestination={destination}
            />
          </div>
        </div>
      </section>
      <FaqAccordion />
    </>
  );
}
