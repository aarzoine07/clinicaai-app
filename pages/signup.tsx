// pages/signup.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const THEME = {
  // pulled from your logo vibe
  bg1: "#0c1420",
  glowBlue: "rgba(72, 134, 255, 0.18)",
  glowGreen: "rgba(54, 211, 153, 0.12)",
  cardBg: "rgba(20, 30, 44, 0.85)",
  cardBorder: "rgba(40, 52, 69, 0.8)",
  cardShadow: "0 10px 40px rgba(0,0,0,0.45)",
  inputBg: "#141e2c",
  inputBorder: "#283445",
  inputFocus: "#4c6fff",
  heading: "#ffffff",
  body: "#c9d1d9",
  placeholder: "#9aa8b5",
  success: "#36d399",
  error: "#f87171",
  btnBg: "linear-gradient(180deg, #2f3a4d 0%, #222b39 100%)",
  btnHover: "linear-gradient(180deg, #39465a 0%, #273245 100%)",
  btnBorder: "#3a465a",
  maxWidth: 480,
};

type ApiOk = { message: string };
type ApiErr = { error: string };

const SignupPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err"; msg: string }>({
    kind: "idle",
    msg: "",
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Prefill from ?email=
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const qp = sp.get("email");
      if (qp) setEmail(qp);
    } catch {}
  }, []);

  const tryNavigateAfterSuccess = async () => {
    const target = process.env.NEXT_PUBLIC_REDIRECT_AFTER_SIGNUP;
    if (target) {
      location.assign(target);
      return true;
    }
    try {
      const res = await fetch("/check-email", { method: "HEAD" });
      if (res.ok) {
        location.assign("/check-email");
        return true;
      }
    } catch {}
    return false;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ kind: "err", msg: "Please enter your email. / Veuillez entrer votre courriel." });
      inputRef.current?.focus();
      return;
    }
    if (inputRef.current && !inputRef.current.checkValidity()) {
      inputRef.current.reportValidity();
      return;
    }

    setLoading(true);
    setStatus({ kind: "idle", msg: "" });

    let res: Response;
    try {
      res = await fetch("/api/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
    } catch {
      setLoading(false);
      setStatus({ kind: "err", msg: "Network error. Try again. / Erreur réseau. Réessayez." });
      return;
    }

    if (res.status === 405) {
      setLoading(false);
      setStatus({ kind: "err", msg: "Method not allowed. / Méthode non autorisée." });
      return;
    }
    if (res.status === 400) {
      let payload: ApiErr | undefined;
      try {
        payload = (await res.json()) as ApiErr;
      } catch {}
      setLoading(false);
      setStatus({ kind: "err", msg: payload?.error ?? "Invalid request. / Requête invalide." });
      return;
    }
    if (res.ok) {
      let ok: ApiOk | undefined;
      try {
        ok = (await res.json()) as ApiOk;
      } catch {}
      const navigated = await tryNavigateAfterSuccess();
      setLoading(false);
      if (!navigated) {
        setStatus({
          kind: "ok",
          msg:
            ok?.message ??
            "Magic link sent. Check your inbox. / Lien magique envoyé. Vérifiez votre boîte de réception.",
        });
      }
      return;
    }

    let fallback = "Unexpected error. Please try again. / Erreur inattendue. Réessayez.";
    try {
      const j = (await res.json()) as Partial<ApiErr>;
      if (typeof j.error === "string") fallback = j.error;
    } catch {}
    setLoading(false);
    setStatus({ kind: "err", msg: fallback });
  };

  const canSubmit = !loading && !!email.trim();

  return (
    <main className={inter.className} style={{ minHeight: "100vh", width: "100%", background: THEME.bg1 }}>
      <Head>
        <title>Sign up • ClinicaAI</title>
        <meta
          name="description"
          content="Create your ClinicaAI account and get a one-time magic link. No password required."
        />
      </Head>

      {/* Subtle radial glow background that matches the logo */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            `radial-gradient(1000px 600px at 20% 10%, ${THEME.glowBlue}, transparent 60%),` +
            `radial-gradient(800px 500px at 80% 90%, ${THEME.glowGreen}, transparent 60%)`,
          filter: "blur(2px)",
        }}
      />

      {/* Centered card */}
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "48px 20px",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: THEME.maxWidth,
            background: THEME.cardBg,
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 16,
            boxShadow: THEME.cardShadow,
            backdropFilter: "saturate(120%) blur(6px)",
            padding: "28px 24px 24px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img
              src="/logo.png"
              alt="ClinicaAI logo"
              width={64}
              height={64}
              style={{ borderRadius: 12, display: "block" }}
            />
          </div>

          {/* Headline */}
          <h1
            style={{
              color: THEME.heading,
              fontSize: 28,
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: -0.2,
              textAlign: "center",
              margin: 0,
            }}
          >
            Create your
            <br />
            ClinicaAI account
          </h1>
          <h2
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Créer votre compte ClinicaAI
          </h2>

          {/* Subcopy */}
          <p style={{ marginTop: 10, color: THEME.body, fontSize: 14, textAlign: "center" }}>
            Enter your email to receive a one-time magic link. No password required.
          </p>
          <p style={{ marginTop: 4, color: `${THEME.body}CC`, fontSize: 12, textAlign: "center" }}>
            Entrez votre courriel pour recevoir un lien magique à usage unique. Aucun mot de passe requis.
          </p>

          {/* Form */}
          <form onSubmit={onSubmit} noValidate aria-describedby="signup-help" style={{ marginTop: 20 }}>
            <label htmlFor="email" style={{ color: THEME.body, fontSize: 12 }}>
              Email address / Adresse courriel
            </label>
            <input
              ref={inputRef}
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
              style={{
                width: "100%",
                marginTop: 6,
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 16,
                outline: "none",
                background: THEME.inputBg,
                color: THEME.heading,
                border: `1px solid ${THEME.inputBorder}`,
                transition: "border-color 120ms ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = THEME.inputFocus)}
              onBlur={(e) => (e.currentTarget.style.borderColor = THEME.inputBorder)}
            />
            <div id="signup-help" style={{ color: THEME.placeholder, fontSize: 12, marginTop: 6 }}>
              Use your clinic/work email if possible. / Idéalement, utilisez le courriel de la clinique.
            </div>

            <button
              type="submit"
              disabled={!(!loading && !!email.trim())}
              style={{
                marginTop: 14,
                width: "100%",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: THEME.btnBg,
                border: `1px solid ${THEME.btnBorder}`,
                cursor: !loading && !!email.trim() ? "pointer" : "not-allowed",
                opacity: !loading && !!email.trim() ? 1 : 0.6,
                transition: "transform 120ms ease, background 120ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = THEME.btnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = THEME.btnBg)}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {loading ? "Sending…" : "Send magic link"}
            </button>
            <div
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {loading ? "Envoi en cours…" : "Envoyer le lien magique"}
            </div>

            {/* Inline status */}
            <div
              id="signup-status"
              role="status"
              aria-live="polite"
              style={{
                marginTop: 10,
                minHeight: 20,
                color:
                  status.kind === "ok"
                    ? THEME.success
                    : status.kind === "err"
                    ? THEME.error
                    : THEME.body,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {status.msg}
            </div>

            {/* Footer links */}
            <div style={{ marginTop: 18, textAlign: "center" }}>
              <a
                href="/"
                style={{
                  color: THEME.body,
                  fontSize: 12,
                  textDecoration: "underline",
                  textUnderlineOffset: 4,
                }}
              >
                Back to home →
              </a>
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                Retour à l’accueil
              </span>
            </div>

            {/* Compliance & note */}
            <div style={{ marginTop: 16, fontSize: 11, color: `${THEME.body}B3`, textAlign: "center" }}>
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              QC Law 25 / PIPEDA / CASL. Data residency: ca-central-1.
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;
