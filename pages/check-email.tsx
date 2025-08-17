// pages/check-email.tsx
import Head from "next/head";

const THEME = {
  bg: "#0c1420",
  cardBg: "rgba(20, 30, 44, 0.85)",
  cardBorder: "rgba(40, 52, 69, 0.8)",
  heading: "#ffffff",
  body: "#c9d1d9",
};

export default function CheckEmail() {
  return (
    <main style={{ minHeight: "100vh", width: "100%", background: THEME.bg }}>
      <Head>
        <title>Check your email • ClinicaAI</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <section
          style={{
            width: "100%",
            maxWidth: 520,
            background: THEME.cardBg,
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 16,
            padding: "28px 24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img src="/logo.png" alt="ClinicaAI logo" width={56} height={56} style={{ borderRadius: 12 }} />
            <h1 style={{ color: THEME.heading, fontSize: 24, margin: "14px 0 6px" }}>
              We sent you a secure link
            </h1>
            <p style={{ color: THEME.body, fontSize: 14, margin: 0 }}>
              Open your inbox and click the magic link to continue.
            </p>
            <p style={{ color: THEME.body, fontSize: 12, marginTop: 6 }}>
              Nous vous avons envoyé un lien sécurisé. Ouvrez votre courriel et cliquez sur le lien magique.
            </p>

            <div style={{ marginTop: 18 }}>
              <a
                href="/signup"
                style={{
                  color: "#fff",
                  fontSize: 14,
                  padding: "10px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: "linear-gradient(180deg, #2f3a4d 0%, #222b39 100%)",
                  border: "1px solid #3a465a",
                }}
              >
                Try another email
              </a>
            </div>

            <div style={{ marginTop: 14 }}>
              <a href="/" style={{ color: THEME.body, fontSize: 12, textDecoration: "underline", textUnderlineOffset: 4 }}>
                Back to home →
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
