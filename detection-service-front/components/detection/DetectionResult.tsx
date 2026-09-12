import { Card } from "@/components/ui/Card";
import type {
  DetectionModel,
  DetectionResult as DetectionResultData,
} from "@/lib/types/detection";
import {
  cn,
  formatProbability,
  toConfidenceText,
  toLabelText,
} from "@/lib/utils";
import { ProbabilityBar } from "./ProbabilityBar";

const labelColor: Record<
  DetectionResultData["label"],
  string
> = {
  ai_generated: "text-indigo-700 dark:text-indigo-300",
  human_generated: "text-emerald-700 dark:text-emerald-300",
  uncertain: "text-amber-700 dark:text-amber-300",
};

interface DetectionResultProps {
  result: DetectionResultData;
  model?: DetectionModel;
  taskId?: string;
  className?: string;
}

export function DetectionResult({
  result,
  model,
  taskId,
  className,
}: DetectionResultProps) {
  const ai = formatProbability(result.ai_probability);
  const human = formatProbability(result.human_probability);

  return (
    <Card
      aria-live="polite"
      className={cn("p-5 sm:p-6", className)}
      data-testid="detection-result"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          className={cn(
            "text-xl font-semibold tracking-tight",
            labelColor[result.label]
          )}
        >
          {toLabelText(result.label)}
        </h2>
        {result.confidence && (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {toConfidenceText(result.confidence)}
          </span>
        )}
      </div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">
          AI-generated probability
        </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {ai}%
        </span>
      </div>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">
          Human-generated probability
        </span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {human}%
        </span>
      </div>
      <ProbabilityBar
        aiProbability={result.ai_probability}
        humanProbability={result.human_probability}
      />

      {result.reasoning ? (
        <div className="mt-5 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Reasoning
          </p>
          <p className="mt-1.5 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
            {result.reasoning}
          </p>
        </div>
      ) : null}

      {model || taskId ? (
        <dl className="mt-5 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
          {model && (
            <div className="flex items-center justify-between py-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Model</dt>
              <dd className="text-zinc-800 dark:text-zinc-100">
                {model.name} · v{model.version}
              </dd>
            </div>
          )}
          {taskId && (
            <div className="flex items-center justify-between py-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Request ID</dt>
              <dd className="font-mono text-xs text-zinc-600 dark:text-zinc-300">
                {taskId}
              </dd>
            </div>
          )}
        </dl>
      ) : null}

      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
        Detection results are model estimates and should not be treated as
        absolute proof.
      </p>
    </Card>
  );
}