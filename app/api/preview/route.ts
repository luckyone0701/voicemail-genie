import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const TONE_PREFIX: Record<string, string> = {
  professional: "Hello. Thank you for calling.",
  friendly: "Hey there! Thanks so much for calling.",
  funny: "Hey! You found my voicemail — nice work!",
  serious: "You have reached my voicemail.",
  ghost: "You have reached… the other side…",
  robot: "Greetings. You have reached the voicemail system.",
};

export async function POST(req: Request) {
  try {
    const { text, tone, voice } = await req.json();

    const prefix = TONE_PREFIX[tone] ?? TONE_PREFIX.professional;
    const script = `${prefix} ${text}`;

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: script,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
