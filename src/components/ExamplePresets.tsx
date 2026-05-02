"use client";

import { PRESETS, type Preset } from "@/lib/presets";

interface Props {
  onSelect: (preset: Preset) => void;
}

export default function ExamplePresets({ onSelect }: Props) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-3 text-center text-[11px] uppercase tracking-widest text-neutral-500">
        Or try a preset
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className="group flex flex-col rounded-xl bg-neutral-950/60 p-2.5 ring-1 ring-white/5 transition-all hover:-translate-y-0.5 hover:ring-white/15"
          >
            <div className="flex h-10 w-full overflow-hidden rounded-md">
              {preset.hexes.map((hex, i) => (
                <span
                  key={`${preset.id}-${i}`}
                  className="block h-full flex-1"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <span className="mt-2 text-sm font-medium text-neutral-200 group-hover:text-white">
              {preset.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
