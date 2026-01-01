import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const paidFile = path.join(process.cwd(), "paid", `${params.id}.paid`);
  const audioFile = path.join(process.cwd(), "private_audio", `${params.id}.mp3`);

  if (!fs.existsSync(paidFile)) {
    return NextResponse.json({ error: "Not paid" }, { status: 403 });
  }

  if (!fs.existsSync(audioFile)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const audio = fs.readFileSync(audioFile);
  return new NextResponse(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=voicemail.mp3",
    },
  });
}
