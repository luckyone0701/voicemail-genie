// app/api/voicemail/download/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id", { status: 400 });
  }

  const voicemail = await prisma.voicemail.findUnique({
    where: { id },
    select: { paid: true, audioUrl: true },
  });

  if (!voicemail || !voicemail.paid) {
    return new NextResponse("Payment required", { status: 402 });
  }

  // Redirect to signed S3 / storage URL
  return NextResponse.redirect(voicemail.audioUrl);
}
