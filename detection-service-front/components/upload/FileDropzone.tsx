"use client";

import { useId, useState, type DragEvent } from "react";
import { cn, formatFileSize } from "@/lib/utils";

interface FileDropzoneProps {
  accept: readonly string[];
  file: File | null;
  error: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  disabled?: boolean;
  hint?: string;
  extraInfo?: string;
}

export function FileDropzone({
  accept,
  file,
  error,
  onSelect,
  onClear,
  disabled = false,
  hint = "Drop a file here",
  extraInfo,
}: FileDropzoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const grabFile = (files: FileList | null) => {
    const candidate = files?.[0] ?? null;
    if (candidate) {
      onSelect(candidate);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      grabFile(event.dataTransfer.files);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors dark:border-zinc-700 dark:bg-zinc-900",
          isDragging &&
            "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {file ? (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {file.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                {formatFileSize(file.size)}
                {file.type ? ` · ${file.type}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <label
                htmlFor={inputId}
                className="cursor-pointer rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Replace
              </label>
              <button
                type="button"
                onClick={onClear}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 p-8 text-center"
          >
            <span className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              {hint}{" "}
              <span className="font-normal text-indigo-600 dark:text-indigo-400">
                or click to browse
              </span>
            </span>
            {extraInfo ? (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {extraInfo}
              </span>
            ) : null}
          </label>
        )}
        <input
          id={inputId}
          type="file"
          accept={accept.join(",")}
          disabled={disabled}
          onChange={(event) => {
            grabFile(event.target.files);
            event.target.value = "";
          }}
          className="sr-only"
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}