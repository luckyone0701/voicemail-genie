import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY");
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { text } = await req.json();

  const speech = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: text.slice(0, 300),
  });

  const buffer = Buffer.from(await speech.arrayBuffer());
  const base64 = buffer.toString("base64");

  return NextResponse.json({
    audio: `data:audio/mp3;base64,${base64}`,
  });
}
