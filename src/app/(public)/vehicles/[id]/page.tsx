import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { VehicleGallery } from "@/components/VehicleGallery";
import { VehicleReserveCard } from "@/components/VehicleReserveCard";
import { getCmsVehicleBySlug, getCmsVehiclesForSite } from "@/lib/cms-content";
import { vehicleCapacityLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getCmsVehicleBySlug(id);
  if (!vehicle) return { title: "Vehicle" };
  return {
    title: vehicle.name,
    description: vehicle.about,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [vehicle, allVehicles] = await Promise.all([
    getCmsVehicleBySlug(id),
    getCmsVehiclesForSite(),
  ]);
  if (!vehicle) notFound();

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,185,35,0.12),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
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
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Fleet details
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {vehicle.name}
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">{vehicle.tagline}</p>
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

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <VehicleGallery
            images={vehicle.gallery}
            shareTitle={vehicle.name}
            sharePath={`/vehicles/${vehicle.id}`}
          />

          <div className="mt-9 grid gap-8 lg:mt-11 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-9">
            <div className="space-y-9">
              <div className="rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-charcoal-light/60 p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold text-white">About this vehicle</h2>
                <div className="mt-3 h-0.5 w-12 rounded-full bg-gold/80" />
                <p className="mt-4 leading-relaxed text-zinc-300">{vehicle.about}</p>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold text-white">Key specs</h2>
                <div className="mt-3 h-0.5 w-12 rounded-full bg-gold/80" />
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {vehicle.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-2xl border border-white/10 bg-charcoal-light/90 px-3.5 py-3.5 text-center"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
                        {spec.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold text-white">What&apos;s onboard</h2>
                <div className="mt-3 h-0.5 w-12 rounded-full bg-gold/80" />
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="rounded-2xl border border-white/10 bg-charcoal-light/70 p-4 transition hover:border-gold/30"
                    >
                      <p className="font-semibold text-gold">{feature.title}</p>
                      <p className="mt-1 text-sm text-zinc-400">{feature.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-emerald-400/25 bg-gradient-to-b from-emerald-500/[0.12] to-charcoal-light/90 p-5 sm:p-6">
                  <h3 className="font-display text-lg font-semibold text-white">
                    Included in the quote
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                    {vehicle.included.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-0.5 shrink-0 text-emerald-400" aria-hidden>
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.35rem] border border-red-400/25 bg-gradient-to-b from-red-500/[0.12] to-charcoal-light/90 p-5 sm:p-6">
                  <h3 className="font-display text-lg font-semibold text-white">Not included</h3>
                  <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                    {vehicle.excluded.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span className="mt-0.5 shrink-0 text-red-400" aria-hidden>
                          ✕
                        </span>
                        <span>{item}</span>
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

      <FaqSection />

      <section className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-white">More from our fleet</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allVehicles
              .filter((v) => v.id !== vehicle.id)
              .map((v) => (
                <Link
                  key={v.id}
                  href={`/vehicles/${v.id}`}
                  className="card-hover overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      className="object-cover"
                      sizes="33vw"
                      unoptimized={v.image.startsWith("/uploads/")}
                    />
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
