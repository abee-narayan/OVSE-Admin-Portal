import { redirect } from "next/navigation";

// Root page: redirect to the role-switcher landing page
// Default demo entry point is L1; the UserAccountNav dropdown lets users switch roles
export default function Home() {
  redirect("/level_1/dashboard");
}
