import { NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import OpenAI from "openai";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function getRawBody(req: Request): Promise<Buffer> {
  const arrayBuffer = await req.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature failed", err.message);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // ✅ Payment succeeded
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const notes = session.metadata?.notes;
    const tone = session.metadata?.tone;
    const voice = session.metadata?.voice ?? "female";

    if (!notes || !tone) {
      console.warn("Missing metadata on session", session.id);
      return NextResponse.json({ received: true });
    }

    /**
     * Generate FULL voicemail (no 15s limit)
     */
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You generate voicemail greetings.

RULES:
- Use ONLY the user's content
- Do NOT invent names or businesses
- Natural, professional speech
- Up to 60 seconds allowed
Tone: ${tone}
          `,
        },
        { role: "user", content: notes },
      ],
    });

    const script = chat.choices[0]?.message?.content ?? notes;

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "verse" : "alloy",
      input: script,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    const fileName = `full-${crypto.randomUUID()}.mp3`;
    const outputDir = path.join(process.cwd(), "public", "downloads");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, fileName), buffer);

    console.log("✅ Full voicemail generated:", fileName);
  }

  return NextResponse.json({ received: true });
}
