"use client";

import { useCallback, useId, useRef, useState } from "react";
import ImagePreview from "./ImagePreview";

interface Props {
  imageSrc: string | null;
  accentColor?: string | null;
  onImageReady: (img: HTMLImageElement, src: string) => void;
  onReset: () => void;
}

export default function DropZone({
  imageSrc,
  accentColor,
  onImageReady,
  onReset,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.type.startsWith("image/")) {
        setError("Please drop an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const src = String(reader.result);
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => onImageReady(img, src);
        img.onerror = () => setError("Could not load that image.");
        img.src = src;
      };
      reader.onerror = () => setError("Could not read that file.");
      reader.readAsDataURL(file);
    },
    [onImageReady],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const dashed = isDragging
    ? "border-solid"
    : "border-dashed border-neutral-700 hover:border-neutral-500";
  const accentStyle =
    isDragging && accentColor
      ? { borderColor: accentColor }
      : undefined;

  if (imageSrc) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <ImagePreview
          src={imageSrc}
          onReset={() => {
            onReset();
            inputRef.current?.click();
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        style={accentStyle}
        className={`pulse-soft flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 ${dashed} bg-neutral-950/40 px-6 text-center transition-all hover:scale-[1.005]`}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-2xl">
          ↑
        </div>
        <p className="text-base font-medium text-neutral-200 sm:text-lg">
          Drop an image here
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          or click to upload — JPG, PNG, WebP
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>
      {error && (
        <p className="mt-3 text-center text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
}
