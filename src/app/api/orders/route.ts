import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = await prisma.voicemailOrder.create({
      data: {
        email: body.email,
        name: body.name,
        script: body.script,
        audioUrl: body.audioUrl,
        paymentMethod: body.paymentMethod ?? "manual",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
