"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const TONES = [
  { id: "professional", label: "📞 Professional" },
  { id: "business", label: "🏢 Business" },
  { id: "friendly", label: "😊 Friendly" },
  { id: "funny", label: "😂 Funny" },
  { id: "serious", label: "🧠 Serious" },
  { id: "angry", label: "😡 Angry" },
  { id: "ghost", label: "👻 Ghost" },
  { id: "robot", label: "🤖 Robot" },
];

type ToneId = (typeof TONES)[number]["id"];
type Voice = "female" | "male";

export default function CreatePage() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
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
    setAudio(data.audio ?? null);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-800 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6 text-center">
        <h1 className="text-4xl font-extrabold">Create Your Voicemail</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your voicemail text here..."
          className="w-full h-40 p-4 rounded-xl text-black"
        />

        {/* Tone buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {TONES.map((t) => (
            <Button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={
                tone === t.id
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10"
              }
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* Voice selector */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setVoice("female")}
            className={voice === "female" ? "bg-yellow-400 text-black" : "bg-white/10"}
          >
            Female Voice
          </Button>
          <Button
            onClick={() => setVoice("male")}
            className={voice === "male" ? "bg-yellow-400 text-black" : "bg-white/10"}
          >
            Male Voice
          </Button>
        </div>

        <Button
          onClick={generatePreview}
          disabled={loading || text.length < 5}
          className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl"
        >
          {loading ? "Generating..." : "Generate Preview"}
        </Button>

        {audio && (
          <audio controls className="w-full mt-4">
            <source src={audio} type="audio/mp3" />
          </audio>
        )}

        <Button
          onClick={async () => {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();
            window.location.href = data.url;
          }}
          className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl"
        >
          Pay & Download Full Audio
        </Button>
      </div>
    </div>
  );
}
