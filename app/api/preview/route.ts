import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text: string = body.text;
    const tone: string = body.tone || "neutral";
    const voice: "male" | "female" = body.voice || "female";

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const TONE_PROMPTS: Record<string, string> = {
      neutral: "Speak clearly and naturally.",
      professional: "Sound professional, confident, and polished.",
      friendly: "Sound warm, friendly, and welcoming.",
      funny: "Sound playful, upbeat, and humorous.",
      serious: "Sound calm, serious, and authoritative.",
      ghost: "Sound spooky, slow, and mysterious like a ghost.",
      robot: "Sound robotic, mechanical, and synthetic.",
    };

    const style = TONE_PROMPTS[tone] ?? TONE_PROMPTS.neutral;
    const prompt = `${style}\n\n${text}`;

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: prompt,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Preview TTS error:", err);
    return NextResponse.json(
      { error: "Preview failed" },
      { status: 500 }
    );
  }
}
