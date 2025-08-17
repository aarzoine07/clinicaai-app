// pages/onboard.tsx
import Head from "next/head";
import { useRef, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const THEME = {
  bg: "#0c1420",
  glowBlue: "rgba(72, 134, 255, 0.18)",
  glowGreen: "rgba(54, 211, 153, 0.12)",
  cardBg: "rgba(20, 30, 44, 0.85)",
  cardBorder: "rgba(40, 52, 69, 0.8)",
  heading: "#ffffff",
  body: "#c9d1d9",
  placeholder: "#9aa8b5",
  inputBg: "#141e2c",
  inputBorder: "#283445",
  inputFocus: "#4c6fff",
  btnBg: "linear-gradient(180deg, #2f3a4d 0%, #222b39 100%)",
  btnHover: "linear-gradient(180deg, #39465a 0%, #273245 100%)",
  btnBorder: "#3a465a",
  success: "#36d399",
  error: "#f87171",
  maxWidth: 840,
};

type Payload = {
  clinicName: string;
  websiteUrl?: string;
  googleBusinessUrl?: string;
  servicesAndHours?: string;
  languages: string[]; // ["EN","FR-CA"]
  routing: "forward-main" | "overflow-only";
  preferredAreaCode?: string;
  bookingSystem: "google" | "calcom" | "other";
  consentPhrases?: string;
  privacyOfficer: { name?: string; email?: string; phone?: string };
  acceptedTerms: boolean;
  caslOptIn: boolean;
};

export default function Onboard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err"; msg: string }>({
    kind: "idle",
    msg: "",
  });

  const clinicNameRef = useRef<HTMLInputElement | null>(null);
  const websiteRef = useRef<HTMLInputElement | null>(null);
  const gmbRef = useRef<HTMLInputElement | null>(null);
  const servicesRef = useRef<HTMLTextAreaElement | null>(null);
  const langENRef = useRef<HTMLInputElement | null>(null);
  const langFRRef = useRef<HTMLInputElement | null>(null);
  const routingMainRef = useRef<HTMLInputElement | null>(null);
  const routingOverflowRef = useRef<HTMLInputElement | null>(null);
  const areaCodeRef = useRef<HTMLInputElement | null>(null);
  const bookingRef = useRef<HTMLSelectElement | null>(null);
  const consentPhrasesRef = useRef<HTMLTextAreaElement | null>(null);
  const poNameRef = useRef<HTMLInputElement | null>(null);
  const poEmailRef = useRef<HTMLInputElement | null>(null);
  const poPhoneRef = useRef<HTMLInputElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);
  const caslRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "idle", msg: "" });

    const clinicName = clinicNameRef.current?.value.trim() ?? "";
    if (!clinicName) {
      setStatus({ kind: "err", msg: "Clinic name is required. / Le nom de la clinique est requis." });
      clinicNameRef.current?.focus();
      return;
    }
    if (!termsRef.current?.checked) {
      setStatus({
        kind: "err",
        msg: "You must accept Terms & Privacy. / Vous devez accepter les Conditions et la Politique.",
      });
      termsRef.current?.focus();
      return;
    }

    const payload: Payload = {
      clinicName,
      websiteUrl: websiteRef.current?.value.trim() || undefined,
      googleBusinessUrl: gmbRef.current?.value.trim() || undefined,
      servicesAndHours: servicesRef.current?.value.trim() || undefined,
      languages: [
        ...(langENRef.current?.checked ? ["EN"] : []),
        ...(langFRRef.current?.checked ? ["FR-CA"] : []),
      ],
      routing: routingMainRef.current?.checked ? "forward-main" : "overflow-only",
      preferredAreaCode: areaCodeRef.current?.value.trim() || undefined,
      bookingSystem:
        (bookingRef.current?.value as Payload["bookingSystem"]) ?? "other",
      consentPhrases: consentPhrasesRef.current?.value.trim() || undefined,
      privacyOfficer: {
        name: poNameRef.current?.value.trim() || undefined,
        email: poEmailRef.current?.value.trim() || undefined,
        phone: poPhoneRef.current?.value.trim() || undefined,
      },
      acceptedTerms: !!termsRef.current?.checked,
      caslOptIn: !!caslRef.current?.checked,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/voice-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 405) {
        setStatus({ kind: "err", msg: "Method not allowed. / Méthode non autorisée." });
      } else if (!res.ok) {
        let message = "Unexpected error. / Erreur inattendue.";
        try {
          const j = await res.json();
          if (typeof j.error === "string") message = j.error;
        } catch {}
        setStatus({ kind: "err", msg: message });
      } else {
        setStatus({
          kind: "ok",
          msg: "Details received. We’ll start provisioning. / Détails reçus. Nous commençons l’approvisionnement.",
        });
      }
    } catch {
      setStatus({ kind: "err", msg: "Network error. / Erreur réseau." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={inter.className} style={{ minHeight: "100vh", width: "100%", background: THEME.bg }}>
      <Head>
        <title>Onboard • ClinicaAI</title>
        <meta name="description" content="Tell us about your clinic to set up ClinicaAI." />
      </Head>

      {/* Subtle background glows */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            `radial-gradient(1000px 600px at 15% 15%, ${THEME.glowBlue}, transparent 60%),` +
            `radial-gradient(800px 500px at 85% 85%, ${THEME.glowGreen}, transparent 60%)`,
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
            borderRadius: 16,
            padding: "28px 24px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <img src="/logo.png" alt="ClinicaAI logo" width={40} height={40} style={{ borderRadius: 8 }} />
            <div>
              <h1 style={{ margin: 0, color: THEME.heading, fontSize: 22, lineHeight: 1.2, fontWeight: 700 }}>
                ClinicaAI Onboarding
              </h1>
              <p style={{ margin: 0, color: THEME.body, fontSize: 13 }}>
                Tell us about your clinic (EN) • Parlez-nous de votre clinique (FR-CA)
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            {/* Clinic basics */}
            <fieldset style={{ border: 0, padding: 0, marginTop: 12 }}>
              <legend style={{ color: THEME.heading, fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Clinic basics / Infos de base
              </legend>

              <label style={{ display: "block", color: THEME.body, fontSize: 12, marginTop: 8 }}>
                Clinic name / Nom de la clinique
                <input
                  ref={clinicNameRef}
                  required
                  placeholder="e.g., Centre Dentaire Laval"
                  style={inputStyle()}
                />
              </label>

              <label style={{ display: "block", color: THEME.body, fontSize: 12, marginTop: 8 }}>
                Website URL / Site web
                <input
                  ref={websiteRef}
                  type="url"
                  placeholder="https://example.com"
                  style={inputStyle()}
                />
              </label>

              <label style={{ display: "block", color: THEME.body, fontSize: 12, marginTop: 8 }}>
                Google Business Profile link / Lien Fiche d’établissement Google
                <input
                  ref={gmbRef}
                  type="url"
                  placeholder="https://maps.google.com/..."
                  style={inputStyle()}
                />
              </label>
            </fieldset>

            {/* Services & hours */}
            <fieldset style={{ border: 0, padding: 0, marginTop: 16 }}>
              <legend style={{ color: THEME.heading, fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Services & Hours / Services et heures
              </legend>

              <label style={{ display: "block", color: THEME.body, fontSize: 12 }}>
                Free-text (services, business hours) / Texte libre (services, heures)
                <textarea
                  ref={servicesRef}
                  rows={4}
                  placeholder="Cleaning, fillings, implants... Mon-Fri 9–5"
                  style={textareaStyle()}
                />
              </label>
            </fieldset>

            {/* Language & routing */}
            <fieldset style={{ border: 0, padding: 0, marginTop: 16 }}>
              <legend style={{ color: THEME.heading, fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Language & Routing / Langue et routage
              </legend>

              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                <label style={checkLabel()}>
                  <input ref={langENRef} type="checkbox" defaultChecked /> English (EN)
                </label>
                <label style={checkLabel()}>
                  <input ref={langFRRef} type="checkbox" defaultChecked /> Français (FR-CA)
                </label>
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={radioLabel()}>
                  <input ref={routingMainRef} type="radio" name="routing" defaultChecked /> Forward main line
                </label>
                <label style={radioLabel()}>
                  <input ref={routingOverflowRef} type="radio" name="routing" /> Overflow only
                </label>
              </div>

              <label style={{ display: "block", color: THEME.body, fontSize: 12, marginTop: 8 }}>
                Preferred area code (optional) / Indicatif régional préféré (optionnel)
                <input
                  ref={areaCodeRef}
                  placeholder="e.g., 438 or 514"
                  style={inputStyle()}
                />
              </label>
            </fieldset>

            {/* Booking & consents */}
            <fieldset style={{ border: 0, padding: 0, marginTop: 16 }}>
              <legend style={{ color: THEME.heading, fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Booking & Consents / Rendez-vous et consentements
              </legend>

              <label style={{ display: "block", color: THEME.body, fontSize: 12 }}>
                Booking system / Système de réservation
                <select ref={bookingRef} defaultValue="calcom" style={selectStyle()}>
                  <option value="google">Google Calendar</option>
                  <option value="calcom">Cal.com</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label style={{ display: "block", color: THEME.body, fontSize: 12, marginTop: 8 }}>
                Consent phrases (SMS/email confirmations) / Phrases de consentement (SMS/courriel)
                <textarea
                  ref={consentPhrasesRef}
                  rows={3}
                  placeholder='Ex: "I agree to receive appointment confirmations by SMS/email."'
                  style={textareaStyle()}
                />
              </label>
            </fieldset>

            {/* Privacy Officer */}
            <fieldset style={{ border: 0, padding: 0, marginTop: 16 }}>
              <legend style={{ color: THEME.heading, fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Privacy Officer / Responsable de la protection des renseignements personnels
              </legend>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr", maxWidth: 680 }}>
                <label style={{ color: THEME.body, fontSize: 12 }}>
                  Name / Nom
                  <input ref={poNameRef} placeholder="Full name" style={inputStyle()} />
                </label>
                <label style={{ color: THEME.body, fontSize: 12 }}>
                  Email
                  <input ref={poEmailRef} type="email" placeholder="privacy@clinic.com" style={inputStyle()} />
                </label>
                <label style={{ color: THEME.body, fontSize: 12 }}>
                  Phone / Téléphone
                  <input ref={poPhoneRef} placeholder="+1 514 ..." style={inputStyle()} />
                </label>
              </div>
            </fieldset>

            {/* Legal */}
            <div style={{ marginTop: 16, color: THEME.body, fontSize: 12 }}>
              <label style={checkLabel()}>
                <input ref={termsRef} type="checkbox" /> I agree to the Terms & Privacy. (Required)
                <br />
                J’accepte les Conditions et la Politique de confidentialité. (Obligatoire)
              </label>
              <label style={checkLabel()}>
                <input ref={caslRef} type="checkbox" /> I agree to receive marketing communications (CASL). (Optional)
                <br />
                J’accepte de recevoir des communications marketing (LCAP). (Optionnel)
              </label>

              <p style={{ marginTop: 10, color: `${THEME.body}B3` }}>
                reCAPTCHA disclosure: This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              </p>
              <p style={{ marginTop: 4, color: `${THEME.body}B3` }}>
                Data residency: Calls and logs stored in ca-central-1. (QC Law 25 / PIPEDA / CASL)
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 16,
                width: "100%",
                borderRadius: 12,
                padding: "12px 16px",
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
                background: THEME.btnBg,
                border: `1px solid ${THEME.btnBorder}`,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "transform 120ms ease, background 120ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = THEME.btnHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = THEME.btnBg)}
              onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {loading ? "Submitting…" : "Submit details"}
            </button>

            {/* Status */}
            <div
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

            {/* Back link */}
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <a
                href="/"
                style={{ color: THEME.body, fontSize: 12, textDecoration: "underline", textUnderlineOffset: 4 }}
              >
                Back to home →
              </a>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

/* ---------- tiny style helpers ---------- */
function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    marginTop: 6,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 15,
    outline: "none",
    background: THEME.inputBg,
    color: THEME.heading,
    border: `1px solid ${THEME.inputBorder}`,
  };
}
function textareaStyle(): React.CSSProperties {
  return {
    ...inputStyle(),
    resize: "vertical",
  };
}
function selectStyle(): React.CSSProperties {
  return {
    ...inputStyle(),
    appearance: "none",
  };
}
function checkLabel(): React.CSSProperties {
  return { display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 };
}
function radioLabel(): React.CSSProperties {
  return { display: "inline-flex", alignItems: "center", gap: 8, marginRight: 16, marginTop: 8 };
}
