import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
};

export function PageHero({
  title,
  subtitle,
  image = "/images/slider/slide-3.png",
  imageAlt = "Go Cozy Caravan",
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/88 to-charcoal/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/30" />
      </div>
      <div className="relative mx-auto flex min-h-[220px] max-w-6xl flex-col justify-end px-4 py-14 sm:min-h-[280px] sm:px-6 sm:py-16">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base text-zinc-300 sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
