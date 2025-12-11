import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const CASH_TAG = process.env.CASH_APP_TAG || "$YourCashtag";

export async function POST(req: Request) {
  try {
    const { amount, userId, orderId, note } = await req.json();
    if (!amount) return NextResponse.json({ error: "amount required" }, { status: 400 });

    const id = crypto.randomUUID();
    const cents = Math.round(amount * 100);
    const sanitizedNote = note || orderId || id;
    const url = `https://cash.app/${CASH_TAG}/${amount}?note=${encodeURIComponent(sanitizedNote)}`;

    const payment = await prisma.payment.create({
      data: {
        id,
        userId: userId || null,
        orderId: orderId || null,
        amountCents: cents,
        cashTag: CASH_TAG,
        note: sanitizedNote,
        paymentUrl: url,
        status: "pending",
      },
    });

    return NextResponse.json({ id: payment.id, url: payment.paymentUrl });
  } catch (err) {
    console.error("generate-link error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
