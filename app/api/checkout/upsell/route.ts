import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { previewId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 700,
          product_data: {
            name: "Premium Voices & Special Tones",
            description: "Unlock robot, ghost, announcer, and more",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      previewId,
      upsell: "premium_pack",
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/create?upsell=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/create`,
  });

  return NextResponse.json({ url: session.url });
}
