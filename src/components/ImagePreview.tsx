"use client";

import Image from "next/image";

interface Props {
  src: string;
  onReset: () => void;
}

export default function ImagePreview({ src, onReset }: Props) {
  return (
    <div className="group relative h-full w-full overflow-hidden rounded-2xl">
      <Image
        src={src}
        alt="Uploaded"
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-cover"
        unoptimized
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      <button
        type="button"
        onClick={onReset}
        className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 group-hover:opacity-100 focus-visible:opacity-100"
      >
        Upload different image
      </button>
    </div>
  );
}
