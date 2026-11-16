"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type NavItem = { href: string; label: string; match?: string };

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", match: "/admin$" }],
  },
  {
    title: "CRM",
    items: [
      { href: "/admin/bookings", label: "Bookings" },
      { href: "/admin/contacts", label: "Enquiries" },
    ],
  },
  {
    title: "Website content",
    items: [
      { href: "/admin/media-library", label: "Media Library" },
      { href: "/admin/banners", label: "Banners & Sliders" },
      { href: "/admin/fleet", label: "Caravan / Fleet" },
      { href: "/admin/destinations", label: "Destinations" },
      { href: "/admin/gallery", label: "Gallery" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/pages", label: "Pages & Content" },
    ],
  },
  {
    title: "System",
    items: [{ href: "/admin/settings", label: "Settings" }],
  },
];

function roleLabel(role: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "staff") return "Staff";
  return "Admin";
}

function pageTitle(pathname: string) {
  if (pathname.startsWith("/admin/bookings/new")) return "New booking";
  if (pathname.startsWith("/admin/bookings")) return "Bookings";
  if (pathname.startsWith("/admin/contacts")) return "Enquiries";
  if (pathname.startsWith("/admin/media-library")) return "Media Library";
  if (pathname.startsWith("/admin/banners")) return "Banners & Sliders";
  if (pathname.startsWith("/admin/fleet")) return "Caravan / Fleet";
  if (pathname.startsWith("/admin/destinations")) return "Destinations";
  if (pathname.startsWith("/admin/gallery")) return "Gallery";
  if (pathname.startsWith("/admin/testimonials")) return "Testimonials";
  if (pathname.startsWith("/admin/pages")) return "Pages & Content";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  if (pathname.startsWith("/admin/content")) return "Content";
  return "Dashboard";
}

function isActive(pathname: string, item: NavItem) {
  if (item.match) return new RegExp(item.match).test(pathname);
  if (item.href === "/admin") return pathname === "/admin";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
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
  const flatLinks = NAV_GROUPS.flatMap((g) => g.items);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-[#0f0f0f]">
      <aside className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-charcoal lg:inset-y-0 lg:left-0 lg:right-auto lg:w-[270px] lg:border-b-0 lg:border-r">
        {/* Mobile top bar */}
        <div className="flex h-14 items-center gap-2 overflow-x-auto px-3 lg:hidden">
          <Link href="/admin" className="shrink-0">
            <Image
              src="/images/logo-header.png"
              alt="Go Cozy Caravan"
              width={744}
              height={160}
              className="h-7 w-auto max-w-[120px] object-contain object-left"
              priority
            />
          </Link>
          {flatLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-lg px-2 py-1 text-[11px] font-medium ${
                isActive(pathname, link) ? "bg-gold/15 text-gold" : "text-zinc-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={logout}
            className="ml-auto shrink-0 rounded-lg px-2 py-1 text-[11px] text-red-300"
          >
            Logout
          </button>
        </div>

        {/* Desktop fixed sidebar — no page scroll here */}
        <div className="hidden h-full flex-col lg:flex">
          <div className="shrink-0 border-b border-white/10 px-5 py-5">
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

          <nav className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-4">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {group.title}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((link) => {
                      const active = isActive(pathname, link);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "bg-gold/15 text-gold"
                              : "text-zinc-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <Link
                href="/"
                target="_blank"
                className="block rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                View website
              </Link>
            </div>

            <div className="mt-3 shrink-0 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col pt-14 lg:ml-[270px] lg:pt-0">
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

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-charcoal-light/80 py-2 pl-2 pr-3 sm:pr-4">
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
