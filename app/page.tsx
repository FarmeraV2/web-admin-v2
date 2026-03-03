import { redirect } from "next/navigation";

// Root path is handled by proxy.ts (redirects by role).
// This page is a fallback for unauthenticated users.
export default function RootPage() {
  redirect("/login");
}
