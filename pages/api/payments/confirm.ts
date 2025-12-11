// pages/api/payments/confirm.ts
import type { NextApiRequest, NextApiResponse } from "next";

// In a real app this should be a DB flag
let paidUsers = new Set<string>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  paidUsers.add(userId);

  return res.status(200).json({ success: true });
}
