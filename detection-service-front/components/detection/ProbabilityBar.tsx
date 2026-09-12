import { formatProbability } from "@/lib/utils";

interface ProbabilityBarProps {
  aiProbability: number;
  humanProbability: number;
}

export function ProbabilityBar({
  aiProbability,
  humanProbability,
}: ProbabilityBarProps) {
  const ai = formatProbability(aiProbability);
  const human = formatProbability(humanProbability);
  const total = ai + human;
  const aiWidth = total === 0 ? 0 : (ai / total) * 100;
  const humanWidth = total === 0 ? 0 : (human / total) * 100;

  return (
    <div className="flex w-full items-center gap-2" aria-hidden="true">
      <span className="size-2 shrink-0 rounded-full bg-indigo-600" />
      <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="bg-indigo-600 transition-[width] duration-500"
          style={{ width: `${aiWidth}%` }}
        />
        <div
          className="bg-emerald-500 transition-[width] duration-500"
          style={{ width: `${humanWidth}%` }}
        />
      </div>
      <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
    </div>
  );
}