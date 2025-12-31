"use client";

import { useEffect, useState } from "react";

type ToneId =
  | "professional"
  | "friendly"
  | "funny"
  | "serious"
  | "robot"
  | "ghost";

const FREE_TONES: ToneId[] = [
  "professional",
  "friendly",
  "funny",
  "serious",
];

const PREMIUM_TONES: ToneId[] = ["robot", "ghost"];

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [audio, setAudio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [premium, setPremium] = useState(false);

  // Detect unlocks via query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") setPaid(true);
    if (params.get("upsell") === "success") {
      setPaid(true);
      setPremium(true);
    }
  }, []);

  async function generatePreview() {
    setLoading(true);
    setAudio(null);

    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, tone }),
    });

    const data = await res.json();
    if (data.audio) setAudio(data.audio);

    setLoading(false);
  }

  async function pay() {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  }

  async function upgrade() {
    const res = await fetch("/api/checkout/upsell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-6 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-black">
          Create Your Voicemail
        </h1>

        {/* TEXT INPUT */}
        <textarea
          className="w-full h-32 border rounded-xl p-4 text-black bg-white"
          placeholder="Type what you want your voicemail to say…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* TONES */}
        <div className="space-y-2">
          <div className="flex flex-wrap justify-center gap-2">
            {FREE_TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-full border ${
                  tone === t
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 opacity-90">
            {PREMIUM_TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-full border ${
                  tone === t
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-100 text-black"
                }`}
              >
                {t} 🔒
              </button>
            ))}
          </div>
        </div>

        {/* PREVIEW */}
        <button
          onClick={generatePreview}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl"
        >
          {loading ? "Generating…" : "Generate Preview"}
        </button>

        {audio && (
          <audio controls className="w-full mt-2">
            <source src={audio} type="audio/mp3" />
          </audio>
        )}

        {/* PAYWALL */}
        {!paid && (
          <button
            onClick={pay}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
          >
            Pay $5 to Download Full Audio
          </button>
        )}

        {/* UPSSELL */}
        {paid && !premium && (
          <div className="border rounded-xl p-4 bg-yellow-50 text-black">
            <h3 className="text-xl font-bold mb-2">
              🔓 Unlock Premium Voices
            </h3>
            <p className="mb-3">
              Get Robot, Ghost, and cinematic styles.
            </p>
            <button
              onClick={upgrade}
              className="w-full bg-black text-white py-2 rounded-xl"
            >
              Upgrade for $7
            </button>
          </div>
        )}

        {premium && (
          <p className="font-semibold text-green-600">
            Premium unlocked 🎉
          </p>
        )}
      </div>
    </div>
  );
}
