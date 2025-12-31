import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, tone } = await req.json();

    if (!text || text.length < 3) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    /* 1️⃣ Generate AI voicemail script */
    const scriptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write concise, professional voicemail greetings. Keep under 40 words.",
        },
        {
          role: "user",
          content: `Tone: ${tone}\nUser idea: ${text}`,
        },
      ],
    });

    const script =
      scriptResponse.choices[0]?.message?.content ??
      "Sorry, we missed your call.";

    /* 2️⃣ Convert script → speech */
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: script,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      script,
      audio: `data:audio/mpeg;base64,${base64}`,
    });
  } catch (err) {
    console.error("Preview error:", err);
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
