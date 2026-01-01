import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 🔒 Premium controls
const PREMIUM_TONES = ["radio", "cinematic", "dramatic", "ghost", "robot"];
const PREMIUM_VOICES = ["celebrity", "narrator_pro", "deep_radio"];

export async function POST(req: Request) {
  try {
    // ✅ ALWAYS destructure immediately
    const body = await req.json();
    const {
      text,
      tone = "normal",
      voice = "alloy",
      userHasUpsell = false,
    } = body;

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Text too short" },
        { status: 400 }
      );
    }

    // 🔒 Premium lock
    const isPremium =
      PREMIUM_TONES.includes(tone) || PREMIUM_VOICES.includes(voice);

    if (isPremium && !userHasUpsell) {
      return NextResponse.json(
        { error: "Upgrade required for this tone or voice" },
        { status: 402 }
      );
    }

    // 🎧 Preview limit (monetization safe)
    const previewText = text.slice(0, 300);

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: previewText,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64}`,
    });
  } catch (err) {
    console.error("Preview TTS error:", err);
    return NextResponse.json(
      { error: "Preview generation failed" },
      { status: 500 }
    );
  }
}
