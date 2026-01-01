import Stripe from "stripe";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const previewId = session.metadata?.previewId;

    if (previewId) {
      const unlockDir = path.join(process.cwd(), "paid");
      fs.mkdirSync(unlockDir, { recursive: true });
      fs.writeFileSync(path.join(unlockDir, `${previewId}.paid`), "true");
    }
  }

  return NextResponse.json({ received: true });
}
