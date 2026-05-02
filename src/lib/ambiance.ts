import type { Ambiance, ExtractedColor, MoodKey } from "./types";

const MOOD_DEFS: Record<
  MoodKey,
  { from: string; via: string; to: string }
> = {
  warm: { from: "#3a0d18", via: "#0c0c0c", to: "#0c0c0c" },
  golden: { from: "#3b220a", via: "#0c0c0c", to: "#0c0c0c" },
  nature: { from: "#0d2a1c", via: "#0c0c0c", to: "#0c0c0c" },
  cool: { from: "#0d1f3a", via: "#0c0c0c", to: "#0c0c0c" },
  royal: { from: "#22113a", via: "#0c0c0c", to: "#0c0c0c" },
  neutral: { from: "#171717", via: "#0c0c0c", to: "#0c0c0c" },
};

const MOOD_GRADIENT_CLASS: Record<MoodKey, string> = {
  warm: "from-rose-950 via-neutral-950 to-neutral-950",
  golden: "from-amber-950 via-neutral-950 to-neutral-950",
  nature: "from-emerald-950 via-neutral-950 to-neutral-950",
  cool: "from-blue-950 via-neutral-950 to-neutral-950",
  royal: "from-violet-950 via-neutral-950 to-neutral-950",
  neutral: "from-neutral-900 via-neutral-950 to-neutral-950",
};

function moodFromHsl(h: number, s: number): MoodKey {
  if (s < 15) return "neutral";
  if (h < 30 || h >= 330) return "warm";
  if (h < 70) return "golden";
  if (h < 150) return "nature";
  if (h < 250) return "cool";
  return "royal";
}

export function dominantColor(palette: ExtractedColor[]): ExtractedColor | null {
  if (palette.length === 0) return null;
  return palette.reduce((best, c) =>
    c.population > best.population ? c : best,
  );
}

export function computeAmbiance(palette: ExtractedColor[]): Ambiance {
  const fallback = MOOD_DEFS.neutral;
  const dominant = dominantColor(palette);
  if (!dominant) {
    return {
      mood: "neutral",
      gradient: MOOD_GRADIENT_CLASS.neutral,
      fromColor: fallback.from,
      viaColor: fallback.via,
      toColor: fallback.to,
    };
  }
  const mood = moodFromHsl(dominant.hsl.h, dominant.hsl.s);
  const def = MOOD_DEFS[mood];
  return {
    mood,
    gradient: MOOD_GRADIENT_CLASS[mood],
    fromColor: def.from,
    viaColor: def.via,
    toColor: def.to,
  };
}

export const BASE_AMBIANCE: Ambiance = {
  mood: "neutral",
  gradient: MOOD_GRADIENT_CLASS.neutral,
  fromColor: "#0c0c0c",
  viaColor: "#0c0c0c",
  toColor: "#0c0c0c",
};
