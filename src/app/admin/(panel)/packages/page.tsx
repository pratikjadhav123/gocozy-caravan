import { redirect } from "next/navigation";

/** Packages CMS removed — send admins to Pages. */
export default function AdminPackagesCmsPage() {
  redirect("/admin/pages");
}
