import { CONTEXT_MAX_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DetectionContextInputProps {
  context: string;
  onContextChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DetectionContextInput({
  context,
  onContextChange,
  disabled = false,
  className,
}: DetectionContextInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor="detection-context"
        className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
        Supplementary info{" "}
        <span className="font-normal text-zinc-400 dark:text-zinc-500">
          (optional)
        </span>
      </label>
      <textarea
        id="detection-context"
        value={context}
        onChange={(event) => onContextChange(event.target.value)}
        rows={4}
        maxLength={CONTEXT_MAX_LENGTH}
        placeholder="Source, background, or any extra details about the content…"
        disabled={disabled}
        aria-describedby="detection-context-help"
        className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-2 focus:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <p id="detection-context-help">
          Optional context you provide to help the analysis.
        </p>
        <span
          className={cn(
            context.length >= CONTEXT_MAX_LENGTH
              ? "font-medium text-amber-600 dark:text-amber-400"
              : undefined
          )}
        >
          {context.length} / {CONTEXT_MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}