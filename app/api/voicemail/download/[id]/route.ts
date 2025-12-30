import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const order = await prisma.voicemailOrder.findUnique({
    where: { id: params.id },
  });

  if (!order || !order.paid) {
    return NextResponse.json({ error: "Not paid" }, { status: 403 });
  }

  return NextResponse.json({ audioUrl: order.audioUrl });
}
