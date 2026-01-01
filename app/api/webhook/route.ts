import { NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ✅ Handle successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // 🔑 THIS IS THE FIX
    const previewId = session.metadata?.previewId;

    if (!previewId) {
      console.warn("No previewId in session metadata");
      return NextResponse.json({ received: true });
    }

    // 🔓 Mark preview as paid
    const paidDir = path.join(process.cwd(), "paid");
    if (!fs.existsSync(paidDir)) {
      fs.mkdirSync(paidDir);
    }

    fs.writeFileSync(
      path.join(paidDir, `${previewId}.premium`),
      "true"
    );
  }

  return NextResponse.json({ received: true });
}
