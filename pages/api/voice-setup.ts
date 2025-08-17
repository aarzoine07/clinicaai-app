// pages/api/voice-setup.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Log the payload to Vercel function logs (Runtime Logs tab)
    // In production you would validate & persist this.
    console.log("voice-setup payload:", req.body);

    return res.status(200).json({ message: "Voice setup received" });
  } catch (err: any) {
    return res.status(500).json({ error: "Server error" });
  }
}
