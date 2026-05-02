# colorpop — CLAUDE.md

Inherit all rules from /Users/vihangoenka/claudeprojects/CLAUDE.md.

---

## What we're building

**colorpop** — Drop any image. Get its color palette instantly.

Upload an image → extract the 8 dominant colors using canvas pixel sampling →
see hex, RGB, HSL for each → one-click copy any value → download the palette
as a PNG swatch card.

The defining feature: the UI itself reacts to the uploaded image. The background
gradient shifts to match the dominant color family of the image. Upload a sunset,
the interface goes warm. Upload an ocean photo, it shifts cool. The tool becomes
the palette.

Target users: designers picking brand colors, developers building UIs, photographers
finding their image's color story, anyone who sees a color somewhere and needs to
know what it is. That's a massive audience.

No API key. No backend. Pure client-side canvas math.

---

## Tech stack

- Next.js 14, App Router, TypeScript, Tailwind, src/ layout
- `color-thief` equivalent — implement k-means color extraction natively using canvas
  (do NOT use the color-thief npm package — implement it ourselves for learning value
  and GitHub credibility. Use canvas getImageData + a clean k-means implementation.)
- `chroma-js` — for color conversions and harmony generation
- `framer-motion` — for palette card animations
- `html2canvas` — for downloading palette as PNG

```bash
npm install chroma-js @types/chroma-js framer-motion html2canvas
```

---

## Core algorithm (lib/extract.ts)

Implement median cut color quantization (simpler and faster than k-means for this use case):

```typescript
// 1. Load image onto a hidden canvas
// 2. getImageData() — get all pixels as RGBA array
// 3. Sample every Nth pixel (N = Math.floor(pixelCount / 10000)) to cap at ~10k samples
// 4. Run median cut algorithm to find 8 dominant colors:
//    - Start with all pixels in one "bucket"
//    - Find the channel (R, G, or B) with the largest range in the bucket
//    - Sort by that channel, split at median
//    - Repeat until you have 8 buckets
//    - Average each bucket → dominant color
// 5. Sort resulting colors by perceived brightness (luminance)
// 6. Return as array of { hex, rgb, hsl } objects

export interface ExtractedColor {
  hex: string           // "#3b82f6"
  rgb: { r: number, g: number, b: number }
  hsl: { h: number, s: number, l: number }
  luminance: number     // 0-1, used for text contrast decisions
  population: number    // approximate % of image this color represents
}

export async function extractColors(imageElement: HTMLImageElement): Promise<ExtractedColor[]>
```

---

## Background reaction logic (lib/ambiance.ts)

```typescript
// After extraction, compute the "dominant mood" of the palette:
// 1. Take the most populated color
// 2. Get its HSL hue
// 3. Map hue ranges to mood gradients:
//    0-30 or 330-360 (reds/pinks) → warm: "from-rose-950 via-neutral-950 to-neutral-950"
//    30-70 (oranges/yellows) → golden: "from-amber-950 via-neutral-950 to-neutral-950"
//    70-150 (greens) → nature: "from-emerald-950 via-neutral-950 to-neutral-950"
//    150-250 (blues/cyans) → cool: "from-blue-950 via-neutral-950 to-neutral-950"
//    250-330 (purples/magentas) → royal: "from-violet-950 via-neutral-950 to-neutral-950"
//    low saturation (<15%) → neutral: "from-neutral-900 via-neutral-950 to-neutral-950"
// 4. Animate the gradient transition using framer-motion on the page background
```

---

## File structure

```
src/
  app/
    page.tsx                    ← main page, all state lives here
    layout.tsx
    globals.css
  components/
    DropZone.tsx                ← drag-drop + click-to-upload, image preview
    ColorCard.tsx               ← one color swatch with copy actions
    PaletteGrid.tsx             ← 8 color cards in an animated grid
    ColorDetail.tsx             ← expanded view: hex, rgb, hsl, harmonies
    DownloadButton.tsx          ← exports palette as PNG swatch card
    ImagePreview.tsx            ← shows uploaded image with subtle treatment
    CopyToast.tsx               ← minimal toast on copy success
  lib/
    extract.ts                  ← median cut algorithm
    ambiance.ts                 ← dominant mood → background gradient
    harmonies.ts                ← compute complementary, analogous, triadic
    export.ts                   ← html2canvas palette PNG export
    types.ts                    ← ExtractedColor, Harmony interfaces
```

---

## UI design — this is the most important section

**The aesthetic: dark, minimal, color-forward. The colors ARE the UI.**

Base (before image upload):
- Background: `#0c0c0c`
- No gradient yet — flat dark
- Centered upload zone with dashed border, subtle pulse animation

After upload:
- Background transitions to the mood gradient (framer-motion animate)
- Transition duration: 800ms, ease-in-out
- The gradient is always dark — it adds color warmth without fighting the content

**DropZone:**
- Large centered zone, dashed `#333` border, rounded-2xl
- On hover: border brightens to `#555`, subtle scale 1.01
- Dragging over: border becomes the accent color (use first extracted color)
- Shows image preview after upload — image fills the zone, 
  rounded corners, slight vignette overlay
- Small "upload different image" button appears on hover over the preview

**PaletteGrid:**
- 8 cards in a 4×2 grid on desktop, 2×4 on mobile
- Cards animate in sequentially with stagger (0.06s between each)
- framer-motion: opacity 0→1, y: 20→0

**ColorCard:**
- Top 60% = solid color swatch
- Bottom 40% = dark surface `#111` with:
  - Hex code in monospace, large, easy to read
  - "Copy hex" on hover — the whole card becomes slightly interactive
- On click → copies hex to clipboard, shows CopyToast
- On hover → reveals three copy options: HEX | RGB | HSL as small pill buttons
- White or black label text based on luminance (use luminance field to decide)

**ColorDetail (click a card to expand):**
- Slide-up panel or modal
- Shows: large swatch, hex, rgb values, hsl values
- Shows 3 color harmonies: complementary, analogous (2), triadic (2)
- Each harmony color is a small clickable swatch
- "Add to palette" — doesn't need to do anything in v1, just looks good

**DownloadButton:**
- Fixed bottom-right when palette is visible
- Dark pill button: "↓ Download palette"
- Exports a PNG: 8 swatches side by side, hex code below each, "colorpop" watermark bottom right
- Use html2canvas on a hidden div that renders the export layout

**CopyToast:**
- Bottom center, appears for 1.5s
- Shows the copied value: "Copied #3b82f6"
- Subtle blur background, not a full card

**Typography:**
- Headlines: Inter, tight tracking
- Color values: JetBrains Mono (load via next/font)
- All text white or near-white — nothing dark on dark

**Empty state (before upload):**
- Show 3 example palettes as static demonstrations — makes the tool self-explanatory
- Use beautiful real-world palettes: a sunset, an ocean scene, a forest
- Clicking one loads those colors without an actual image
- Label them: "Sunset · Mediterranean · Forest"

---

## Harmonies (lib/harmonies.ts)

Using chroma-js:
```typescript
// Given a hex color, return:
// complementary: rotate hue by 180°
// analogous: rotate hue by ±30°
// triadic: rotate hue by ±120°
// All clamped to valid HSL range
```

---

## Export PNG layout (hidden div for html2canvas)

```
┌──────────────────────────────────────────────────────┐
│  [swatch1] [swatch2] [swatch3] [swatch4]             │
│  [swatch5] [swatch6] [swatch7] [swatch8]             │
│  #hex1     #hex2     #hex3     #hex4                  │
│  #hex5     #hex6     #hex7     #hex8                  │
│                                          colorpop     │
└──────────────────────────────────────────────────────┘
Dark background, swatches are 80×80px squares, 16px gap
```

---

## Setup commands

```bash
cd /Users/vihangoenka/claudeprojects

npx create-next-app@latest colorpop --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint

cd colorpop

npm install chroma-js @types/chroma-js framer-motion html2canvas

git init
git add .
git commit -m "chore: initial scaffold"
gh repo create colorpop --public --source=. --remote=origin --push
vercel --yes
touch .env.local
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: gitignore"
git push origin main
```

---

## Milestone commits (one session, all 8)

1. `chore: types and median cut color extraction algorithm`
2. `chore: ambiance gradient logic and harmony generator`
3. `feat: dropzone with drag-drop and image preview`
4. `feat: palette grid with animated color cards and copy`
5. `feat: color detail panel with harmonies`
6. `feat: background ambiance reaction and copy toast`
7. `feat: palette PNG export and example presets`
8. `feat: polish, responsive layout, SEO metadata`

After commit 8:
```bash
vercel --prod
gh release create v1.0.0 --title "colorpop v1.0.0" --notes "Drop any image. Get its color palette instantly. The interface reacts to your image's mood."
gh repo edit --add-topic color --add-topic design --add-topic nextjs --add-topic typescript --add-topic tools --add-topic palette
```

---

## What done looks like

- Drop an image → 8 colors appear with staggered animation
- Background smoothly shifts to match the image mood
- Click any swatch → see hex, rgb, hsl, copy any format
- Download button exports a clean palette PNG
- Example presets work without uploading anything
- Works perfectly on mobile
- Looks like something a senior designer built as a side project
- Not a tutorial project. An actual tool.
