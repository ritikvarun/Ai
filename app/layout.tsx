import { ClerkProvider } from '@clerk/nextjs';
import { AuthProvider } from '@/lib/auth-context';
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Premium Startup Boilerplate",
  description: "Created using the ultimate interactive Next.js stack generator CLI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const disableClerk = process.env.NEXT_PUBLIC_DISABLE_CLERK === "true";

  const content = (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );

  if (disableClerk) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  );
}
