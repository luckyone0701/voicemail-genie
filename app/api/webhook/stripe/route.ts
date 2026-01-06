import { NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const previewId = session.metadata?.previewId;
    const productType = session.metadata?.type;

    if (previewId && productType) {
      const dir = path.join(process.cwd(), "entitlements");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      fs.writeFileSync(
        path.join(dir, `${previewId}.${productType}`),
        "true"
      );
    }
  }

  return NextResponse.json({ received: true });
}
