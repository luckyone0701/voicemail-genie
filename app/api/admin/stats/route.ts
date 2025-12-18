import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.voicemailOrder.findMany({
    where: { paid: true },
  });

  const totalRevenue = orders.length * 5; // $5 per order

  return NextResponse.json({
    totalOrders: orders.length,
    totalRevenue,
  });
}
