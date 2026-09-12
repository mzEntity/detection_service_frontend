import { cn } from "@/lib/utils";

interface UploadProgressProps {
  progress: number;
  statusText?: string;
  className?: string;
}

export function UploadProgress({
  progress,
  statusText = "Uploading\u2026",
  className,
}: UploadProgressProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-700 dark:text-zinc-300">{statusText}</span>
        <span className="font-medium text-zinc-600 dark:text-zinc-400">
          {Math.round(clamped)}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={statusText}
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-[width] duration-200"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}