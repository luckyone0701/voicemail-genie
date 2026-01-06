import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, tone = "professional", voice = "female" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    // STEP 1: Rewrite text in selected tone (TEXT ONLY)
    const rewrite = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You rewrite voicemail greetings. Return ONLY the rewritten voicemail text. Do not include explanations, labels, or instructions.",
        },
        {
          role: "user",
          content: `Rewrite the following voicemail greeting in a "${tone}" tone:\n\n${text}`,
        },
      ],
      temperature: 0.9,
    });

    const rewrittenText =
      rewrite.choices[0]?.message?.content?.trim() || text;

    // STEP 2: Convert rewritten text to speech
    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: rewrittenText,
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
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
