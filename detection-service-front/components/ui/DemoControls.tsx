import type { DemoOutcome } from "@/lib/mocks/demoData";

interface DemoControlsProps {
  outcome: DemoOutcome;
  onOutcomeChange: (outcome: DemoOutcome) => void;
}

const OUTCOMES: Array<{ value: DemoOutcome; label: string }> = [
  { value: "success", label: "Success" },
  { value: "failure", label: "Failure" },
];

export function DemoControls({ outcome, onOutcomeChange }: DemoControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-200">
        Demo
      </span>
      <fieldset className="flex items-center gap-4">
        <legend className="sr-only">Demo outcome</legend>
        {OUTCOMES.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="demo-outcome"
              value={option.value}
              checked={outcome === option.value}
              onChange={() => onOutcomeChange(option.value)}
              className="accent-indigo-600"
            />
            <span className="text-zinc-700 dark:text-zinc-300">{option.label}</span>
          </label>
        ))}
      </fieldset>
      <p className="text-zinc-500 dark:text-zinc-400">
        Hard-coded data replaces the backend for preview.
      </p>
    </div>
  );
}