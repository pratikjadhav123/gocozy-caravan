"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/contacts", label: "Enquiries" },
];

function roleLabel(role: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "staff") return "Staff";
  return "Admin";
}

function pageTitle(pathname: string) {
  if (pathname.startsWith("/admin/bookings")) return "Bookings";
  if (pathname.startsWith("/admin/contacts")) return "Enquiries";
  return "Dashboard";
}

export function AdminShell({
  children,
  adminName,
  adminEmail,
  adminRole,
}: {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
  adminRole: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitle(pathname);
  const badge = roleLabel(adminRole);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="flex flex-col border-b border-white/10 bg-charcoal lg:min-h-dvh lg:border-b-0 lg:border-r">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block">
            <Image
              src="/images/logo-header.png"
              alt="Go Cozy Caravan"
              width={744}
              height={160}
              className="h-10 w-auto max-w-[180px] object-contain object-left"
              priority
            />
          </Link>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            Admin CRM
          </p>
        </div>

        <nav className="flex flex-1 flex-col px-3 py-4">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {LINKS.map((link) => {
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-gold/15 text-gold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/"
              target="_blank"
              className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              View website
            </Link>
          </div>

          <div className="mt-auto border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121212]/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Go Cozy CRM
              </p>
              <h1 className="truncate font-display text-lg font-bold text-white sm:text-xl">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-charcoal-light/80 py-2 pl-2 pr-3 sm:gap-3.5 sm:pr-4">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-emerald-800 sm:h-12 sm:w-12">
                <Image
                  src="/images/admin/super-admin-avatar.png"
                  alt={adminName}
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-semibold text-white">{adminName}</p>
                <p className="truncate text-xs text-zinc-400">{adminEmail}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                  {badge}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
