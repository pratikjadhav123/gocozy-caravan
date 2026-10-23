type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="border-b border-white/10 bg-gradient-to-b from-charcoal-light to-charcoal py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-base text-zinc-400 sm:text-lg">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
