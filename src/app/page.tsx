"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ColorDetail from "@/components/ColorDetail";
import CopyToast from "@/components/CopyToast";
import DropZone from "@/components/DropZone";
import PaletteGrid from "@/components/PaletteGrid";
import { extractColors } from "@/lib/extract";
import type { ExtractedColor } from "@/lib/types";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<ExtractedColor | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }, []);

  const handleCopy = useCallback(
    async (text: string, label: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showToast(label);
      } catch {
        showToast("Copy failed");
      }
    },
    [showToast],
  );

  const handleSelect = useCallback((color: ExtractedColor) => {
    setSelected(color);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

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
          <PaletteGrid
            palette={palette}
            onCopy={handleCopy}
            onSelect={handleSelect}
          />
        </section>
      )}

      <ColorDetail
        color={selected}
        onClose={() => setSelected(null)}
        onCopy={handleCopy}
      />

      <CopyToast message={toast} />
    </main>
  );
}
