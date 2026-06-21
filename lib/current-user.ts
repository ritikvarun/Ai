import { currentUser as clerkCurrentUser } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const disableClerk = process.env.NEXT_PUBLIC_DISABLE_CLERK === "true";

  if (disableClerk) {
    return {
      id: "user_mock123",
      firstName: "Sarah",
      lastName: "Jenkins",
      username: "sarah_jenkins",
      imageUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
      emailAddresses: [
        {
          id: "email_mock123",
          emailAddress: "sarah@auraflow.io",
        }
      ],
      primaryEmailAddressId: "email_mock123",
    };
  }

  return await clerkCurrentUser();
}
