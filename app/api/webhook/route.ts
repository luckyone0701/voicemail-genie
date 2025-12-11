import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
  });

  const signature = req.headers.get("stripe-signature")!;
  const body = Buffer.from(await req.arrayBuffer());

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💰 Payment Complete:", session.id);

    // TODO:
    // - Mark greeting as paid
    // - Unlock premium features
    // - Save payment record in DB
  }

  return NextResponse.json({ received: true });
}
