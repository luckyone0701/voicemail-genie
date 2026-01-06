import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function applyTone(text: string, tone: string) {
  switch (tone) {
    case "funny":
      return `Hey there! 😄 You’ve reached my voicemail. I can’t grab the phone right now, but leave a message and I promise I’ll get back to you!`;

    case "professional":
      return `Hello. You have reached my voicemail. I am currently unavailable. Please leave your name, number, and message, and I will return your call.`;

    case "serious":
      return `You have reached my voicemail. Please leave your name and message after the tone.`;

    case "ghost":
      return `Oooo… you have reached the voicemail… leave your message… if you dare…`;

    case "robot":
      return `You have reached voicemail unit seven. Please state your message clearly after the tone.`;

    case "friendly":
      return `Hi there! You’ve reached my voicemail. I’m away right now, but leave me a message and I’ll get back to you soon!`;

    default:
      return text;
  }
}

export async function POST(req: Request) {
  try {
    const { text, tone = "professional", voice = "female" } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const spokenText = applyTone(text, tone);

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice === "male" ? "alloy" : "nova",
      input: spokenText,
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Preview TTS error:", error);
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
