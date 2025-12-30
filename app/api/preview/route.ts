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
    const { notes, tone, voice } = await req.json();

    if (!notes || !tone || !voice) {
      return NextResponse.json(
        { error: "Missing notes, tone, or voice" },
        { status: 400 }
      );
    }

    /**
     * 1️⃣ Generate rewritten voicemail script (TEXT ONLY)
     * - Uses ONLY user input
     * - Max 15 seconds (~35 words)
     */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You rewrite voicemail greetings.

STRICT RULES:
- Use ONLY the user's text
- Do NOT invent names, businesses, or details
- Rewrite for clarity and natural speech
- Tone: ${tone}
- MAXIMUM 35 WORDS
- 15 SECONDS OR LESS
          `.trim(),
        },
        {
          role: "user",
          content: notes,
        },
      ],
      temperature: 0.6,
    });

    let script = completion.choices[0]?.message?.content ?? "";
    script = limitWords(script, 35);

    /**
     * 2️⃣ Generate TTS preview audio
     */
    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: VOICE_MAP[voice] ?? "alloy",
      input: script,
    });

    /**
     * 3️⃣ Save preview audio to /public/previews
     */
    const buffer = Buffer.from(await audio.arrayBuffer());
    const fileName = `preview-${crypto.randomUUID()}.mp3`;
    const outputDir = path.join(process.cwd(), "public", "previews");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(path.join(outputDir, fileName), buffer);

    return NextResponse.json({
      audioUrl: `/previews/${fileName}`,
      script,
    });
  } catch (err) {
    console.error("Preview generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
