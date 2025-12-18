import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const order = await prisma.voicemailOrder.findUnique({
    where: { id },
    select: { paid: true, audioUrl: true },
  });

  if (!order || !order.paid) {
    return NextResponse.json(
      { error: "Payment required" },
      { status: 403 }
    );
  }

  return NextResponse.json({ audioUrl: order.audioUrl });
}
