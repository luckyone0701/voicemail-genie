import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalOrders = await prisma.voicemailOrder.count();

    return NextResponse.json({
      totalOrders,
      totalRevenue: 0, // placeholder
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
