// pages/signup.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const THEME = {
  bg: "#0c1420",
  inputBg: "#141e2c",
  inputBorder: "#283445",
  inputFocus: "#4c6fff",
  btnBg: "#2a3342",
  btnBorder: "#3a465a",
  btnHover: "#334056",
  heading: "#ffffff",
  body: "#c9d1d9",
  placeholder: "#9aa8b5",
  success: "#36d399",
  error: "#f87171",
  maxWidth: 800,
};

type ApiOk = { message: string };
type ApiErr = { error: string };

const SignupPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err"; msg: string }>({ kind: "idle", msg: "" });
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Prefill if ?email= is present
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const qp = sp.get("email");
      if (qp) setEmail(qp);
    } catch {}
  }, []);

  const tryNavigateAfterSuccess = async () => {
    // 1) Env var override
    const target = process.env.NEXT_PUBLIC_REDIRECT_AFTER_SIGNUP;
    if (target) {
      location.assign(target);
      return true;
    }
    // 2) /check-email if present
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
    // basic HTML5 validity
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
      try { payload = (await res.json()) as ApiErr; } catch {}
      setLoading(false);
      setStatus({ kind: "err", msg: payload?.error ?? "Invalid request. / Requête invalide." });
      return;
    }

    if (res.ok) {
      let ok: ApiOk | undefined;
      try { ok = (await res.json()) as ApiOk; } catch {}
      // Try to navigate; if not, show inline success
      const navigated = await tryNavigateAfterSuccess();
      setLoading(false);
      if (!navigated) {
        setStatus({
          kind: "ok",
          msg: ok?.message ?? "Magic link sent. Check your inbox. / Lien magique envoyé. Vérifiez votre boîte de réception.",
        });
      }
      return;
    }

    // unexpected status
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
    <main style={{ minHeight: "100vh", width: "100%", background: THEME.bg }}>
      <Head>
        <title>Sign up • ClinicaAI</title>
        <meta
          name="description"
          content="Create your ClinicaAI account and get a one-time magic link. No password required."
        />
      </Head>

      <div style={{ margin: "0 auto", width: "100%", padding: "0 24px", maxWidth: THEME.maxWidth }}>
        <section style={{ paddingTop: 96 }}>
          <h1
            style={{
              color: THEME.heading,
              fontSize: 40,
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: -0.5,
              margin: 0,
            }}
          >
            Create your
            <br />
            ClinicaAI account
          </h1>
          <h2 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
            Créer votre compte ClinicaAI
          </h2>

          <p style={{ marginTop: 12, color: THEME.body, fontSize: 16, maxWidth: 640 }}>
            Enter your email to receive a one-time magic link. No password required.
          </p>
          <p style={{ marginTop: 6, color: `${THEME.body}CC`, fontSize: 14, maxWidth: 640 }}>
            Entrez votre courriel pour recevoir un lien magique à usage unique. Aucun mot de passe requis.
          </p>

          <form onSubmit={onSubmit} noValidate aria-describedby="signup-help" style={{ marginTop: 32, maxWidth: 640 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="email" style={{ color: THEME.body, fontSize: 14 }}>
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
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 16,
                  outline: "none",
                  background: THEME.inputBg,
                  color: THEME.heading,
                  border: `1px solid ${THEME.inputBorder}`,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = THEME.inputFocus)}
                onBlur={(e) => (e.currentTarget.style.borderColor = THEME.inputBorder)}
              />

              <div id="signup-help" style={{ color: THEME.placeholder, fontSize: 12 }}>
                Use your clinic/work email if possible. / Idéalement, utilisez le courriel de la clinique.
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fff",
                  background: THEME.btnBg,
                  border: `1px solid ${THEME.btnBorder}`,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  opacity: canSubmit ? 1 : 0.6,
                }}
                onMouseEnter={(e) => canSubmit && (e.currentTarget.style.background = THEME.btnHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = THEME.btnBg)}
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
              <div style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
                {loading ? "Envoi en cours…" : "Envoyer le lien magique"}
              </div>
            </div>

            <div
              id="signup-status"
              role="status"
              aria-live="polite"
              style={{
                marginTop: 12,
                minHeight: 20,
                color: status.kind === "ok" ? THEME.success : status.kind === "err" ? THEME.error : THEME.body,
                fontSize: 14,
              }}
            >
              {status.msg}
            </div>

            <div style={{ marginTop: 40 }}>
              <a href="/" style={{ color: THEME.body, fontSize: 12, textDecoration: "underline", textUnderlineOffset: 4 }}>
                Back to home →
              </a>
              <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
                Retour à l’accueil
              </span>
            </div>

            {/* Compliance & disclosures (static text for now) */}
            <div style={{ marginTop: 32, fontSize: 12, color: `${THEME.body}B3`, maxWidth: 640 }}>
              This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.  
              (QC Law 25 / PIPEDA / CASL: we store call logs in ca-central-1.)
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;

