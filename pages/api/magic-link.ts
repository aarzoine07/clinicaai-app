// pages/api/magic-link.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Use ANON key for signInWithOtp (service role not required here)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = (req.body ?? {}) as { email?: string };
  if (!email) return res.status(400).json({ error: "Email is required" });

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    `${(req.headers["x-forwarded-proto"] as string) || "https"}://${req.headers.host}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Where the user lands after clicking the magic link
      emailRedirectTo:
        process.env.NEXT_PUBLIC_EMAIL_REDIRECT_TO || `${site}/onboarding`,
    },
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ message: "Magic link sent!" });
}
