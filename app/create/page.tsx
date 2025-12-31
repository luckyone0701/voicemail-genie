const audioRef = useRef<HTMLAudioElement | null>(null);

async function generatePreview() {
  const res = await fetch("/api/tts/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      tone,
    }),
  });

  const data = await res.json();

  if (!data.audio) {
    alert("No audio returned");
    return;
  }

  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  audioRef.current.src = data.audio;
  audioRef.current.volume = 1;
  audioRef.current.play();
}
