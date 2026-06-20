import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { syncClerkUserToDatabase } from "@/lib/sync-clerk-user";

export const dynamic = "force-dynamic";

export default async function SyncUserPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  await syncClerkUserToDatabase(user);
  redirect("/");
}
