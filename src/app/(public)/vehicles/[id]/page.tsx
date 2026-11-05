import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { VehicleGallery } from "@/components/VehicleGallery";
import { VehicleReserveCard } from "@/components/VehicleReserveCard";
import {
  INCLUDED_IN_QUOTE,
  NOT_INCLUDED,
  VEHICLES,
  getVehicle,
  vehicleCapacityLabel,
} from "@/lib/constants";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return VEHICLES.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) return { title: "Vehicle" };
  return {
    title: vehicle.name,
    description: vehicle.about,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) notFound();

  return (
    <>
      <section className="border-b border-white/10 bg-gradient-to-b from-charcoal-light to-charcoal py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="text-sm text-zinc-500">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/vehicles" className="hover:text-gold">
              Our fleet
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-300">{vehicle.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {vehicle.name}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">{vehicle.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              {vehicleCapacityLabel(vehicle)}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">
              Pickup across India
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">
              WhatsApp booking
            </span>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <VehicleGallery images={vehicle.gallery} />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">About this vehicle</h2>
                <p className="mt-4 leading-relaxed text-zinc-300">{vehicle.about}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-white">Key specs</h2>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {vehicle.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-xl border border-white/10 bg-charcoal-light px-4 py-4 text-center"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                        {spec.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold text-white">What&apos;s onboard</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="rounded-xl border border-white/10 bg-charcoal/50 p-4"
                    >
                      <p className="font-semibold text-gold">{feature.title}</p>
                      <p className="mt-1 text-sm text-zinc-400">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-charcoal-light p-5">
                  <h3 className="font-semibold text-white">Included in the quote</h3>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                    {INCLUDED_IN_QUOTE.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-gold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-charcoal-light p-5">
                  <h3 className="font-semibold text-white">Not included</h3>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                    {NOT_INCLUDED.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-red-400">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <VehicleReserveCard vehicle={vehicle} />
          </div>
        </div>
      </section>

      <FaqAccordion />

      <section className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-xl font-bold text-white">More from our fleet</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLES.filter((v) => v.id !== vehicle.id).map((v) => (
              <Link
                key={v.id}
                href={`/vehicles/${v.id}`}
                className="card-hover overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={v.image} alt={v.name} fill className="object-cover" sizes="33vw" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white">{v.name}</p>
                  <p className="mt-1 text-xs text-zinc-400">{vehicleCapacityLabel(v)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
