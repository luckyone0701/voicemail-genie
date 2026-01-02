"use client";

import { useState } from "react";

const TONES = [
  { id: "professional", label: "💼 Professional", premium: false },
  { id: "friendly", label: "😊 Friendly", premium: false },
  { id: "funny", label: "😂 Funny", premium: false },
  { id: "serious", label: "🧠 Serious", premium: false },
  { id: "ghost", label: "👻 Ghost", premium: true },
  { id: "robot", label: "🤖 Robot", premium: true },
] as const;

type ToneId = (typeof TONES)[number]["id"];
type Voice = "female" | "male";

export default function CreatePage() {
  const [text, setText] = useState(
    "I'm away from my desk but will return your call within 24 hours. Please leave your name, number, and message. Thank you!"
  );
  const [tone, setTone] = useState<ToneId>("professional");
  const [voice, setVoice] = useState<Voice>("female");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePreview() {
    setLoading(true);
    setAudioSrc(null);

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone, voice }),
      });

      const data = await res.json();

      if (data.audio) {
        setAudioSrc(data.audio);
      } else {
        alert("Preview failed.");
      }
    } catch (e) {
      alert("Error generating preview");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-600 to-indigo-800 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center">
          Create Your Voicemail
        </h1>

        {/* TEXTAREA */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 rounded-lg bg-black text-white p-4 resize-none outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* TONES */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                if (t.premium) {
                  alert("Premium tone — unlock after payment");
                  return;
                }
                setTone(t.id);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border
                ${
                  tone === t.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-black border-gray-300"
                }
                ${t.premium ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {t.label} {t.premium && "🔒"}
            </button>
          ))}
        </div>

        {/* VOICE SELECTOR */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setVoice("female")}
            className={`px-4 py-2 rounded-full border ${
              voice === "female"
                ? "bg-yellow-400 text-black"
                : "bg-white"
            }`}
          >
            Female Voice
          </button>
          <button
            onClick={() => setVoice("male")}
            className={`px-4 py-2 rounded-full border ${
              voice === "male"
                ? "bg-yellow-400 text-black"
                : "bg-white"
            }`}
          >
            Male Voice
          </button>
        </div>

        {/* PREVIEW BUTTON */}
        <button
          onClick={generatePreview}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:opacity-90"
        >
          {loading ? "Generating..." : "Generate Preview"}
        </button>

        {/* AUDIO PLAYER */}
        {audioSrc && (
          <audio
            controls
            autoPlay
            src={audioSrc}
            className="w-full mt-2"
          />
        )}

        {/* PAY BUTTON (SAFE — NO 404) */}
        <button
          onClick={() => alert("Checkout will be enabled next")}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
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
