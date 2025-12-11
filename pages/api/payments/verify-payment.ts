import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentId } = req.body;

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "paid" }
  });

  res.json({ success: true, payment: updated });
}
