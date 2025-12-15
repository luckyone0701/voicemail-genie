"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CreatePage() {
  const [paid, setPaid] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-6 space-y-4">
        <h1 className="text-2xl font-bold">Create Your Voicemail</h1>

        {!paid ? (
          <>
            <p className="text-gray-600">
              Pay <strong>$5</strong> via Cash App to continue.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Send payment to:</p>
              <p className="text-2xl font-bold">$YourCashtag</p>
              <p className="text-sm mt-2">
                Add your email or name in the Cash App note
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => setPaid(true)}
            >
              I’ve Paid
            </Button>
          </>
        ) : (
          <>
            <p className="text-green-600 font-semibold">
              Payment submitted ✔
            </p>

            <p className="text-gray-600">
              Upload or describe your voicemail. We’ll deliver shortly.
            </p>

            <textarea
              className="w-full border rounded-lg p-3"
              placeholder="Example: Hi, you've reached Mike..."
            />

            <Button className="w-full">
              Submit Voicemail Request
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
