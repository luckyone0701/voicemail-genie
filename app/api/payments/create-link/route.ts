// app/api/payments/create-link/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // TODO: integrate Square / Stripe here
  return NextResponse.json({
    ok: true,
    message: "Payment link creation stub",
  });
}
