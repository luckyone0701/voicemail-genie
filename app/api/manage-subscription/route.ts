import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.APP_URL}/settings`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err: any) {
    console.error("Billing Portal Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
