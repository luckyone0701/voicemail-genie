import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const TONE_PROMPTS: Record<string, string> = {
  neutral: `
You are a neutral voicemail narrator.
Speak clearly, evenly, and naturally.
No exaggerated emotion.
`,

  professional: `
You are a professional business voicemail voice.
Speak confidently.
Moderate pace.
Clear articulation.
Friendly but formal tone.
`,

  friendly: `
You are a warm and friendly voicemail voice.
Smile while speaking.
Slightly upbeat rhythm.
Welcoming and personable.
`,

  funny: `
You are a playful, lighthearted voicemail voice.
Add subtle humor in delivery.
Vary pitch slightly.
Energetic and fun pacing.
`,

  serious: `
You are a serious and authoritative voicemail voice.
Lower pitch.
Slower pace.
Firm and calm delivery.
`,

  ghost: `
You are a spooky ghost voicemail voice.
Slow, airy delivery.
Slight pauses between phrases.
Soft and haunting tone.
`,

  robot: `
You are a robotic synthetic voice.
Flat intonation.
Even pacing.
Minimal emotion.
Mechanical delivery.
`,
};

export async function POST(req: Request) {
  try {
    const { text, tone = "neutral", voice = "female" } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const style = TONE_PROMPTS[tone] ?? TONE_PROMPTS.neutral;

    const speechInput = `
${style}

Read the following voicemail message exactly as written:

"${text}"
`;

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: speechInput,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    console.error("Preview TTS error:", err);
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
