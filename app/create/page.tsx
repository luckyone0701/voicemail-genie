"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const TONES = [
  { id: "professional", label: "📞 Professional" },
  { id: "friendly", label: "😊 Friendly" },
  { id: "funny", label: "😂 Funny" },
  { id: "serious", label: "🧠 Serious" },
  { id: "ghost", label: "👻 Ghost" },
  { id: "robot", label: "🤖 Robot" },
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
      // 1️⃣ Generate tone-based script
      const scriptRes = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, tone }),
      });

      if (!scriptRes.ok) throw new Error("Script generation failed");

      const { script } = await scriptRes.json();

      // 2️⃣ Generate TTS preview from rewritten script
      const audioRes = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script,
          voice,
        }),
      });

      if (!audioRes.ok) throw new Error("Audio preview failed");

      const blob = await audioRes.blob();
      const url = URL.createObjectURL(blob);

      // Remove previous audio
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
            <Button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={
                tone === t.id
                  ? "bg-yellow-400 text-black"
                  : "bg-white/10 text-white"
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
            className={voice === "female" ? "bg-yellow-400 text-black" : ""}
          >
            👩 Female
          </Button>
          <Button
            onClick={() => setVoice("male")}
            className={voice === "male" ? "bg-yellow-400 text-black" : ""}
          >
            👨 Male
          </Button>
        </div>

        {/* Preview */}
        <Button
          onClick={generatePreview}
          disabled={loading}
          className="w-full bg-indigo-600 text-white text-lg py-4 rounded-xl"
        >
          {loading ? "Generating…" : "▶ Generate Preview (Free)"}
        </Button>

        {/* Pay */}
        <Button
          onClick={async () => {
            const res = await fetch("/api/checkout", { method: "POST" });
            const data = await res.json();
            window.location.href = data.url;
          }}
          className="w-full bg-yellow-400 text-black text-lg py-4 rounded-xl font-bold"
        >
          Pay $5 & Unlock Full Audio
        </Button>
      </div>
    </div>
  );
}
