import "server-only";

import { getCurrentUser } from "./current-user";
import { eq, or } from "drizzle-orm";

import { db, users } from "@/db";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export async function syncClerkUserToDatabase(clerkUser?: ClerkUser | null) {
  clerkUser ??= await getCurrentUser();

  if (!clerkUser) {
    return null;
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    return null;
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    primaryEmail;

  const existingUser = await db.query.users.findFirst({
    where: or(eq(users.clerkId, clerkUser.id), eq(users.email, primaryEmail)),
  });

  const userValues = {
    clerkId: clerkUser.id,
    name,
    email: primaryEmail,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
    updatedAt: new Date(),
  };

  if (existingUser) {
    const [updatedUser] = await db
      .update(users)
      .set(userValues)
      .where(eq(users.id, existingUser.id))
      .returning();

    return updatedUser;
  }

  const [createdUser] = await db
    .insert(users)
    .values(userValues)
    .returning();

  return createdUser;
}
