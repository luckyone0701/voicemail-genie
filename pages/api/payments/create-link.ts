import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, audioUrl } = req.body;

  const payment = await prisma.payment.create({
    data: {
      amount,
      audioUrl,
      status: "pending",
    },
  });

  const cashTag = process.env.CASH_APP_TAG; // example: $VoicemailGenie
  const link = `https://cash.app/${cashTag}/${amount}?note=${payment.id}`;

  res.json({ link, paymentId: payment.id });
}
