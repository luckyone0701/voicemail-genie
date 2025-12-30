"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ToneId =
  | "professional"
  | "friendly"
  | "funny"
  | "calm"
  | "urgent"
  | "robot"
  | "ghost"
  | "deep"
  | "cheerful"
  | "dramatic";

const TONES: { id: ToneId; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "funny", label: "Funny" },
  { id: "calm", label: "Calm" },
  { id: "urgent", label: "Urgent" },
  { id: "robot", label: "🤖 Robot" },
  { id: "ghost", label: "👻 Ghost" },
  { id: "deep", label: "🎙️ Deep Voice" },
  { id: "cheerful", label: "😊 Cheerful" },
  { id: "dramatic", label: "🎭 Dramatic" },
];

export default function CreatePage() {
  const [script, setScript] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [speed, setSpeed] = useState(1);
  const [pause, setPause] = useState(300);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePreview() {
    setLoading(true);

    // TEMP preview stub — replace with real API later
    setTimeout(() => {
      setPreviewUrl("/sample-preview.mp3");
      setLoading(false);
    }, 1200);
  }

  async function startCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mt-20 space-y-10"
      >
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold">Create Your Voicemail</h1>
          <p className="opacity-90">
            Preview your voicemail, then complete payment to download.
          </p>
        </header>

        {/* Script */}
        <div>
          <label className="block font-semibold mb-2">Voicemail Script</label>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Hi, you’ve reached..."
            className="w-full min-h-[140px] rounded-xl p-4
                       bg-black text-white border border-white/20
                       focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Tone */}
        <div>
          <label className="block font-semibold mb-3">Tone</label>
          <div className="flex flex-wrap gap-3">
            {TONES.map((t) => {
              const active = tone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition
                    ${
                      active
                        ? "bg-yellow-400 text-black shadow"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed */}
        <div>
          <label className="block font-semibold mb-2">
            Speech Speed: {speed.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.75"
            max="1.25"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Pause */}
        <div>
          <label className="block font-semibold mb-2">
            Pause Between Sentences: {pause}ms
          </label>
          <input
            type="range"
            min="100"
            max="800"
            step="50"
            value={pause}
            onChange={(e) => setPause(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Preview + Pay */}
        <div className="text-center space-y-5">
          <Button
            onClick={generatePreview}
            disabled={!script || loading}
            className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-yellow-300"
          >
            {loading ? "Generating Preview…" : "Generate Free Preview"}
          </Button>

          {previewUrl && (
            <>
              <audio controls src={previewUrl} className="w-full mt-4" />

              <Button
                onClick={startCheckout}
                className="bg-indigo-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-950"
              >
                Pay $5 & Download
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
