import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_BASE_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/create?paid=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/create`,
    metadata: { type: "base", previewId: "default" },
  });

  return NextResponse.json({ url: session.url });
}
