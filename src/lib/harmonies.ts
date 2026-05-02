import chroma from "chroma-js";
import type { Harmony } from "./types";

function rotateHue(hex: string, degrees: number): string {
  const c = chroma(hex);
  const [h, s, l] = c.hsl();
  const safeH = Number.isNaN(h) ? 0 : h;
  const newHue = (safeH + degrees + 360) % 360;
  return chroma.hsl(newHue, s, l).hex();
}

export function computeHarmony(hex: string): Harmony {
  return {
    complementary: rotateHue(hex, 180),
    analogous: [rotateHue(hex, -30), rotateHue(hex, 30)],
    triadic: [rotateHue(hex, -120), rotateHue(hex, 120)],
  };
}

export function harmonyList(hex: string): { label: string; hex: string }[] {
  const h = computeHarmony(hex);
  return [
    { label: "Complementary", hex: h.complementary },
    { label: "Analogous −30°", hex: h.analogous[0] },
    { label: "Analogous +30°", hex: h.analogous[1] },
    { label: "Triadic −120°", hex: h.triadic[0] },
    { label: "Triadic +120°", hex: h.triadic[1] },
  ];
}
