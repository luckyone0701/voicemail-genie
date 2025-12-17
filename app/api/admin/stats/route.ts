import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [orders, revenue] = await Promise.all([
      prisma.voicemailOrder.count(),
      prisma.voicemailOrder.aggregate({
        _sum: { price: true },
      }),
    ]);

    return NextResponse.json({
      totalOrders: orders,
      totalRevenue: revenue._sum.price ?? 0,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
