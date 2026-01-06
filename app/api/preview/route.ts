import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { text, tone, voice } = await req.json();

    if (!text) {
      return new NextResponse("Missing text", { status: 400 });
    }

    /* -------------------------------
       STEP 1: Generate the SCRIPT ONLY
    -------------------------------- */
    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You write voicemail greeting scripts.
Apply the requested tone.
Return ONLY the final script.
DO NOT include explanations, rules, or labels.
`,
        },
        {
          role: "user",
          content: `Tone: ${tone}\nVoicemail content:\n${text}`,
        },
      ],
      temperature: 0.9,
    });

    const script =
      scriptResponse.choices[0]?.message?.content?.trim();

    if (!script) {
      return new NextResponse("Failed to generate script", { status: 500 });
    }

    /* -------------------------------
       STEP 2: Convert SCRIPT → AUDIO
    -------------------------------- */
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "verse" : "nova",
      input: script, // 🚨 ONLY the script goes here
    });

    const audioBuffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Preview error:", err);
    return new NextResponse("Preview generation failed", { status: 500 });
  }
}
