import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { paymentId, screenshotBase64 } = await req.json();
    if (!paymentId) return NextResponse.json({ error: "paymentId required" }, { status: 400 });

    let screenshotPath = null;
    // optional: save screenshotBase64 to cloud or /public/uploads and set screenshotPath

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "pending_user_claimed",
        screenshot: screenshotPath,
        events: { create: { type: "user_claimed", raw: { screenshot: Boolean(screenshotBase64) } } },
      },
    });

    return NextResponse.json({ ok: true, payment });
  } catch (err) {
    console.error("verify payment error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
