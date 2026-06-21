import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

import { syncClerkUserToDatabase } from "@/lib/sync-clerk-user";

export const dynamic = "force-dynamic";

export default async function SyncUserPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  await syncClerkUserToDatabase(user);
  redirect("/");
}
