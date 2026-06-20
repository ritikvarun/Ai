import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#09090b' }}>
      <ClerkLoading>
        <p style={{ color: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>Loading sign in...</p>
      </ClerkLoading>
      <ClerkFailed>
        <p style={{ color: '#fafafa', fontFamily: 'system-ui, sans-serif', maxWidth: '28rem', textAlign: 'center' }}>
          Clerk could not load. Check your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in .env.
        </p>
      </ClerkFailed>
      <ClerkLoaded>
        <SignIn forceRedirectUrl="/sync-user" />
      </ClerkLoaded>
    </main>
  );
}
