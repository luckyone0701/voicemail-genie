import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json();

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: "Text too short" },
        { status: 400 }
      );
    }

    // Limit preview length (monetization safe)
    const previewText = text.slice(0, 300);

    // ✅ CORRECT OpenAI TTS call (SDK-compatible)
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "verse" : "alloy",
      input: previewText,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64}`,
    });
  } catch (err) {
    console.error("TTS PREVIEW ERROR:", err);
    return NextResponse.json(
      { error: "Preview failed" },
      { status: 500 }
    );
  }
}
