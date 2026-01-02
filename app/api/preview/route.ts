import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ---- CONFIG ----
const MAX_PREVIEW_CHARS = 450; // ~30 sec
const FREE_TONES = ["neutral", "professional"];
const PREMIUM_TONES = ["funny", "dramatic", "serious", "ghost", "robot"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice = "alloy", tone = "neutral" } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // ---- Enforce preview limits ----
    const previewText = text.slice(0, MAX_PREVIEW_CHARS);

    // ---- Enforce tone paywall ----
    const hasPaid = false; // preview endpoint is always unpaid

    if (!hasPaid && PREMIUM_TONES.includes(tone)) {
      return NextResponse.json(
        {
          error: "This tone requires payment",
          requiresUpgrade: true,
        },
        { status: 402 }
      );
    }

    // ---- Build style prompt ----
    const stylePrompt = {
      neutral: "Speak clearly and naturally.",
      professional: "Sound professional, confident, and polished.",
      funny: "Sound playful, upbeat, and humorous.",
      dramatic: "Sound dramatic and expressive.",
      serious: "Sound calm, serious, and authoritative.",
      ghost: "Sound eerie, whispery, and mysterious.",
      robot: "Sound robotic, monotone, and synthetic.",
    }[tone] ?? "Speak clearly and naturally.";

    // ---- Generate audio ----
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: `${stylePrompt}\n\n${previewText}`,
      format: "mp3",
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("Preview generation error:", err);

    return NextResponse.json(
      {
        error: "Preview generation failed",
        details: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
