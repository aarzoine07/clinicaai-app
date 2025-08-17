// pages/signup.tsx
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const SignupPage: NextPage = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // dummy for now — API call comes next step
  };

  return (
    <main className="min-h-screen w-full bg-[#0c1420]">
      <Head>
        <title>Sign up • ClinicaAI</title>
        <meta
          name="description"
          content="Create your ClinicaAI account and get a one-time magic link. No password required."
        />
      </Head>

      <div className="mx-auto w-full px-6 sm:px-8" style={{ maxWidth: 800 }}>
        <section className="pt-24 sm:pt-28 md:pt-32">
          {/* Headline EN */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            Create your
            <br />
            ClinicaAI account
          </h1>
          {/* Headline FR-CA (visually hidden for semantics) */}
          <h2 className="sr-only">Créer votre compte ClinicaAI</h2>

          {/* Subcopy EN */}
          <p className="mt-3 text-sm sm:text-base text-[#c9d1d9] max-w-prose">
            Enter your email to receive a one-time magic link. No password required.
          </p>
          {/* Subcopy FR-CA */}
          <p className="mt-1 text-xs sm:text-sm text-[#c9d1d9]/80 max-w-prose">
            Entrez votre courriel pour recevoir un lien magique à usage unique. Aucun mot de passe requis.
          </p>

          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-8 max-w-xl"
            aria-describedby="signup-help"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-[#c9d1d9]">
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
                className="w-full rounded-xl px-4 py-3 text-base outline-none transition-colors
                           bg-[#141e2c] text-white placeholder-[#9aa8b5] border border-[#283445]
                           focus:border-[#4c6fff] focus-visible:ring-2 focus-visible:ring-[#4c6fff]/60"
                aria-required="true"
              />

              <div id="signup-help" className="text-xs text-[#9aa8b5]">
                Use your clinic/work email if possible. / Idéalement, utilisez le courriel de la clinique.
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium
                           transition-colors text-white
                           bg-[#2a3342] border border-[#3a465a]
                           hover:bg-[#334056] focus-visible:ring-2 focus-visible:ring-[#4c6fff]/60"
              >
                Send magic link
              </button>
              <div className="sr-only">Envoyer le lien magique</div>
            </div>

            <div
              id="signup-status"
              role="status"
              aria-live="polite"
              className="mt-3 min-h-[1.25rem] text-sm text-[#c9d1d9]"
            />
            <div className="mt-10">
              <a
                href="/"
                className="text-xs underline-offset-4 hover:underline text-[#c9d1d9]"
              >
                Back to home →
              </a>
              <span className="sr-only">Retour à l’accueil</span>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default SignupPage;
