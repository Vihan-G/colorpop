import type { ExtractedColor } from "./types";

type Pixel = [number, number, number];

interface Bucket {
  pixels: Pixel[];
  rangeR: number;
  rangeG: number;
  rangeB: number;
  maxRange: number;
}

function bucketRanges(pixels: Pixel[]): Omit<Bucket, "pixels"> {
  let rMin = 255,
    rMax = 0,
    gMin = 255,
    gMax = 0,
    bMin = 255,
    bMax = 0;
  for (const [r, g, b] of pixels) {
    if (r < rMin) rMin = r;
    if (r > rMax) rMax = r;
    if (g < gMin) gMin = g;
    if (g > gMax) gMax = g;
    if (b < bMin) bMin = b;
    if (b > bMax) bMax = b;
  }
  const rangeR = rMax - rMin;
  const rangeG = gMax - gMin;
  const rangeB = bMax - bMin;
  return {
    rangeR,
    rangeG,
    rangeB,
    maxRange: Math.max(rangeR, rangeG, rangeB),
  };
}

function makeBucket(pixels: Pixel[]): Bucket {
  return { pixels, ...bucketRanges(pixels) };
}

function splitBucket(bucket: Bucket): [Bucket, Bucket] {
  const { pixels, rangeR, rangeG, rangeB } = bucket;
  let channel: 0 | 1 | 2 = 0;
  if (rangeG >= rangeR && rangeG >= rangeB) channel = 1;
  else if (rangeB >= rangeR && rangeB >= rangeG) channel = 2;
  const sorted = pixels.slice().sort((a, b) => a[channel] - b[channel]);
  const mid = Math.floor(sorted.length / 2);
  return [makeBucket(sorted.slice(0, mid)), makeBucket(sorted.slice(mid))];
}

function averageBucket(bucket: Bucket): {
  rgb: Pixel;
  population: number;
} {
  const len = bucket.pixels.length;
  let r = 0,
    g = 0,
    b = 0;
  for (const px of bucket.pixels) {
    r += px[0];
    g += px[1];
    b += px[2];
  }
  return {
    rgb: [Math.round(r / len), Math.round(g / len), Math.round(b / len)],
    population: len,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      case bN:
        h = (rN - gN) / d + 4;
        break;
    }
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function medianCut(pixels: Pixel[], targetCount: number): Bucket[] {
  let buckets: Bucket[] = [makeBucket(pixels)];
  while (buckets.length < targetCount) {
    buckets.sort((a, b) => b.maxRange - a.maxRange);
    const largest = buckets.shift();
    if (!largest || largest.pixels.length < 2 || largest.maxRange === 0) {
      if (largest) buckets.push(largest);
      break;
    }
    const [a, b] = splitBucket(largest);
    if (a.pixels.length === 0 || b.pixels.length === 0) {
      buckets.push(largest);
      break;
    }
    buckets.push(a, b);
  }
  return buckets;
}

function samplePixels(data: Uint8ClampedArray, maxSamples = 10000): Pixel[] {
  const pixelCount = data.length / 4;
  const stride = Math.max(1, Math.floor(pixelCount / maxSamples));
  const pixels: Pixel[] = [];
  for (let i = 0; i < pixelCount; i += stride) {
    const idx = i * 4;
    const a = data[idx + 3];
    if (a < 125) continue;
    pixels.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  return pixels;
}

function buildExtracted(rgb: Pixel, population: number, total: number): ExtractedColor {
  const [r, g, b] = rgb;
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
    luminance: relativeLuminance(r, g, b),
    population: total === 0 ? 0 : population / total,
  };
}

const MAX_DIMENSION = 320;

function drawToCanvas(image: HTMLImageElement): ImageData | null {
  const ratio = Math.min(
    MAX_DIMENSION / image.naturalWidth,
    MAX_DIMENSION / image.naturalHeight,
    1,
  );
  const w = Math.max(1, Math.round(image.naturalWidth * ratio));
  const h = Math.max(1, Math.round(image.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

export async function extractColors(
  image: HTMLImageElement,
  count = 8,
): Promise<ExtractedColor[]> {
  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to load image"));
    });
  }
  const data = drawToCanvas(image);
  if (!data) throw new Error("Canvas 2D context unavailable");
  const pixels = samplePixels(data.data);
  if (pixels.length === 0) return [];
  const buckets = medianCut(pixels, count);
  const totalSampled = pixels.length;
  const colors = buckets.map((b) => {
    const { rgb, population } = averageBucket(b);
    return buildExtracted(rgb, population, totalSampled);
  });
  return colors.sort((a, b) => a.luminance - b.luminance);
}

export function extractedFromHexes(hexes: string[]): ExtractedColor[] {
  return hexes
    .map((hex) => {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return buildExtracted([r, g, b], 1, hexes.length);
    })
    .sort((a, b) => a.luminance - b.luminance);
}
