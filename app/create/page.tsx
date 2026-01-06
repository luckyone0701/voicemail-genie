"use client";

import { useState } from "react";

const TONES = [
  { id: "professional", label: "📞 Professional" },
  { id: "friendly", label: "😊 Friendly" },
  { id: "funny", label: "😂 Funny" },
  { id: "serious", label: "🧠 Serious" },
  { id: "ghost", label: "👻 Ghost (Premium)" },
  { id: "robot", label: "🤖 Robot (Premium)" },
] as const;

type ToneId = (typeof TONES)[number]["id"];
type Voice = "female" | "male";

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [voice] = useState<Voice>("female");
  const [loading, setLoading] = useState(false);

  async function generatePreview() {
    if (!text.trim()) {
      alert("Please enter text first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone, voice }),
      });

      if (!res.ok) throw new Error("Preview failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const existing = document.getElementById("preview-audio");
      if (existing) existing.remove();

      const audio = document.createElement("audio");
      audio.id = "preview-audio";
      audio.src = url;
      audio.controls = true;
      audio.autoplay = true;

      document.body.appendChild(audio);
    } catch (err) {
      console.error(err);
      alert("Preview failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl space-y-6 text-center">
        <h1 className="text-4xl font-extrabold">Create Your Voicemail</h1>

        <textarea
          className="w-full rounded-lg p-4 bg-black text-white border border-white/20"
          rows={4}
          placeholder="Hi, you’ve reached my voicemail..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap justify-center gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-4 py-2 rounded-lg ${
                tone === t.id ? "bg-yellow-400 text-black" : "bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={generatePreview}
          disabled={loading}
          className="w-full bg-indigo-600 text-white text-lg py-4 rounded-xl"
        >
          {loading ? "Generating…" : "▶ Generate Preview (Free)"}
        </button>

        <button
          onClick={async () => {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();
            window.location.href = data.url;
          }}
          className="w-full bg-yellow-400 text-black text-lg py-4 rounded-xl font-bold"
        >
          Pay $5 & Unlock Premium Voices
        </button>
      </div>
    </div>
  );
}
