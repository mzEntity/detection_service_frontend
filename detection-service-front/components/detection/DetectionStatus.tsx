import { Spinner } from "@/components/ui/Spinner";
import { UploadProgress } from "@/components/upload/UploadProgress";
import type { DetectionStatus as DetectionStatusType } from "@/lib/types/detection";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
  DetectionStatusType,
  { text: string; accent: string; active: boolean }
> = {
  queued: {
    text: "Waiting in queue",
    accent: "text-amber-600 dark:text-amber-400",
    active: true,
  },
  processing: {
    text: "Processing",
    accent: "text-sky-600 dark:text-sky-400",
    active: true,
  },
  completed: {
    text: "Detection complete",
    accent: "text-emerald-600 dark:text-emerald-400",
    active: false,
  },
  failed: {
    text: "Detection failed",
    accent: "text-red-600 dark:text-red-400",
    active: false,
  },
};

interface DetectionStatusProps {
  status: DetectionStatusType;
  progress?: number;
  label?: string;
  className?: string;
}

export function DetectionStatus({
  status,
  progress,
  label,
  className,
}: DetectionStatusProps) {
  const meta = STATUS_META[status];
  const showBar = typeof progress === "number";

  return (
    <div
      aria-live="polite"
      className={cn(
        "rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900",
        className
      )}
    >
      {showBar ? (
        <UploadProgress progress={progress} statusText={label ?? meta.text} />
      ) : (
        <div className="flex items-center gap-2 text-sm font-medium">
          {meta.active && <Spinner />}
          <span className={meta.accent}>{label ?? meta.text}</span>
        </div>
      )}
    </div>
  );
}