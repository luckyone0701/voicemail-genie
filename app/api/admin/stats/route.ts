import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.voicemailOrder.findMany({
      select: { price: true },
    });

    const totalRevenue = orders.reduce((sum, o) => {
      const value = typeof o.price === "number" ? o.price : Number(o.price);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    return NextResponse.json({
      totalOrders: orders.length,
      totalRevenue,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to load admin stats" },
      { status: 500 }
    );
  }
}
