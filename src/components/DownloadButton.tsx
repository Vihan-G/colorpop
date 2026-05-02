"use client";

import { useState } from "react";
import { exportNodeToPng } from "@/lib/export";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
}

export default function DownloadButton({
  targetRef,
  filename = "colorpop-palette.png",
}: Props) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (!targetRef.current || busy) return;
    setBusy(true);
    try {
      await exportNodeToPng(targetRef.current, filename);
    } catch (e) {
      console.error("Failed to export palette PNG", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="fixed bottom-6 right-6 z-30 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-neutral-100 backdrop-blur-md ring-1 ring-white/15 transition-all hover:bg-white/15 disabled:opacity-50"
    >
      {busy ? "Rendering…" : "↓ Download palette"}
    </button>
  );
}
