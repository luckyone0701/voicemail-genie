import Stripe from "stripe";
import { headers } from "next/headers";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }
}
