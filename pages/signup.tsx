// pages/signup.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

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
  maxWidth: 800,
};

const SignupPage: NextPage = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // API call comes next step
  };

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
          {/* Headline EN */}
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
          {/* Headline FR-CA (visually hidden but present for semantics) */}
          <h2 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
            Créer votre compte ClinicaAI
          </h2>

          {/* Subcopy EN */}
          <p style={{ marginTop: 12, color: THEME.body, fontSize: 16, maxWidth: 640 }}>
            Enter your email to receive a one-time magic link. No password required.
          </p>
          {/* Subcopy FR-CA */}
          <p style={{ marginTop: 6, color: `${THEME.body}CC`, fontSize: 14, maxWidth: 640 }}>
            Entrez votre courriel pour recevoir un lien magique à usage unique. Aucun mot de passe requis.
          </p>

          <form onSubmit={onSubmit} noValidate aria-describedby="signup-help" style={{ marginTop: 32, maxWidth: 640 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label htmlFor="email" style={{ color: THEME.body, fontSize: 14 }}>
                Email address / Adresse courriel
              </label>

              <input
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
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = THEME.btnHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = THEME.btnBg)}
              >
                Send magic link
              </button>
              <div style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
                Envoyer le lien magique
              </div>
            </div>

            <div id="signup-status" role="status" aria-live="polite" style={{ marginTop: 12, minHeight: 20, color: THEME.body, fontSize: 14 }} />

            <div style={{ marginTop: 40 }}>
              <a href="/" style={{ color: THEME.body, fontSize: 12, textDecoration: "underline", textUnderlineOffset: 4 }}>
                Back to home →
              </a>
              <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
                Retour à l’accueil
              </span>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;
