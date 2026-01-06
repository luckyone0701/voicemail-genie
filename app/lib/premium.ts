export const PREMIUM_TONES = ["ghost", "robot"] as const;
export const PREMIUM_VOICES = ["male"] as const;

export function isPremiumSelection({
  tone,
  voice,
}: {
  tone: string;
  voice: string;
}) {
  return (
    PREMIUM_TONES.includes(tone as any) ||
    PREMIUM_VOICES.includes(voice as any)
  );
}
