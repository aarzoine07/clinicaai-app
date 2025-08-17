// pages/api/magic-link.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept ONLY POST to match your frontend
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Expect { email }
    const { email } = req.body ?? {};
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Missing or invalid email" });
    }

    // Placeholder behavior: pretend we sent a magic link
    // (You can replace this with your real Supabase call later.)
    console.log("Magic-link request for:", email);

    return res.status(200).json({ message: "Magic link sent!" });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error" });
  }
}
