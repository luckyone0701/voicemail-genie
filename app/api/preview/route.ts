import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Allowed tone keys
 */
type Tone =
  | "neutral"
  | "professional"
  | "friendly"
  | "funny"
  | "serious"
  | "ghost"
  | "robot";

/**
 * Tone → style prompt mapping (STRICTLY TYPED)
 */
const STYLE_PROMPTS: Record<Tone, string> = {
  neutral: "Speak clearly and naturally.",
  professional: "Sound professional, confident, and polished.",
  friendly: "Sound warm, friendly, and welcoming.",
  funny: "Sound playful, upbeat, and humorous.",
  serious: "Sound calm, serious, and composed.",
  ghost: "Sound spooky, whispery, and mysterious.",
  robot: "Sound robotic, synthetic, and mechanical.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const text: string = body.text;
    const tone: Tone = body.tone ?? "neutral";
    const voice: "male" | "female" = body.voice ?? "female";

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const stylePrompt = STYLE_PROMPTS[tone];

    const previewText =
      text.length > 220 ? text.slice(0, 220) + "…" : text;

    // ---- Generate audio via OpenAI ----
    const audioResponse = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: `${stylePrompt}\n\n${previewText}`,
      format: "mp3",
    });

    const buffer = Buffer.from(await audioResponse.arrayBuffer());

    const id = crypto.randomUUID();
    const previewsDir = path.join(process.cwd(), "public", "previews");

    fs.mkdirSync(previewsDir, { recursive: true });

    const filePath = path.join(previewsDir, `${id}.mp3`);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      id,
      audioUrl: `/previews/${id}.mp3`,
    });
  } catch (err) {
    console.error("Preview generation failed:", err);
    return NextResponse.json(
      { error: "Preview failed" },
      { status: 500 }
    );
  }
}
