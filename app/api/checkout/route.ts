import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Missing STRIPE_SECRET_KEY");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-12-15.clover",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Voicemail Greeting",
          },
          unit_amount: 500,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create?paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return NextResponse.json({ url: session.url });
}
