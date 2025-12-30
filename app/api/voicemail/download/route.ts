import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const order = await prisma.voicemailOrder.findUnique({
    where: { id },
    select: { paid: true, audioUrl: true },
  });

  if (!order || !order.paid || !order.audioUrl) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  return NextResponse.json({ audioUrl: order.audioUrl });
}
