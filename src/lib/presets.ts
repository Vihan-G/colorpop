import { extractedFromHexes } from "./extract";
import type { ExtractedColor } from "./types";

export interface Preset {
  id: string;
  label: string;
  hexes: string[];
}

export const PRESETS: Preset[] = [
  {
    id: "sunset",
    label: "Sunset",
    hexes: [
      "#1a0a26",
      "#3d1247",
      "#7a1d4f",
      "#c63a59",
      "#ec6f5b",
      "#f3a868",
      "#fbd391",
      "#fde9b9",
    ],
  },
  {
    id: "mediterranean",
    label: "Mediterranean",
    hexes: [
      "#04293a",
      "#064663",
      "#1c6dd0",
      "#2e8bc0",
      "#5dbecd",
      "#9bd1d6",
      "#e8e1c5",
      "#f6f1d1",
    ],
  },
  {
    id: "forest",
    label: "Forest",
    hexes: [
      "#0e1a14",
      "#1a2e22",
      "#2f4a32",
      "#4a6b3c",
      "#7d8f5a",
      "#b0a36f",
      "#cdb285",
      "#e6d3a3",
    ],
  },
];

export function presetPalette(preset: Preset): ExtractedColor[] {
  return extractedFromHexes(preset.hexes);
}
