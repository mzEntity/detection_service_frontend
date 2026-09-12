"use client";

import { useCallback, useState } from "react";
import { DetectionContextInput } from "@/components/detection/DetectionContextInput";
import { DetectionModelSelect } from "@/components/detection/DetectionModelSelect";
import { DetectionResult } from "@/components/detection/DetectionResult";
import { DetectionStatus } from "@/components/detection/DetectionStatus";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DemoControls } from "@/components/ui/DemoControls";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Spinner } from "@/components/ui/Spinner";
import { FileDropzone } from "@/components/upload/FileDropzone";
import { useDetectionTask } from "@/hooks/useDetectionTask";
import { useModels } from "@/hooks/useModels";
import { useUpload } from "@/hooks/useUpload";
import { createVideoDetection } from "@/lib/api";
import { USE_MOCKS, VIDEO_ACCEPTED_TYPES, VIDEO_MAX_SIZE_BYTES } from "@/lib/constants";
import { mockCreateDetectionTask } from "@/lib/mocks/api";
import type { DemoOutcome } from "@/lib/mocks/demoData";

const VIDEO_FORMATS_TEXT = "MP4, WebM, MOV";
const VIDEO_SIZE_TEXT = "Up to 500 MB";

export default function VideoDetectionPage() {
  const { models, status: modelsStatus, error: modelsError } = useModels("video");
  const { file, error: fileError, handleFile, clearFile } = useUpload({
    accept: VIDEO_ACCEPTED_TYPES,
    maxSizeBytes: VIDEO_MAX_SIZE_BYTES,
  });

  const [userSelectedModel, setUserSelectedModel] = useState("");
  const [context, setContext] = useState("");
  const [outcome, setOutcome] = useState<DemoOutcome>("success");

  const task = useDetectionTask();

  const isBusy =
    task.status === "starting" ||
    task.status === "queued" ||
    task.status === "processing";

  const selectedModel = models.some((m) => m.name === userSelectedModel)
    ? userSelectedModel
    : (models[0]?.name ?? "");

  const modelOptions = models.map((model) => ({
    value: model.name,
    label: `${model.name} v${model.version}`,
  }));

  const createTask = useCallback(() => {
    if (USE_MOCKS) {
      return mockCreateDetectionTask({
        modality: "video",
        model: selectedModel,
        outcome,
      });
    }
    if (!file) {
      return Promise.reject(new Error("No video selected."));
    }
    return createVideoDetection({ model: selectedModel, context, file });
  }, [selectedModel, context, file, outcome]);

  const handleSelectFile = (candidate: File) => {
    if (isBusy) {
      return;
    }
    task.cancel();
    handleFile(candidate);
  };

  const handleClearFile = () => {
    if (isBusy) {
      return;
    }
    task.cancel();
    clearFile();
  };

  const handleStart = () => {
    if (isBusy || !file) {
      return;
    }
    task.begin(createTask);
  };

  const failureMessage = task.error ?? task.response?.error?.message ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Video Detection
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Upload a video and follow an asynchronous analysis task through
          submission, queueing, and processing.
        </p>
      </header>

      {USE_MOCKS && <DemoControls outcome={outcome} onOutcomeChange={setOutcome} />}

      <Card className="mt-6 p-4 sm:p-5">
        <div className="mb-4">
          {modelsStatus === "loading" ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Spinner /> Loading models…
            </div>
          ) : modelsStatus === "error" ? (
            <ErrorAlert message={modelsError ?? "Failed to load models."} />
          ) : models.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No video detection models are available.
            </p>
          ) : (
            <DetectionModelSelect
              model={selectedModel}
              onModelChange={setUserSelectedModel}
              modelOptions={modelOptions}
              disabled={isBusy}
            />
          )}
        </div>

        <FileDropzone
          accept={VIDEO_ACCEPTED_TYPES}
          file={file}
          error={fileError}
          onSelect={handleSelectFile}
          onClear={handleClearFile}
          disabled={isBusy}
          hint="Drop a video"
          extraInfo={`${VIDEO_FORMATS_TEXT} · ${VIDEO_SIZE_TEXT}`}
        />

        <DetectionContextInput
          context={context}
          onContextChange={setContext}
          disabled={isBusy}
          className="mt-4"
        />
      </Card>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          onClick={handleStart}
          disabled={!file || isBusy || modelsStatus !== "ready" || selectedModel === ""}
          isLoading={isBusy}
        >
          {task.status === "starting" ? "Uploading…" : isBusy ? "Analyzing…" : "Analyze video"}
        </Button>
        {isBusy && (
          <Button variant="ghost" onClick={task.cancel}>
            Cancel
          </Button>
        )}
        {(task.status === "completed" || task.status === "failed") && (
          <Button variant="ghost" onClick={handleClearFile}>
            New analysis
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {task.status === "starting" && (
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Spinner /> Uploading video…
          </div>
        )}
        {(task.status === "queued" || task.status === "processing") && (
          <DetectionStatus
            status={task.status}
            label={
              task.status === "queued"
                ? "Waiting in queue…"
                : "Analyzing video frames…"
            }
          />
        )}
        {task.status === "completed" && task.response?.result && (
          <DetectionResult
            result={task.response.result}
            model={task.response.model}
            taskId={task.response.id}
          />
        )}
        {task.status === "failed" && failureMessage && (
          <ErrorAlert message={failureMessage} onDismiss={handleClearFile} />
        )}
      </div>
    </div>
  );
}