"use client";

import { useState } from "react";
import DropZone from "@/components/DropZone";
import { extractColors } from "@/lib/extract";
import type { ExtractedColor } from "@/lib/types";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleImageReady = async (img: HTMLImageElement, src: string) => {
    setImageSrc(src);
    setIsExtracting(true);
    try {
      const colors = await extractColors(img, 8);
      setPalette(colors);
    } catch (e) {
      console.error(e);
      setPalette([]);
    } finally {
      setIsExtracting(false);
    }
  };

  const reset = () => {
    setImageSrc(null);
    setPalette([]);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-5 py-12 sm:px-8 sm:py-20">
      <header className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          colorpop
        </h1>
        <p className="mt-2 text-sm text-neutral-400 sm:text-base">
          Drop an image. Get its palette.
        </p>
      </header>

      <section className="mx-auto w-full max-w-xl">
        <DropZone
          imageSrc={imageSrc}
          accentColor={palette[0]?.hex ?? null}
          onImageReady={handleImageReady}
          onReset={reset}
        />
        {isExtracting && (
          <p className="mt-4 text-center text-sm text-neutral-500">
            Extracting colors…
          </p>
        )}
      </section>

      {palette.length > 0 && (
        <section className="mx-auto w-full">
          <ul className="grid grid-cols-4 gap-3 font-mono text-xs sm:grid-cols-8">
            {palette.map((c) => (
              <li
                key={c.hex}
                className="aspect-square rounded-lg ring-1 ring-white/5"
                style={{ backgroundColor: c.hex }}
                title={c.hex}
              />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
