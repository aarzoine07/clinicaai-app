// pages/signup.tsx (Pages Router)
// Restyled to visually match the Onboarding v2 wizard (dark gradient + glass card + pill buttons)
// - Keeps your existing magic-link logic and redirects
// - No external UI libs; Tailwind-only classes

import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type ApiOk = { message?: string };
type ApiErr = { error?: string };

const SignupPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err"; msg: string }>({ kind: "idle", msg: "" });
  const [logoHidden, setLogoHidden] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);
  const caslRef = useRef<HTMLInputElement | null>(null);

  // Prefill from ?email=
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const qp = sp.get("email");
      if (qp) setEmail(qp);
    } catch {}
  }, []);

  const tryNavigateAfterSuccess = async (): Promise<boolean> => {
    const target = process.env.NEXT_PUBLIC_REDIRECT_AFTER_SIGNUP;
    if (target) {
      window.location.assign(target);
      return true;
    }
    try {
      const res = await fetch("/check-email", { method: "HEAD" });
      if (res.ok) {
        window.location.assign("/check-email");
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
    if (!termsRef.current?.checked) {
      setStatus({ kind: "err", msg: "Please accept the Terms & Privacy to continue. / Veuillez accepter les Conditions et la Politique pour continuer." });
      termsRef.current?.focus();
      return;
    }

    setLoading(true);
    setStatus({ kind: "idle", msg: "" });

    // POST /api/magic-link { email }
    let res: Response;
    try {
      res = await fetch("/api/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, casl: !!caslRef.current?.checked }),
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
      const navigated = await tryNavigateAfterSuccess();
      setLoading(false);
      if (!navigated) {
        setStatus({ kind: "ok", msg: ok?.message ?? "Magic link sent. Check your inbox. / Lien magique envoyé. Vérifiez votre boîte de réception." });
      }
      return;
    }

    // Fallback
    let fallback = "Unexpected error. Please try again. / Erreur inattendue. Réessayez.";
    try {
      const j = (await res.json()) as ApiErr;
      if (j?.error) fallback = j.error;
    } catch {
      try { const txt = await res.text(); if (txt) fallback = txt; } catch {}
    }
    setLoading(false);
    setStatus({ kind: "err", msg: fallback });
  };

  const canSubmit = !loading && !!email.trim();

  return (
    <main className={inter.className}>
      <Head>
        <title>Sign up • ClinicaAI</title>
        <meta name="description" content="Create your ClinicaAI account and get a one-time magic link. No password required." />
        <style>{`html,body,#__next{height:100%}body{margin:0;color-scheme:dark}`}</style>
      </Head>

      {/* Background + gradient auras (match onboarding v2) */}
      <div className="relative min-h-screen w-full overflow-hidden bg-[#0b1220] text-neutral-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_700px_at_20%_10%,rgba(72,134,255,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_550px_at_80%_90%,rgba(54,211,153,0.12),transparent_60%)]" />

        <div className="relative grid min-h-screen place-items-center px-5 py-12">
          <section className="w-full max-w-[520px] rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
            {/* Logo (optional) */}
            {!logoHidden && (
              <div className="mb-3 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="ClinicaAI logo" width={56} height={56} className="h-14 w-14 rounded-xl" onError={() => setLogoHidden(true)} />
              </div>
            )}

            {/* Headline */}
            <h1 className="m-0 text-center text-2xl font-extrabold leading-tight tracking-tight text-white">
              Create your
              <br />
              ClinicaAI account
            </h1>
            <span className="sr-only">Créer votre compte ClinicaAI</span>

            {/* Subcopy */}
            <p className="mt-2 text-center text-sm text-white/80">Enter your email to receive a one-time magic link. No password required.</p>
            <p className="mt-1 text-center text-[12px] text-white/70">Entrez votre courriel pour recevoir un lien magique à usage unique. Aucun mot de passe requis.</p>

            {/* Form */}
            <form onSubmit={onSubmit} noValidate aria-describedby="signup-help" className="mt-4">
              <label htmlFor="email" className="text-xs text-white/90">Email address / Adresse courriel</label>
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/50 outline-none focus:border-white/20"
              />
              <div id="signup-help" className="mt-2 text-xs text-white/60">Use your clinic/work email if possible. / Idéalement, utilisez le courriel de la clinique.</div>

              {/* Consents */}
              <div className="mt-3 space-y-2 text-xs text-white/80">
                <label className="flex items-start gap-2">
                  <input ref={termsRef} type="checkbox" className="mt-0.5" aria-required="true" />
                  <span>
                    I agree to the <a href="/terms" className="underline">Terms</a> & <a href="/privacy" className="underline">Privacy</a>. (Required)
                    <br />J’accepte les <a href="/terms" className="underline">Conditions</a> et la <a href="/privacy" className="underline">Politique</a>. (Obligatoire)
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input ref={caslRef} type="checkbox" className="mt-0.5" />
                  <span>
                    I agree to receive marketing communications (CASL). (Optional)
                    <br />J’accepte de recevoir des communications marketing (LCAP). (Optionnel)
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!(!loading && !!email.trim())}
                className="mt-4 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send magic link"}
              </button>
              <div className="sr-only">{loading ? "Envoi en cours…" : "Envoyer le lien magique"}</div>

              {/* Status */}
              <div id="signup-status" role="status" aria-live="polite" className="mt-3 min-h-[20px] text-center text-[13px]">
                {status.kind === "ok" ? (
                  <span className="text-emerald-400">{status.msg}</span>
                ) : status.kind === "err" ? (
                  <span className="text-rose-400">{status.msg}</span>
                ) : (
                  <span className="text-white/70">{status.msg}</span>
                )}
              </div>

              {/* Footer links */}
              <div className="mt-4 text-center text-[12px]"><a href="/" className="underline text-white/80">Back to home →</a></div>

              {/* Compliance */}
              <div className="mt-3 text-center text-[11px] text-white/60">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                QC Law 25 / PIPEDA / CASL. Data residency: ca-central-1.
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
