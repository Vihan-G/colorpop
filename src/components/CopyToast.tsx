"use client";

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  message: string | null;
}

export default function CopyToast({ message }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center"
        >
          <div className="rounded-full bg-white/10 px-4 py-2 font-mono text-xs text-neutral-100 backdrop-blur-md ring-1 ring-white/10">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
