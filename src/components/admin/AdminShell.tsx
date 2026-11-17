"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type NavItem = {
  href: string;
  label: string;
  match?: string;
  icon:
    | "dashboard"
    | "bookings"
    | "calendar"
    | "enquiries"
    | "media"
    | "banners"
    | "fleet"
    | "destinations"
    | "gallery"
    | "testimonials"
    | "pages"
    | "settings"
    | "website";
};

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", match: "/admin$", icon: "dashboard" }],
  },
  {
    title: "CRM",
    items: [
      {
        href: "/admin/bookings",
        label: "Bookings",
        match: "^/admin/bookings(?!/calendar)(/|$)",
        icon: "bookings",
      },
      { href: "/admin/bookings/calendar", label: "Calendar", icon: "calendar" },
      { href: "/admin/contacts", label: "Enquiries", icon: "enquiries" },
    ],
  },
  {
    title: "Website content",
    items: [
      { href: "/admin/media-library", label: "Media Library", icon: "media" },
      { href: "/admin/banners", label: "Banners & Sliders", icon: "banners" },
      { href: "/admin/fleet", label: "Caravan / Fleet", icon: "fleet" },
      { href: "/admin/destinations", label: "Destinations", icon: "destinations" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
      { href: "/admin/testimonials", label: "Testimonials", icon: "testimonials" },
      { href: "/admin/pages", label: "Pages & Content", icon: "pages" },
    ],
  },
  {
    title: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: "settings" }],
  },
];

const SIDEBAR_KEY = "gocozy-admin-sidebar";

function roleLabel(role: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "staff") return "Staff";
  return "Admin";
}

function pageTitle(pathname: string) {
  if (pathname.startsWith("/admin/bookings/new")) return "New booking";
  if (pathname.startsWith("/admin/bookings/calendar")) return "Booking calendar";
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

function NavIcon({ name, className = "" }: { name: NavItem["icon"]; className?: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case "bookings":
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 11h18" />
          <path d="M8 15h2M12 15h2M16 15h2M8 18h2M12 18h2" />
        </svg>
      );
    case "enquiries":
      return (
        <svg {...common}>
          <path d="M4 6h16v12H7l-3 3V6z" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      );
    case "media":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="11" r="2" />
          <path d="M21 16l-5-5-7 7" />
        </svg>
      );
    case "banners":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case "fleet":
      return (
        <svg {...common}>
          <path d="M3 14h18l-1.5-5.5A2 2 0 0 0 17.6 7H6.4a2 2 0 0 0-1.9 1.5L3 14z" />
          <circle cx="7.5" cy="16.5" r="1.5" />
          <circle cx="16.5" cy="16.5" r="1.5" />
        </svg>
      );
    case "destinations":
      return (
        <svg {...common}>
          <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="7" height="7" rx="1.5" />
          <rect x="14" y="4" width="7" height="7" rx="1.5" />
          <rect x="3" y="13" width="7" height="7" rx="1.5" />
          <rect x="14" y="13" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "testimonials":
      return (
        <svg {...common}>
          <path d="M8 10h.01M12 10h.01M16 10h.01M5 19l2.5-2.5H19a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7.5A2 2 0 0 0 5 17v2z" />
        </svg>
      );
    case "pages":
      return (
        <svg {...common}>
          <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "website":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    default:
      return null;
  }
}

function SidebarNav({
  pathname,
  expanded,
  onNavigate,
}: {
  pathname: string;
  expanded: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="admin-sidebar-scroll min-h-0 flex-1 space-y-4 overflow-y-auto">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          {expanded ? (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {group.title}
            </p>
          ) : (
            <div className="mx-auto mb-2 h-px w-8 bg-white/10" />
          )}
          <div className="flex flex-col gap-0.5">
            {group.items.map((link) => {
              const active = isActive(pathname, link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  onClick={onNavigate}
                  className={`group relative flex items-center gap-3 rounded-xl transition ${
                    expanded ? "px-3 py-2.5" : "justify-center px-2 py-2.5"
                  } ${
                    active
                      ? expanded
                        ? "bg-gold/15 text-gold"
                        : "bg-gradient-to-br from-gold/90 to-amber-600 text-charcoal shadow-lg shadow-gold/20"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {expanded && active ? (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-gold" />
                  ) : null}
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                      active && !expanded
                        ? "border-transparent"
                        : active
                          ? "border-gold/30"
                          : "border-white/10 group-hover:border-white/20"
                    }`}
                  >
                    <NavIcon name={link.icon} />
                  </span>
                  {expanded ? (
                    <span className="truncate text-sm font-medium">{link.label}</span>
                  ) : (
                    <span className="sr-only">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      <Link
        href="/"
        target="_blank"
        title="View website"
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-xl text-zinc-400 transition hover:bg-white/5 hover:text-white ${
          expanded ? "px-3 py-2.5" : "justify-center px-2 py-2.5"
        }`}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10">
          <NavIcon name="website" />
        </span>
        {expanded ? <span className="text-sm">View website</span> : <span className="sr-only">View website</span>}
      </Link>
    </div>
  );
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
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(SIDEBAR_KEY);
    if (saved === "closed") setDesktopOpen(false);
    else if (saved === "open") setDesktopOpen(true);
    setReady(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  function toggleDesktopSidebar() {
    setDesktopOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_KEY, next ? "open" : "closed");
      return next;
    });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Logged out");
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebarWidth = desktopOpen ? "lg:w-[270px]" : "lg:w-[84px]";
  const contentMargin = desktopOpen ? "lg:ml-[270px]" : "lg:ml-[84px]";

  return (
    <div className="min-h-dvh bg-[#0f0f0f]">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-3 border-b border-white/10 bg-charcoal px-3 sm:px-4 lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-zinc-200"
            aria-label="Open menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/admin" className="min-w-0 shrink">
            <Image
              src="/images/logo-header.png"
              alt="Go Cozy Caravan"
              width={744}
              height={160}
              className="h-7 w-auto max-w-[130px] object-contain object-left"
              priority
            />
          </Link>
        </div>
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-emerald-800">
          <Image
            src="/images/admin/super-admin-avatar.png"
            alt={adminName}
            fill
            className="object-cover object-top"
            sizes="36px"
          />
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[min(88vw,300px)] max-w-full flex-col border-r border-white/10 bg-charcoal shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
            <div className="min-w-0">
              <Image
                src="/images/logo-header.png"
                alt="Go Cozy Caravan"
                width={744}
                height={160}
                className="h-9 w-auto max-w-[160px] object-contain object-left"
              />
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Admin CRM
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-zinc-300"
              aria-label="Close menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-4">
            <SidebarNav pathname={pathname} expanded onNavigate={() => setMobileOpen(false)} />
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
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden border-r border-white/10 bg-charcoal transition-[width] duration-300 ease-out lg:flex lg:flex-col ${sidebarWidth}`}
      >
        <div className={`shrink-0 border-b border-white/10 ${desktopOpen ? "px-5 py-5" : "px-3 py-4"}`}>
          <div className={`flex items-center ${desktopOpen ? "justify-between gap-2" : "flex-col gap-3"}`}>
            <Link href="/admin" className={desktopOpen ? "block min-w-0" : "flex justify-center"}>
              {desktopOpen ? (
                <Image
                  src="/images/logo-header.png"
                  alt="Go Cozy Caravan"
                  width={744}
                  height={160}
                  className="h-10 w-auto max-w-[180px] object-contain object-left"
                  priority
                />
              ) : (
                <Image
                  src="/images/logo-header.png"
                  alt="Go Cozy"
                  width={744}
                  height={160}
                  className="h-8 w-8 object-contain"
                  priority
                />
              )}
            </Link>
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 text-zinc-300 transition hover:border-gold/50 hover:text-gold"
              aria-label={desktopOpen ? "Close sidebar" : "Open sidebar"}
              title={desktopOpen ? "Close sidebar" : "Open sidebar"}
            >
              {desktopOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
          {desktopOpen ? (
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              Admin CRM
            </p>
          ) : null}
        </div>

        <nav className={`flex min-h-0 flex-1 flex-col overflow-hidden py-4 ${desktopOpen ? "px-3" : "px-2"}`}>
          <SidebarNav pathname={pathname} expanded={desktopOpen} />
          <div className={`mt-3 shrink-0 border-t border-white/10 pt-3 ${desktopOpen ? "" : "px-0"}`}>
            <button
              type="button"
              onClick={logout}
              title="Logout"
              className={`w-full rounded-xl text-red-300 transition hover:bg-red-500/10 ${
                desktopOpen ? "px-3 py-2.5 text-left text-sm" : "flex justify-center px-2 py-2.5"
              }`}
            >
              {desktopOpen ? (
                "Logout"
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2M15 12H3m0 0l3-3m-3 3l3 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </aside>

      <div
        className={`flex min-h-dvh min-w-0 flex-col pt-14 transition-[margin] duration-300 ease-out lg:pt-0 ${contentMargin} ${
          ready ? "" : ""
        }`}
      >
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121212]/95 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={toggleDesktopSidebar}
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 text-zinc-300 transition hover:border-gold/50 hover:text-gold lg:inline-flex"
                aria-label={desktopOpen ? "Close sidebar" : "Open sidebar"}
                title={desktopOpen ? "Close" : "Open"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:text-[11px]">
                  Go Cozy CRM
                </p>
                <h1 className="truncate font-display text-base font-bold text-white sm:text-lg lg:text-xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex max-w-[58%] items-center gap-2 rounded-2xl border border-white/10 bg-charcoal-light/80 py-1.5 pl-1.5 pr-2 sm:max-w-none sm:gap-3 sm:py-2 sm:pl-2 sm:pr-4">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-gold/40 bg-emerald-800 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                <Image
                  src="/images/admin/super-admin-avatar.png"
                  alt={adminName}
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-xs font-semibold text-white sm:text-sm">{adminName}</p>
                <p className="hidden truncate text-xs text-zinc-400 sm:block">{adminEmail}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">{badge}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="min-w-0 flex-1 overflow-x-clip px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
