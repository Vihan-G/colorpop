"use client";

import { forwardRef } from "react";
import type { ExtractedColor } from "@/lib/types";

interface Props {
  palette: ExtractedColor[];
}

const ExportCard = forwardRef<HTMLDivElement, Props>(function ExportCard(
  { palette },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        width: 800,
        padding: 32,
        backgroundColor: "#0c0c0c",
        color: "#fafafa",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {palette.slice(0, 8).map((c, i) => (
          <div key={`${c.hex}-${i}`} style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                height: 120,
                borderRadius: 12,
                backgroundColor: c.hex,
              }}
            />
            <div
              style={{
                marginTop: 10,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 14,
                color: "#e5e5e5",
              }}
            >
              {c.hex}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: "flex-end",
          fontSize: 13,
          color: "#a3a3a3",
          letterSpacing: "0.05em",
        }}
      >
        colorpop
      </div>
    </div>
  );
});

export default ExportCard;
