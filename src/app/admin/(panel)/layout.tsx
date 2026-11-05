import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { readAdminSession } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await readAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell
      adminName={session.name}
      adminEmail={session.email}
      adminRole={session.role}
    >
      {children}
    </AdminShell>
  );
}
