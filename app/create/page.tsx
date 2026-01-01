"use client";

import { useState } from "react";

type Tone =
  | "professional"
  | "friendly"
  | "funny"
  | "serious"
  | "robot"
  | "ghost";

type Voice = "female" | "male";

const TONES: { id: Tone; label: string; locked?: boolean }[] = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "funny", label: "Funny" },
  { id: "serious", label: "Serious" },
  { id: "robot", label: "🤖 Robot", locked: true },
  { id: "ghost", label: "👻 Ghost", locked: true },
];

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [voice, setVoice] = useState<Voice>("female");
  const [audio, setAudio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePreview() {
    setLoading(true);
    setAudio(null);

    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, tone, voice }),
    });

    const data = await res.json();
    setAudio(data.audio);
    setLoading(false);
  }

  async function payAndDownload() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, tone, voice }),
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Create Your Voicemail
        </h1>

        {/* TEXT INPUT */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your voicemail or leave it blank for AI-generated text"
          className="w-full h-32 rounded-lg border border-gray-300 p-4 text-black bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* TONES */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => !t.locked && setTone(t.id)}
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                tone === t.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-black"
              } ${t.locked ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {t.label} {t.locked && "🔒"}
            </button>
          ))}
        </div>

        {/* VOICE */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setVoice("female")}
            className={`px-4 py-2 rounded-full ${
              voice === "female"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Female Voice
          </button>
          <button
            onClick={() => setVoice("male")}
            className={`px-4 py-2 rounded-full ${
              voice === "male"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Male Voice
          </button>
        </div>

        {/* PREVIEW */}
        <button
          onClick={generatePreview}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Generating…" : "Generate Preview"}
        </button>

        {audio && (
          <audio controls className="w-full">
            <source src={audio} type="audio/mpeg" />
          </audio>
        )}

        {/* PAY */}
        <button
          onClick={payAndDownload}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold text-lg"
        >
          Pay $5 to Download Full Audio
        </button>
      </div>
    </div>
  );
}
