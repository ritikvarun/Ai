import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'hsl(30 6% 8%)',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Background ambient blobs ── */}
      <div style={{
        position: 'absolute', top: '-18%', left: '-10%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, hsla(38,70%,55%,0.12) 0%, transparent 65%)',
        filter: 'blur(55px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-8%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, hsla(200,70%,55%,0.07) 0%, transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      {/* ── Dot grid ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, hsl(30 6% 20%) 1px, transparent 1px)',
        backgroundSize: '28px 28px', opacity: 0.35, pointerEvents: 'none',
      }} />

      {/* ══ LEFT PANEL (desktop only) ══ */}
      <div
        className="auth-left"
        style={{
          display: 'none', flexDirection: 'column', justifyContent: 'center',
          padding: '4rem 3rem', maxWidth: '460px',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, hsl(38,80%,62%) 0%, hsl(28,68%,50%) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', boxShadow: '0 6px 24px hsla(38,80%,60%,0.4)',
          }}>✦</div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'hsl(45,15%,93%)', letterSpacing: '-0.03em' }}>
            AuraFlow
          </span>
        </div>

        <h1 style={{
          fontSize: '2.6rem', fontWeight: 900, color: 'hsl(45,15%,93%)',
          lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.04em',
        }}>
          Welcome back to your{' '}
          <span style={{
            background: 'linear-gradient(135deg, hsl(38,85%,65%) 0%, hsl(28,75%,58%) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            workspace
          </span>
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'hsl(36,7%,58%)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Sign in with Google in one click. Your notes, tasks, boards,
          and team are waiting right where you left them.
        </p>

        {/* Quick feature chips */}
        {[
          { icon: '⚡', label: 'One-click Google Sign In' },
          { icon: '🔒', label: 'Secure & Encrypted by Clerk' },
          { icon: '✦', label: 'Picks up exactly where you left off' },
        ].map((f) => (
          <div key={f.label} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 16px', borderRadius: '12px',
            background: 'hsl(30 6% 13%)', border: '1px solid hsl(30 6% 20%)',
            marginBottom: '9px',
          }}>
            <span style={{ fontSize: '17px' }}>{f.icon}</span>
            <span style={{ fontSize: '0.85rem', color: 'hsl(45,15%,82%)', fontWeight: 600 }}>{f.label}</span>
          </div>
        ))}

        {/* Sign up link */}
        <p style={{ marginTop: '2.5rem', fontSize: '0.85rem', color: 'hsl(36,7%,50%)' }}>
          Don&apos;t have an account?{' '}
          <a href="/sign-up" style={{
            color: 'hsl(38,78%,65%)', fontWeight: 700, textDecoration: 'none',
          }}>
            Sign up free →
          </a>
        </p>
      </div>

      {/* ══ RIGHT PANEL — Clerk widget ══ */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 2, padding: '2rem 1rem',
      }}>
        {/* Mobile logo */}
        <div className="auth-mobile-logo" style={{
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem',
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, hsl(38,80%,62%) 0%, hsl(28,68%,50%) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', boxShadow: '0 4px 18px hsla(38,80%,60%,0.38)',
          }}>✦</div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'hsl(45,15%,93%)', letterSpacing: '-0.03em' }}>
            AuraFlow
          </span>
        </div>

        <ClerkLoading>
          <div style={{
            width: '380px', height: '380px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'hsl(30 6% 13%)', border: '1px solid hsl(30 6% 20%)',
            borderRadius: '22px', gap: '14px',
          }}>
            <div style={{
              width: '38px', height: '38px',
              border: '3px solid hsl(30 6% 22%)',
              borderTop: '3px solid hsl(38,80%,60%)',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
            }} />
            <p style={{ color: 'hsl(36,7%,58%)', fontSize: '0.88rem' }}>Getting ready…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </ClerkLoading>

        <ClerkFailed>
          <div style={{
            width: '380px', padding: '2.5rem', textAlign: 'center',
            background: 'hsl(30 6% 13%)', border: '1px solid hsla(0,75%,50%,0.35)',
            borderRadius: '22px',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: 'hsl(45,15%,91%)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Auth failed to load
            </h3>
            <p style={{ color: 'hsl(36,7%,58%)', fontSize: '0.85rem', lineHeight: 1.6 }}>
              Check your{' '}
              <code style={{ color: 'hsl(38,80%,65%)', background: 'hsl(30 6% 18%)', padding: '1px 6px', borderRadius: '4px' }}>
                CLERK_SECRET_KEY
              </code>{' '}
              in <code style={{ color: 'hsl(38,80%,65%)', background: 'hsl(30 6% 18%)', padding: '1px 6px', borderRadius: '4px' }}>.env</code>
            </p>
          </div>
        </ClerkFailed>

        <ClerkLoaded>
          <SignIn
            forceRedirectUrl="/sync-user"
            appearance={{
              variables: {
                colorPrimary: 'hsl(38,72%,58%)',
                colorBackground: 'hsl(30,6%,13%)',
                colorInputBackground: 'hsl(30,6%,16%)',
                colorInputText: 'hsl(45,15%,92%)',
                colorText: 'hsl(45,15%,92%)',
                colorTextSecondary: 'hsl(36,7%,58%)',
                colorNeutral: 'hsl(30,6%,58%)',
                borderRadius: '12px',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '15px',
              },
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'blockButton',
              },
              elements: {
                card: {
                  background: 'hsl(30,6%,13%)',
                  border: '1px solid hsl(30,6%,22%)',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.55)',
                  borderRadius: '22px',
                  padding: '2rem',
                },
                headerTitle: {
                  color: 'hsl(45,15%,93%)',
                  fontSize: '1.55rem',
                  fontWeight: '800',
                  letterSpacing: '-0.025em',
                },
                headerSubtitle: { color: 'hsl(36,7%,58%)' },
                socialButtonsBlockButton: {
                  background: 'hsl(30,6%,18%)',
                  border: '1.5px solid hsl(30,6%,26%)',
                  color: 'hsl(45,15%,88%)',
                  fontWeight: '600',
                  padding: '10px 16px',
                },
                socialButtonsBlockButtonText: { fontWeight: '600' },
                dividerLine: { background: 'hsl(30,6%,22%)' },
                dividerText: { color: 'hsl(36,7%,50%)' },
                formFieldLabel: { color: 'hsl(45,15%,78%)', fontWeight: '500' },
                formFieldInput: {
                  background: 'hsl(30,6%,16%)',
                  border: '1.5px solid hsl(30,6%,25%)',
                  color: 'hsl(45,15%,92%)',
                },
                formButtonPrimary: {
                  background: 'linear-gradient(135deg, hsl(38,78%,58%) 0%, hsl(28,70%,50%) 100%)',
                  color: 'hsl(30,6%,8%)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  padding: '12px',
                  boxShadow: '0 4px 16px hsla(38,78%,58%,0.3)',
                },
                footerActionLink: { color: 'hsl(38,72%,65%)' },
                alert: {
                  background: 'hsla(0,75%,45%,0.14)',
                  border: '1px solid hsla(0,75%,45%,0.3)',
                  color: 'hsl(0,85%,75%)',
                },
              },
            }}
          />
        </ClerkLoaded>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @media (min-width: 900px) {
          .auth-left        { display: flex !important; }
          .auth-mobile-logo { display: none  !important; }
        }
      `}</style>
    </main>
  );
}
