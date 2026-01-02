"use client";

import { useState } from "react";

const TONES = [
  { id: "professional", label: "💼 Professional" },
  { id: "friendly", label: "😊 Friendly" },
  { id: "funny", label: "😂 Funny" },
  { id: "serious", label: "😐 Serious" },
  { id: "ghost", label: "👻 Ghost" },
  { id: "robot", label: "🤖 Robot" },
] as const;

type ToneId = (typeof TONES)[number]["id"];
type VoiceId = "female" | "male";

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [voice, setVoice] = useState<VoiceId>("female");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePreview() {
    if (!text.trim()) {
      alert("Please enter voicemail text.");
      return;
    }

    setLoading(true);
    setAudioUrl(null);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone, voice }),
      });

      if (!res.ok) throw new Error("Preview failed");

      const data = await res.json();
      setAudioUrl(data.audio);
    } catch (err) {
      alert("Preview failed.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-600 to-indigo-800 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Create Your Voicemail
        </h1>

        {/* TEXTAREA */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your voicemail message here…"
          className="w-full h-32 rounded-lg bg-black text-white p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* TONES */}
        <div className="flex flex-wrap justify-center gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                tone === t.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* VOICE */}
        <div className="flex justify-center gap-4">
          {(["female", "male"] as VoiceId[]).map((v) => (
            <button
              key={v}
              onClick={() => setVoice(v)}
              className={`px-6 py-2 rounded-full font-semibold ${
                voice === v
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              {v === "female" ? "Female Voice" : "Male Voice"}
            </button>
          ))}
        </div>

        {/* PREVIEW BUTTON */}
        <button
          onClick={generatePreview}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Preview"}
        </button>

        {/* AUDIO PLAYER */}
        {audioUrl && (
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        )}

        {/* PAY */}
        <button
          onClick={goToCheckout}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700"
        >
          Pay $5 to Download Full Audio
        </button>

        <p className="text-xs text-center text-gray-500">
          Preview is limited. Full-length audio unlocks after payment.
        </p>
      </div>
    </div>
  );
}
