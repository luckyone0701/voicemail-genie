// pages/api/payments/check.ts
import type { NextApiRequest, NextApiResponse } from "next";

let paidUsers = new Set<string>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  const isPaid = paidUsers.has(String(userId));
  return res.status(200).json({ paid: isPaid });
}
