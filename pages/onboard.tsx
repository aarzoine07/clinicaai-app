// pages/onboard.tsx
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

/** Dark theme tuned to match /signup */
const THEME = {
  bg: "#0c1420",
  glowBlue: "rgba(72, 134, 255, 0.18)",
  glowGreen: "rgba(54, 211, 153, 0.12)",
  cardBg: "rgba(20, 30, 44, 0.92)",
  cardBorder: "rgba(40, 52, 69, 0.9)",
  cardShadow: "0 12px 60px rgba(0,0,0,0.50)",
  inputBg: "#141e2c",
  inputBorder: "#283445",
  inputFocus: "#4c6fff",
  heading: "#ffffff",
  body: "#c9d1d9",
  placeholder: "#9aa8b5",
  success: "#36d399",
  error: "#f87171",
  btnBg: "linear-gradient(180deg, #2f3a4d 0%, #222b39 100%)",
  btnHover: "linear-gradient(180deg, #3a465a 0%, #273245 100%)",
  btnBorder: "#3a465a",
  maxWidth: 780,
};

type Payload = {
  clinicName: string;
  websiteUrl: string;
  googleBusinessUrl: string;
  servicesHours: string;
  acceptedTerms: boolean;
  caslOptIn: boolean;
};

export default function Onboard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err"; msg: string }>({
    kind: "idle",
    msg: "",
  });

  // Refs
  const clinicRef = useRef<HTMLInputElement | null>(null);
  const websiteRef = useRef<HTMLInputElement | null>(null);
  const gmbRef = useRef<HTMLInputElement | null>(null);
  const servicesRef = useRef<HTMLTextAreaElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);
  const caslRef = useRef<HTMLInputElement | null>(null);

  // Prefill from URL (?clinic=&website=&gmb=)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get("clinic") || "";
    const w = sp.get("website") || "";
    const g = sp.get("gmb") || "";
    if (clinicRef.current && c) clinicRef.current.value = c;
    if (websiteRef.current && w) websiteRef.current.value = w;
    if (gmbRef.current && g) gmbRef.current.value = g;
  }, []);

  const focusInvalid = (el?: { focus: () => void } | null) => {
    try {
      el?.focus();
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "idle", msg: "" });

    const clinicName = clinicRef.current?.value.trim() || "";
    const websiteUrl = websiteRef.current?.value.trim() || "";
    const googleBusinessUrl = gmbRef.current?.value.trim() || "";
    const servicesHours = servicesRef.current?.value.trim() || "";
    const acceptedTerms = !!termsRef.current?.checked;
    const caslOptIn = !!caslRef.current?.checked;

    // Basic validations
    if (!clinicName) {
      setStatus({ kind: "err", msg: "Please provide the clinic name. / Veuillez indiquer le nom de la clinique." });
      return focusInvalid(clinicRef.current);
    }
    if (!websiteUrl) {
      setStatus({ kind: "err", msg: "Please provide the website URL. / Veuillez indiquer l’URL du site web." });
      return focusInvalid(websiteRef.current);
    }
    if (!acceptedTerms) {
      setStatus({
        kind: "err",
        msg:
          "Please accept the Terms & Privacy to continue. / Veuillez accepter les Conditions et la Politique pour continuer.",
      });
      return focusInvalid(termsRef.current);
    }

    const payload: Payload = {
      clinicName,
      websiteUrl,
      googleBusinessUrl,
      servicesHours,
      acceptedTerms,
      caslOptIn,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/voice-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Server error");
      }

      setStatus({
        kind: "ok",
        msg: "Saved. We’ll use this to set up your agent. / Enregistré. Nous utiliserons ces infos pour configurer votre agent.",
      });
    } catch (err: any) {
      setStatus({
        kind: "err",
        msg: err?.message || "Unexpected error. Try again. / Erreur inattendue. Réessayez.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginTop: 6,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 16,
    outline: "none",
    background: THEME.inputBg,
    color: THEME.heading,
    border: `1px solid ${THEME.inputBorder}`,
    transition: "border-color 140ms ease",
  };

  const small = { color: THEME.placeholder, fontSize: 12 } as const;

  return (
    <main className={inter.className} style={{ minHeight: "100vh", width: "100%", background: THEME.bg }}>
      <Head>
        <title>Onboarding • ClinicaAI</title>
        <meta name="description" content="Provide your clinic details to set up your ClinicaAI voice agent." />
        <style>{`
          html, body, #__next { height: 100%; }
          body { margin: 0; background: ${THEME.bg}; color-scheme: dark; }
          * { box-sizing: border-box; }
        `}</style>
      </Head>

      {/* Background glows */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            `radial-gradient(1200px 700px at 20% 10%, ${THEME.glowBlue}, transparent 60%),` +
            `radial-gradient(900px 550px at 80% 90%, ${THEME.glowGreen}, transparent 60%)`,
          filter: "blur(2px)",
        }}
      />

      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <section
          style={{
            width: "100%",
            maxWidth: THEME.maxWidth,
            background: THEME.cardBg,
            border: `1px solid ${THEME.cardBorder}`,
            borderRadius: 18,
            boxShadow: THEME.cardShadow,
            backdropFilter: "saturate(120%) blur(8px)",
            padding: "28px 24px 24px",
          }}
        >
          <h1
            style={{
              color: THEME.heading,
              fontSize: 28,
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: -0.2,
              margin: 0,
              textAlign: "center",
            }}
          >
            Tell us about your clinic
          </h1>
          <p style={{ color: THEME.body, fontSize: 14, textAlign: "center", marginTop: 8 }}>
            Basic details help us auto-provision your AI receptionist.
          </p>
          <p style={{ color: `${THEME.body}CC`, fontSize: 12, textAlign: "center", marginTop: 4 }}>
            Données de base pour configurer votre réceptionniste IA.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 20 }}>
            {/* Clinic Name */}
            <div style={{ marginTop: 8 }}>
              <label htmlFor="clinicName" style={{ color: THEME.body, fontSize: 12 }}>
                Clinic name / Nom de la clinique
              </label>
              <input
                id="clinicName"
                ref={clinicRef}
                placeholder="Clinique Dentaire du Vieux-Montréal"
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = THEME.inputFocus)}
                onBlur={(e) => (e.currentTarget.style.borderColor = THEME.inputBorder)}
              />
            </div>

            {/* Website URL */}
            <div style={{ marginTop: 12 }}>
              <label htmlFor="websiteUrl" style={{ color: THEME.body, fontSize: 12 }}>
                Website URL / URL du site web
              </label>
              <input
                id="websiteUrl"
                ref={websiteRef}
                type="url"
                placeholder="https://votreclinique.ca"
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = THEME.inputFocus)}
                onBlur={(e) => (e.currentTarget.style.borderColor = THEME.inputBorder)}
              />
            </div>

            {/* Google Business Profile */}
            <div style={{ marginTop: 12 }}>
              <label htmlFor="gmbUrl" style={{ color: THEME.body, fontSize: 12 }}>
                Google Business Profile link / Lien Profil d’entreprise Google
              </label>
              <input
                id="gmbUrl"
                ref={gmbRef}
                type="url"
                placeholder="https://g.page/your-clinic"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = THEME.inputFocus)}
                onBlur={(e) => (e.currentTarget.style.borderColor = THEME.inputBorder)}
              />
              <div style={{ ...small, marginTop: 6 }}>
                Optional but recommended / Facultatif mais recommandé.
              </div>
            </div>

            {/* Services & Hours */}
            <div style={{ marginTop: 16 }}>
              <label htmlFor="servicesHours" style={{ color: THEME.body, fontSize: 12 }}>
                Services & Hours / Services et heures
              </label>
              <textarea
                id="servicesHours"
                ref={servicesRef}
                rows={5}
                placeholder={`Example:\nTeeth cleaning — Mon–Fri 9am–5pm\nDental implants — Tue/Thu 10am–6pm\n\nExemple:\nNettoyage — Lun–Ven 9h–17h\nImplants — Mar/Jeu 10h–18h`}
                style={{
                  ...inputStyle,
                  fontSize: 15,
                  resize: "vertical",
                  lineHeight: 1.4,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = THEME.inputFocus)}
                onBlur={(e) => (e.currentTarget.style.borderColor = THEME.inputBorder)}
              />
              <div style={{ ...small, marginTop: 6 }}>
                Add services and opening hours so your AI can answer patients. /
                Ajoutez vos services et horaires pour que l’IA puisse répondre aux patients.
              </div>
            </div>

            {/* Consents */}
            <div style={{ marginTop: 16, color: THEME.body, fontSize: 12 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <input ref={termsRef} type="checkbox" aria-required="true" style={{ marginTop: 2 }} />
                <span>
                  I agree to the{" "}
                  <a href="/terms" style={{ color: "#fff", textDecoration: "underline" }}>
                    Terms
                  </a>{" "}
                  &{" "}
                  <a href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>
                    Privacy
                  </a>
                  . (Required)
                  <br />
                  J’accepte les{" "}
                  <a href="/terms" style={{ color: "#fff", textDecoration: "underline" }}>
                    Conditions
                  </a>{" "}
                  et la{" "}
                  <a href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}>
                    Politique
                  </a>
                  . (Obligatoire)
                </span>
              </label>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 8 }}>
                <input ref={caslRef} type="checkbox" style={{ marginTop: 2 }} />
                <span>
                  I agree to receive marketing communications (CASL). (Optional)
                  <br />
                  J’accepte de recevoir des communications marketing (LCAP). (Optionnel)
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 18,
                width: "100%",
                borderRadius: 14,
                padding: "12px 16px",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                background: THEME.btnBg,
                border: `1px solid ${THEME.btnBorder}`,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "transform 120ms ease, background 120ms ease, box-shadow 120ms ease",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = THEME.btnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = THEME.btnBg)}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {loading ? "Saving…" : "Save & continue"}
            </button>

            {/* Status */}
            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: 12,
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

            {/* Footer microcopy */}
            <div style={{ marginTop: 12, fontSize: 11, color: `${THEME.body}B3`, textAlign: "center" }}>
              Québec Law 25 • PIPEDA • CASL • Data residency: ca-central-1.
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
