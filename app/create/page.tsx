"use client";

import { useState } from "react";

const TONES = [
  { id: "professional", label: "📞 Professional", premium: false },
  { id: "friendly", label: "😊 Friendly", premium: false },
  { id: "funny", label: "😂 Funny", premium: false },
  { id: "serious", label: "🧠 Serious", premium: false },
  { id: "ghost", label: "👻 Ghost", premium: true },
  { id: "robot", label: "🤖 Robot", premium: true },
] as const;

type ToneId = (typeof TONES)[number]["id"];
type Voice = "female" | "male";

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [voice, setVoice] = useState<Voice>("female");
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

      if (res.status === 402) {
        alert("This voice or tone is unlocked after payment.");
        return;
      }

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
      alert("Preview failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl space-y-6 text-center">

        <h1 className="text-4xl font-extrabold">Create Your Voicemail</h1>

        {/* Text input */}
        <textarea
          className="w-full rounded-lg p-4 bg-black text-white border border-white/20"
          rows={4}
          placeholder="Hi, you’ve reached my voicemail. Please leave a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Tone selector */}
        <div className="flex flex-wrap justify-center gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              disabled={t.premium}
              onClick={() => setTone(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  t.premium
                    ? "opacity-40 cursor-not-allowed border border-white/20"
                    : tone === t.id
                    ? "bg-yellow-400 text-black"
                    : "bg-white/10 text-white"
                }`}
            >
              {t.label} {t.premium && "🔒"}
            </button>
          ))}
        </div>

        {/* Voice selector */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setVoice("female")}
            className={`px-6 py-2 rounded-lg font-semibold ${
              voice === "female"
                ? "bg-yellow-400 text-black"
                : "bg-white/10"
            }`}
          >
            👩 Female
          </button>

          <button
            disabled
            className="px-6 py-2 rounded-lg font-semibold opacity-40 cursor-not-allowed bg-white/10"
          >
            👨 Male 🔒
          </button>
        </div>

        {/* Preview */}
        <button
          onClick={generatePreview}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-lg py-4 rounded-xl font-semibold"
        >
          {loading ? "Generating…" : "▶ Generate Preview (Free)"}
        </button>

        {/* Pay */}
        <button
          onClick={async () => {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();
            window.location.href = data.url;
          }}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-lg py-4 rounded-xl font-bold"
        >
          Pay $5 & Unlock Premium Voices
        </button>
      </div>
    </div>
  );
}
