import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CRM | Go Cozy Caravan",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[#0f0f0f] text-zinc-100">{children}</div>;
}
