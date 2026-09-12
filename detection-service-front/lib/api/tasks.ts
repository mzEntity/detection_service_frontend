import { apiRequest } from "./client";
import { USE_MOCKS } from "@/lib/constants";
import { mockGetDetectionTask } from "@/lib/mocks/api";
import type { DetectionResponse } from "@/lib/types/detection";

export interface CreateTaskInput {
  model: string;
  context?: string;
  text?: string;
  file?: File;
}

function buildFormData(input: CreateTaskInput): FormData {
  const formData = new FormData();
  if (input.file) {
    formData.append("file", input.file);
  }
  formData.append("model", input.model);
  if (input.context) {
    formData.append("context", input.context);
  }
  return formData;
}

export function createTextDetection(
  input: Omit<CreateTaskInput, "file">
): Promise<DetectionResponse> {
  return apiRequest<DetectionResponse>("/detections/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: input.model,
      ...(input.context ? { context: input.context } : {}),
      text: input.text,
    }),
  });
}

export function createImageDetection(
  input: CreateTaskInput
): Promise<DetectionResponse> {
  return apiRequest<DetectionResponse>("/detections/image", {
    method: "POST",
    body: buildFormData(input),
  });
}

export function createVideoDetection(
  input: CreateTaskInput
): Promise<DetectionResponse> {
  return apiRequest<DetectionResponse>("/detections/video", {
    method: "POST",
    body: buildFormData(input),
  });
}

export function getDetectionTask(id: string): Promise<DetectionResponse> {
  if (USE_MOCKS) {
    return mockGetDetectionTask(id);
  }
  return apiRequest<DetectionResponse>(`/tasks/${encodeURIComponent(id)}`);
}