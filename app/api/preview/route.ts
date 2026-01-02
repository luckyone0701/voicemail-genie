import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* ------------------ TONE DEFINITIONS ------------------ */

const STYLE_PROMPTS = {
  neutral: "Speak clearly and naturally.",
  professional: "Sound professional, confident, and polished.",
  funny: "Sound playful, upbeat, and humorous.",
  dramatic: "Use dramatic pacing and emotional emphasis.",
  serious: "Sound calm, serious, and authoritative.",
  ghost: "Sound spooky, whispery, and mysterious.",
  robot: "Sound robotic, synthetic, and mechanical.",
} as const;

type ToneId = keyof typeof STYLE_PROMPTS;

const PREMIUM_TONES: ToneId[] = ["ghost", "robot"];

/* ------------------ ROUTE ------------------ */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const text: string = body.text ?? "";
    const toneRaw: string = body.tone ?? "neutral";
    const voice: string = body.voice ?? "alloy";

    // ✅ Validate tone safely
    const tone: ToneId =
      toneRaw in STYLE_PROMPTS ? (toneRaw as ToneId) : "neutral";

    const isPremium = PREMIUM_TONES.includes(tone);

    // Optional: lock premium preview later
    // if (isPremium && !userHasPaid) { ... }

    const stylePrompt = STYLE_PROMPTS[tone];

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: `${stylePrompt}\n\n${text}`,
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("PREVIEW ERROR:", err);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
