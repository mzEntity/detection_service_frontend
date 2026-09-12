interface ModelOption {
  value: string;
  label: string;
}

interface DetectionModelSelectProps {
  model: string;
  onModelChange: (value: string) => void;
  modelOptions: readonly ModelOption[];
  disabled?: boolean;
  className?: string;
}

export function DetectionModelSelect({
  model,
  onModelChange,
  modelOptions,
  disabled = false,
  className,
}: DetectionModelSelectProps) {
  return (
    <div className={className}>
      <label
        htmlFor="detection-model"
        className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
        Detection model
      </label>
      <select
        id="detection-model"
        value={model}
        onChange={(event) => onModelChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-2 focus:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {modelOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}