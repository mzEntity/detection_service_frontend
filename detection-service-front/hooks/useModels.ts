"use client";

import { useEffect, useRef, useState } from "react";
import { getModels, toErrorMessage } from "@/lib/api";
import type {
  DetectionModelInfo,
  DetectionModality,
} from "@/lib/types/detection";

export type ModelsStatus = "loading" | "ready" | "error";

export function useModels(modality?: DetectionModality) {
  const [models, setModels] = useState<DetectionModelInfo[]>([]);
  const [status, setStatus] = useState<ModelsStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const seqRef = useRef(0);

  useEffect(() => {
    const seq = ++seqRef.current;

    const load = async () => {
      try {
        const catalog = await getModels(modality);
        if (seq !== seqRef.current) return;
        setModels(catalog.models);
        setStatus("ready");
        setError(null);
      } catch (err) {
        if (seq !== seqRef.current) return;
        setError(toErrorMessage(err));
        setStatus("error");
      }
    };

    void load();
  }, [modality]);

  return { models, status, error } as const;
}