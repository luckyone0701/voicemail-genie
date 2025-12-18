import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const voicemail = await prisma.voicemailOrder.findUnique({
    where: { id },
    select: { paid: true, audioUrl: true },
  });

  if (!voicemail || !voicemail.paid) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json({ audioUrl: voicemail.audioUrl });
}
