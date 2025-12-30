export type ToneId =
  | "professional"
  | "business"
  | "friendly"
  | "funny"
  | "serious"
  | "angry"
  | "calm"
  | "spooky"
  | "out_of_office";

export const TONES: { id: ToneId; label: string; prompt: string }[] = [
  {
    id: "professional",
    label: "📞 Professional",
    prompt: "professional, clear, confident, polished",
  },
  {
    id: "business",
    label: "🏢 Business",
    prompt: "corporate, formal, efficient, concise",
  },
  {
    id: "friendly",
    label: "😊 Friendly",
    prompt: "warm, friendly, welcoming, conversational",
  },
  {
    id: "funny",
    label: "😂 Funny",
    prompt: "lighthearted, playful, humorous",
  },
  {
    id: "serious",
    label: "🧠 Serious",
    prompt: "calm, serious, authoritative",
  },
  {
    id: "angry",
    label: "😠 Angry",
    prompt: "firm, irritated, assertive but controlled",
  },
  {
    id: "calm",
    label: "🧘 Calm",
    prompt: "slow, soothing, relaxed",
  },
  {
    id: "spooky",
    label: "👻 Spooky",
    prompt: "mysterious, eerie, atmospheric",
  },
  {
    id: "out_of_office",
    label: "🏖️ Out of Office",
    prompt: "cheerful, relaxed, vacation-style",
  },
];

export function getTone(id: ToneId) {
  return TONES.find((t) => t.id === id);
}
