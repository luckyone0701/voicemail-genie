import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const PREMIUM_TONES = ["ghost", "robot"];
const PREMIUM_VOICES = ["male"];

function hasEntitlement(type: "base" | "voicepack") {
  const file = path.join(process.cwd(), "entitlements", `default.${type}`);
  return fs.existsSync(file);
}

export async function POST(req: Request) {
  const { text, tone, voice } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const hasBase = hasEntitlement("base");
  const hasVoicePack = hasEntitlement("voicepack");

  if (!hasBase && text.length > 300) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  if (
    (PREMIUM_TONES.includes(tone) || PREMIUM_VOICES.includes(voice)) &&
    !hasVoicePack
  ) {
    return NextResponse.json({ error: "Voice pack required" }, { status: 402 });
  }

  const STYLE: Record<string, string> = {
    professional: "Professional voicemail delivery.",
    friendly: "Warm, friendly voicemail delivery.",
    funny: "Playful, upbeat delivery.",
    serious: "Serious, authoritative tone.",
    ghost: "Spooky, slow, eerie delivery.",
    robot: "Robotic, synthetic delivery.",
  };

  const speech = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: voice === "male" ? "alloy" : "nova",
    input: `${STYLE[tone]}\n\n${text}`,
  });

  const buffer = Buffer.from(await speech.arrayBuffer());

  return new NextResponse(buffer, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
