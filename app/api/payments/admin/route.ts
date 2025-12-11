import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const rows = await prisma.payment.findMany({ orderBy: { createdAt: "desc" }, include: { events: true } });
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  try {
    const { paymentId, action } = await req.json();
    if (!paymentId || !action) return NextResponse.json({ error: "bad request" }, { status: 400 });

    if (action === "approve") {
      const p = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "paid_admin_verified",
          events: { create: { type: "admin_approved", raw: {} } }
        }
      });
      return NextResponse.json({ ok: true, payment: p });
    } else if (action === "reject") {
      const p = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "failed",
          events: { create: { type: "admin_rejected", raw: {} } }
        }
      });
      return NextResponse.json({ ok: true, payment: p });
    }

    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  } catch (err) {
    console.error("admin action error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
