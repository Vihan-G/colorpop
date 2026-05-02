"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import type { ExtractedColor } from "@/lib/types";
import { harmonyList } from "@/lib/harmonies";

interface Props {
  color: ExtractedColor | null;
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
}

function rgbString(c: ExtractedColor) {
  return `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`;
}

function hslString(c: ExtractedColor) {
  return `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`;
}

export default function ColorDetail({ color, onClose, onCopy }: Props) {
  useEffect(() => {
    if (!color) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [color, onClose]);

  return (
    <AnimatePresence>
      {color && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-t-2xl bg-neutral-950 ring-1 ring-white/10 sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2 py-1 text-xs text-white/80 backdrop-blur hover:bg-black/60"
            >
              ✕
            </button>
            <div
              className="h-40 w-full"
              style={{ backgroundColor: color.hex }}
            />
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-neutral-500">
                  Color
                </p>
                <p className="mt-1 font-mono text-2xl text-neutral-100">
                  {color.hex}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
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
                    onClick={() => onCopy(value, `Copied ${value}`)}
                    className="flex flex-col items-start rounded-lg bg-neutral-900 px-3 py-2 text-left ring-1 ring-white/5 transition-colors hover:bg-neutral-800"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                      {label}
                    </span>
                    <span className="mt-1 font-mono text-sm text-neutral-100">
                      {value}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <p className="mb-2 text-[11px] uppercase tracking-widest text-neutral-500">
                  Harmonies
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {harmonyList(color.hex).map((h) => (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => onCopy(h.hex, `Copied ${h.hex}`)}
                      title={`${h.label} — ${h.hex}`}
                      className="group flex flex-col items-center"
                    >
                      <span
                        className="block h-10 w-full rounded-md ring-1 ring-white/5 transition-transform group-hover:-translate-y-0.5"
                        style={{ backgroundColor: h.hex }}
                      />
                      <span className="mt-1 font-mono text-[10px] text-neutral-400">
                        {h.hex}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-lg bg-white/10 py-2.5 text-sm font-medium text-neutral-100 ring-1 ring-white/10 hover:bg-white/15"
              >
                Add to palette
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
