"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ExtractedColor } from "@/lib/types";

interface Props {
  color: ExtractedColor;
  index: number;
  onCopy: (text: string, label: string) => void;
  onSelect: (color: ExtractedColor) => void;
}

function rgbString(c: ExtractedColor) {
  return `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`;
}

function hslString(c: ExtractedColor) {
  return `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`;
}

export default function ColorCard({ color, index, onCopy, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const labelLight = color.luminance < 0.45;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const copyHex = (e: React.MouseEvent) => {
    stop(e);
    onCopy(color.hex, `Copied ${color.hex}`);
  };

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(color)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="group relative flex w-full flex-col overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-white/40"
      aria-label={`Open details for ${color.hex}`}
    >
      <div
        className="relative flex aspect-[5/3] w-full items-end justify-end p-2"
        style={{ backgroundColor: color.hex }}
      >
        <div
          className={`flex gap-1 opacity-0 transition-opacity ${
            hovered ? "opacity-100" : ""
          }`}
        >
          {(
            [
              ["HEX", color.hex],
              ["RGB", rgbString(color)],
              ["HSL", hslString(color)],
            ] as const
          ).map(([label, value]) => (
            <button
              key={label}
              type="button"
              onClick={(e) => {
                stop(e);
                onCopy(value, `Copied ${value}`);
              }}
              className={`rounded-full px-2 py-0.5 font-mono text-[10px] tracking-tight backdrop-blur-md ${
                labelLight
                  ? "bg-white/85 text-black hover:bg-white"
                  : "bg-black/55 text-white hover:bg-black/75"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        onClick={copyHex}
        className="flex items-center justify-between gap-2 bg-[#111] px-3 py-2.5 text-left"
      >
        <span className="font-mono text-sm text-neutral-100 sm:text-base">
          {color.hex}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300">
          copy
        </span>
      </div>
    </motion.button>
  );
}
