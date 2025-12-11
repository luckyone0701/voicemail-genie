import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { customerId } = req.query;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId as string,
      return_url: `${req.headers.origin}/settings`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating portal:", error);
    res.status(400).json({ error: error.message });
  }
}
