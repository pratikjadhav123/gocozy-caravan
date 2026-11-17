import { redirect } from "next/navigation";

/** Packages removed from the public site — keep URL friendly. */
export default function PackagesPage() {
  redirect("/contact");
}
