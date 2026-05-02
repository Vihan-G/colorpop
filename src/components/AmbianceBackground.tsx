"use client";

import { motion } from "framer-motion";
import type { Ambiance } from "@/lib/types";

interface Props {
  ambiance: Ambiance;
}

export default function AmbianceBackground({ ambiance }: Props) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      animate={{
        background: `linear-gradient(160deg, ${ambiance.fromColor} 0%, ${ambiance.viaColor} 55%, ${ambiance.toColor} 100%)`,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
}
