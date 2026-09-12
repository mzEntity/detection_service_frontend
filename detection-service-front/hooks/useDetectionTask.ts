"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDetectionTask, toErrorMessage } from "@/lib/api";
import { TASK_POLL_INTERVAL_MS } from "@/lib/constants";
import type {
  DetectionResponse,
  DetectionStatus,
} from "@/lib/types/detection";

type TaskStatus = "idle" | "starting" | DetectionStatus;

interface UseDetectionTaskResult {
  status: TaskStatus;
  response: DetectionResponse | null;
  error: string | null;
  begin: (createTask: () => Promise<DetectionResponse>) => void;
  cancel: () => void;
}

function isTerminal(status: DetectionStatus): boolean {
  return status === "completed" || status === "failed";
}

export function useDetectionTask(): UseDetectionTaskResult {
  const [status, setStatus] = useState<TaskStatus>("idle");
  const [response, setResponse] = useState<DetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seqRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const invalidate = useCallback(() => {
    seqRef.current += 1;
    stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    return () => {
      invalidate();
    };
  }, [invalidate]);

  const cancel = useCallback(() => {
    invalidate();
    setStatus("idle");
    setResponse(null);
    setError(null);
  }, [invalidate]);

  const begin = useCallback(
    (createTask: () => Promise<DetectionResponse>) => {
      invalidate();
      const seq = seqRef.current;
      setError(null);
      setResponse(null);
      setStatus("starting");

      createTask()
        .then((initial) => {
          if (seq !== seqRef.current) return;
          setResponse(initial);

          if (isTerminal(initial.status)) {
            setStatus(initial.status);
            return;
          }

          setStatus(initial.status);
          const taskId = initial.id;

          timerRef.current = setInterval(() => {
            if (seq !== seqRef.current) return;
            void getDetectionTask(taskId)
              .then((snapshot) => {
                if (seq !== seqRef.current) return;
                setResponse(snapshot);
                setStatus(snapshot.status);
                if (isTerminal(snapshot.status)) {
                  stopPolling();
                }
              })
              .catch(() => {
                if (seq !== seqRef.current) return;
              });
          }, TASK_POLL_INTERVAL_MS);
        })
        .catch((err) => {
          if (seq !== seqRef.current) return;
          setError(toErrorMessage(err));
          setStatus("failed");
        });
    },
    [invalidate, stopPolling]
  );

  return { status, response, error, begin, cancel };
}