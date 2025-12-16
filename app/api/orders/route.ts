import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = await prisma.voicemailOrder.create({
      data: {
        email: body.email,
        name: body.name,
        script: body.script,
        audioUrl: body.audioUrl,
        paymentMethod: body.paymentMethod ?? "cashapp",
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
