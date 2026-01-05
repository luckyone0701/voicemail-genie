import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional: "Write a professional voicemail greeting.",
  friendly: "Write a warm, friendly voicemail greeting.",
  funny: "Write a funny, lighthearted voicemail greeting.",
  serious: "Write a serious and authoritative voicemail greeting.",
  ghost: "Write a spooky ghost-themed voicemail greeting.",
  robot: "Write a robotic, mechanical voicemail greeting.",
};

export async function POST(req: Request) {
  const { text, tone } = await req.json();

  const instruction =
    TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You write short voicemail greetings.",
      },
      {
        role: "user",
        content: `${instruction}\n\nBase text:\n${text}`,
      },
    ],
    max_tokens: 120,
  });

  return NextResponse.json({
    script: completion.choices[0].message.content,
  });
}
