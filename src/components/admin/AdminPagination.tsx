import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Build href for a given page number while keeping other query params. */
  hrefForPage: (page: number) => string;
};

export function AdminPagination({ page, totalPages, total, pageSize, hrefForPage }: Props) {
  if (total <= 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  const windowStart = Math.max(1, page - 2);
  const windowEnd = Math.min(totalPages, windowStart + 4);
  const pages: number[] = [];
  for (let p = windowStart; p <= windowEnd; p += 1) pages.push(p);

  return (
    <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-zinc-500">
        Showing <span className="text-zinc-300">{from}</span>–
        <span className="text-zinc-300">{to}</span> of{" "}
        <span className="text-zinc-300">{total}</span>
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          href={hrefForPage(prev)}
          aria-disabled={page <= 1}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
            page <= 1
              ? "pointer-events-none border-white/5 text-zinc-600"
              : "border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
          }`}
        >
          Prev
        </Link>

        {pages.map((p) => (
          <Link
            key={p}
            href={hrefForPage(p)}
            className={`min-w-8 rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold transition ${
              p === page
                ? "bg-gold text-charcoal"
                : "border border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
            }`}
          >
            {p}
          </Link>
        ))}

        <Link
          href={hrefForPage(next)}
          aria-disabled={page >= totalPages}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
            page >= totalPages
              ? "pointer-events-none border-white/5 text-zinc-600"
              : "border-white/15 text-zinc-300 hover:border-gold/50 hover:text-gold"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
