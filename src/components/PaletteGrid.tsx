"use client";

import ColorCard from "./ColorCard";
import type { ExtractedColor } from "@/lib/types";

interface Props {
  palette: ExtractedColor[];
  onCopy: (text: string, label: string) => void;
  onSelect: (color: ExtractedColor) => void;
}

export default function PaletteGrid({ palette, onCopy, onSelect }: Props) {
  if (palette.length === 0) return null;
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {palette.map((c, i) => (
        <ColorCard
          key={`${c.hex}-${i}`}
          color={c}
          index={i}
          onCopy={onCopy}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
