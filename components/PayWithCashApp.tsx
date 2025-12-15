"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PayWithCashAppProps = {
  amount?: number;
  userId?: string;
};

export default function PayWithCashApp({
  amount = 4.99,
  userId,
}: PayWithCashAppProps) {
  const [loading, setLoading] = useState(false);

  async function startPayment() {
    setLoading(true);

    // TODO: generate Cash App payment link / QR
    alert("Cash App payment flow coming next");

    setLoading(false);
  }

  return (
    <Button
      className="w-full bg-indigo-600 text-white"
      onClick={startPayment}
      disabled={loading}
    >
      {loading ? "Preparing…" : `Pay $${amount} with Cash App`}
    </Button>
  );
}
