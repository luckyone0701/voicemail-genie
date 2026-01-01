import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { prompt, tone } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You write short, professional voicemail greetings."
      },
      {
        role: "user",
        content: `Tone: ${tone}. Request: ${prompt}`
      }
    ],
    max_tokens: 120
  });

  return NextResponse.json({
    script: completion.choices[0].message.content
  });
}
