export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  luminance: number;
  population: number;
}

export interface Harmony {
  complementary: string;
  analogous: [string, string];
  triadic: [string, string];
}

export type MoodKey =
  | "warm"
  | "golden"
  | "nature"
  | "cool"
  | "royal"
  | "neutral";

export interface Ambiance {
  mood: MoodKey;
  gradient: string;
  fromColor: string;
  viaColor: string;
  toColor: string;
}
