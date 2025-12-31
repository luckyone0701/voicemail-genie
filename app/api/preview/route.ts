import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const VOICE_MAP: Record<string, string> = {
  female: "alloy",
  male: "verse",
};

function limitWords(text: string, maxWords: number) {
  return text.trim().split(/\s+/).slice(0, maxWords).join(" ");
}

export async function POST(req: Request) {
  try {
    const { text, tone } = await req.json();

    if (!text || text.length < 5) {
      return NextResponse.json({ error: "Text too short" }, { status: 400 });
    }

    // ⛔ Limit preview length (important for monetization)
    const previewText = text.slice(0, 300);

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy", // later map tone → voice
      input: previewText,
      format: "mp3",
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const base64 = audioBuffer.toString("base64");

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64}`,
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}