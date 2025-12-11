import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { priceId, metadata } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: priceId.startsWith("price_") ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/canceled`,
      metadata,
    });

    return res.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err.message);
    return res.status(400).json({ error: "Checkout failed", message: err.message });
  }
}
