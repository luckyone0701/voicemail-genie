import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const order = await prisma.voicemailOrder.findUnique({
    where: { id },
    select: {
      audioUrl: true,
      // add this once you add paid flag
      paid: true,
    },
  });

  if (!order || !order.paid) {
    return NextResponse.json(
      { error: "Payment required" },
      { status: 403 }
    );
  }

  return NextResponse.json({ audioUrl: order.audioUrl });
}
