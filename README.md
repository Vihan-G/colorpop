# colorpop

Drop any image. Get its color palette instantly.

[![Live](https://img.shields.io/badge/live-colorpop-pink)](https://github.com/Vihan-G/colorpop)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)

colorpop extracts the 8 dominant colors from any image using pure client-side
canvas math. No uploads, no servers, no tracking — drop an image and the
palette appears instantly. The background even shifts to match your image's
mood: warm photos go rose, oceans go cool, forests go green.

## What it does

- Drop or click to upload any image (JPG, PNG, WebP)
- Extracts 8 dominant colors via a median-cut quantization algorithm
- Copy hex, RGB, or HSL for any color with one click
- Click a swatch to see complementary, analogous, and triadic harmonies
- Download the palette as a clean PNG card
- Try built-in presets: Sunset, Mediterranean, Forest

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) · TypeScript · Tailwind CSS v4
- Custom median-cut quantization on `<canvas>` `getImageData` — no `color-thief`
- [chroma-js](https://gka.github.io/chroma.js/) for harmony rotations
- [framer-motion](https://www.framer.com/motion/) for staggered entrances and
  the ambiance gradient transition
- [html2canvas](https://html2canvas.hertzen.com/) for the palette PNG export
- Deployed on [Vercel](https://vercel.com/)

## How extraction works

`src/lib/extract.ts` implements median-cut color quantization:

1. Render the image to a hidden 320×320-fit canvas and read pixels via
   `getImageData()`
2. Sample every Nth pixel to cap at ~10k samples
3. Start with one bucket of all sampled pixels
4. Repeatedly split the bucket with the largest channel range across the
   median of that channel until 8 buckets remain
5. Average each bucket → dominant color
6. Sort by relative luminance for stable display

It runs in milliseconds even for large photos and never leaves the browser.

## Run locally

```bash
git clone https://github.com/Vihan-G/colorpop.git
cd colorpop
npm install
npm run dev
```

Open <http://localhost:3000>.

## Layout

```
src/
  app/
    page.tsx               main page, all state lives here
    layout.tsx             fonts + metadata
    globals.css
  components/
    DropZone.tsx           drag-drop + click-to-upload + preview
    ImagePreview.tsx
    PaletteGrid.tsx
    ColorCard.tsx
    ColorDetail.tsx        modal/sheet with harmonies
    AmbianceBackground.tsx animated gradient that reacts to mood
    DownloadButton.tsx
    ExportCard.tsx         hidden node rendered to PNG
    ExamplePresets.tsx
    CopyToast.tsx
  lib/
    extract.ts             median-cut quantization
    ambiance.ts            HSL hue → mood gradient
    harmonies.ts           hue rotations via chroma-js
    export.ts              html2canvas PNG export
    presets.ts             built-in palettes
    types.ts
```
