"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const TONES = [
  { id: "friendly", label: "😊 Friendly" },
  { id: "professional", label: "💼 Professional" },
  { id: "funny", label: "😂 Funny" },
  { id: "ghost", label: "👻 Ghost" },
  { id: "robot", label: "🤖 Robot" },
] as const;

type ToneId = (typeof TONES)[number]["id"];

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId>("friendly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function generatePreview() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || "Preview failed");
      }

      const data = await res.json();

      if (!data.audio) {
        throw new Error("No audio returned");
      }

      // ✅ PLAY AUDIO
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = data.audio;
      audioRef.current.load();
      await audioRef.current.play();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-indigo-700 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-extrabold text-center">
          Create Your Voicemail
        </h1>

        {/* TEXT INPUT */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type what you want your voicemail to say…"
          className="w-full h-40 p-4 rounded-xl text-black text-lg"
        />

        {/* TONES */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                tone === t.id
                  ? "bg-yellow-400 text-black"
                  : "bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ACTION */}
        <Button
          onClick={generatePreview}
          disabled={loading || text.trim().length < 5}
          className="w-full bg-yellow-400 text-black font-bold text-lg py-4 rounded-xl"
        >
          {loading ? "Generating Preview…" : "Generate Preview"}
        </Button>

        {error && (
          <p className="text-red-300 text-center font-medium">{error}</p>
        )}

        <p className="text-center text-sm opacity-80">
          Preview is limited. Unlock full-length audio after payment.
        </p>
      </div>
    </div>
  );
}
