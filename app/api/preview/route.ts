import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text, tone = "neutral", voice = "female" } = await req.json();

    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400 }
      );
    }

    const TONE_PROMPTS: Record<string, string> = {
      neutral: "Speak clearly and naturally.",
      professional: "Sound professional, confident, and polished.",
      friendly: "Sound warm, friendly, and welcoming.",
      funny: "Sound playful, upbeat, and humorous.",
      serious: "Sound calm, serious, and authoritative.",
      ghost: "Sound spooky, slow, and mysterious like a ghost.",
      robot: "Sound robotic, mechanical, and synthetic.",
    };

    const style = TONE_PROMPTS[tone] ?? TONE_PROMPTS.neutral;

    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: `${style}\n\n${text}`,
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/webm",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Preview TTS error:", err);
    return new Response(
      JSON.stringify({ error: "Preview failed" }),
      { status: 500 }
    );
  }
}
