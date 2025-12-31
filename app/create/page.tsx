"use client";

import { useState } from "react";

const TONES = [
  { id: "professional", label: "📞 Professional" },
  { id: "business", label: "💼 Business" },
  { id: "friendly", label: "😊 Friendly" },
  { id: "funny", label: "😂 Funny" },
  { id: "serious", label: "😐 Serious" },
  { id: "angry", label: "😡 Angry" },
  { id: "ghost", label: "👻 Ghost" },
  { id: "robot", label: "🤖 Robot" },
];

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("professional");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePreview() {
    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      const data = await res.json();
      if (data.audio) setAudioUrl(data.audio);
    } catch (e) {
      console.error("Preview failed", e);
    } finally {
      setLoading(false);
    }
  }

  async function goToCheckout() {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white flex flex-col items-center px-6">
      <h1 className="text-4xl font-extrabold mt-20 mb-2">
        Create Your Voicemail
      </h1>
      <p className="opacity-90 mb-10 text-center">
        Generate a free preview, then pay to download the full audio.
      </p>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Hi, you’ve reached..."
        className="w-full max-w-2xl h-36 p-4 rounded-xl text-black bg-black/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {/* Tone Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl">
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tone === t.id
                ? "bg-yellow-400 text-black"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Preview Button */}
      <button
        onClick={generatePreview}
        disabled={loading || text.length < 5}
        className="mt-10 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold"
      >
        {loading ? "Generating…" : "Generate Free Preview"}
      </button>

      {/* Audio Player */}
      {audioUrl && (
        <audio controls className="mt-6">
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Pay Button */}
      <button
        onClick={goToCheckout}
        className="mt-10 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-8 py-4 rounded-xl shadow-xl"
      >
        Pay & Download Full Audio
      </button>
    </div>
  );
}
