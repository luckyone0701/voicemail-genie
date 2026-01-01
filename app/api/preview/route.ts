import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || text.length < 5) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const fullText = text;
  const previewText = text.slice(0, 300);

  // FULL AUDIO (LOCKED)
  const full = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    input: fullText,
  });

  const fullBuffer = Buffer.from(await full.arrayBuffer());
  const audioDir = path.join(process.cwd(), "private_audio");
  fs.mkdirSync(audioDir, { recursive: true });
  fs.writeFileSync(path.join(audioDir, `${id}.mp3`), fullBuffer);

  // PREVIEW AUDIO
  const isPremium =
  PREMIUM_TONES.includes(tone) || PREMIUM_VOICES.includes(voice);

if (isPremium && !userHasUpsell) {
  return NextResponse.json(
    { error: "Premium upgrade required" },
    { status: 402 }
  );
}

  const previewBuffer = Buffer.from(await preview.arrayBuffer());

  return NextResponse.json({
    previewId: id,
    previewAudio: `data:audio/mp3;base64,${previewBuffer.toString("base64")}`,
  });
}
