"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { TONES, ToneId } from "@/app/lib/tones";

type Voice = "female" | "male";
type PauseStyle = "natural" | "crisp";

export default function CreatePage() {
  const [notes, setNotes] = useState("");
  const [tone, setTone] = useState<ToneId>("professional");
  const [voice, setVoice] = useState<Voice>("female");
  const [speed, setSpeed] = useState(1.15);
  const [pauseStyle, setPauseStyle] = useState<PauseStyle>("natural");

  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function generatePreview() {
    setLoading(true);
    setAudioUrl(null);

    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes,
        tone,
        voice,
        speed,
        pauseStyle,
      }),
    });

    const data = await res.json();
    setAudioUrl(data.audioUrl);
    setLoading(false);
  }

  async function payAndDownload() {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Card className="w-full max-w-xl bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Create Voicemail Preview
        </h1>

        {/* TEXT INPUT */}
        <Textarea
          placeholder="Hi, you've reached Randy. Please leave a message after the tone."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />

        {/* VOICE */}
        <div className="flex justify-center gap-3">
          {(["female", "male"] as Voice[]).map((v) => (
            <Button
              key={v}
              variant={voice === v ? "default" : "outline"}
              onClick={() => setVoice(v)}
            >
              {v === "female" ? "Female" : "Male"}
            </Button>
          ))}
        </div>

        {/* TONES */}
        <div className="flex justify-center gap-2 flex-wrap">
          {TONES.map((t) => (
            <Button
              key={t.id}
              variant={tone === t.id ? "default" : "outline"}
              onClick={() => setTone(t.id)}
            >
              {t.label}
            </Button>
          ))}
        </div>

        {/* SPEED */}
        <div className="text-center space-y-2">
          <label className="text-sm opacity-80">
            Speech Speed: {speed.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.9"
            max="1.3"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* PAUSES */}
        <div className="flex justify-center gap-3">
          <Button
            variant={pauseStyle === "natural" ? "default" : "outline"}
            onClick={() => setPauseStyle("natural")}
          >
            Natural Pauses
          </Button>
          <Button
            variant={pauseStyle === "crisp" ? "default" : "outline"}
            onClick={() => setPauseStyle("crisp")}
          >
            Crisp / No Gaps
          </Button>
        </div>

        {/* GENERATE */}
        <Button
          disabled={!notes || loading}
          onClick={generatePreview}
          className="w-full"
        >
          {loading ? "Generating…" : "Generate 15s Preview"}
        </Button>

        {/* AUDIO */}
        {audioUrl && (
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/mpeg" />
          </audio>
        )}

        {/* PAY */}
        <Button
          onClick={payAndDownload}
          className="w-full bg-yellow-400 text-black hover:bg-yellow-300"
        >
          Pay $5 & Download
        </Button>
      </Card>
    </div>
  );
}
