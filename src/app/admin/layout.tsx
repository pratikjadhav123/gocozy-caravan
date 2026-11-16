import type { Metadata } from "next";
import { AdminToaster } from "@/components/admin/AdminToaster";

export const metadata: Metadata = {
  title: "Admin CRM | Go Cozy Caravan",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin className="admin-theme min-h-dvh">
      {children}
      <AdminToaster />
    </div>
  );
}
