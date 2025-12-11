"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PayWithCashApp({ amount = 4.99, userId }: { amount?: number; userId?: string }) {
  const [loading, setLoading] = useState(false);

  async function startPayment() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, userId }),
      });
      const data = await res.json();
      if (data?.url) {
        // redirect to Cash App
        window.location.href = data.url;
      } else {
        alert("Failed to create payment link");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button className="w-full bg-indigo-600 text-white" onClick={startPayment} disabled={loading}>
      {loading ? "Preparing…" : `Pay $${amount} with Cash App`}
    </Button>
  );
}
