import {
  DEMO_FAILURE_IMAGE,
  DEMO_FAILURE_TEXT,
  DEMO_FAILURE_VIDEO,
  DEMO_SUCCESS_IMAGE,
  DEMO_SUCCESS_TEXT,
  DEMO_SUCCESS_VIDEO,
  type DemoOutcome,
} from "./demoData";
import type {
  DetectionModality,
  DetectionModelInfo,
  DetectionResponse,
  ModelCatalogResponse,
} from "@/lib/types/detection";

const MOCK_MODEL_CATALOG: DetectionModelInfo[] = [
  { name: "text-detector", version: "1.0.0", modality: "text" },
  { name: "image-detector", version: "1.0.0", modality: "image" },
  { name: "video-detector", version: "1.0.0", modality: "video" },
];

interface MockTaskState {
  modality: DetectionModality;
  model: string;
  outcome: DemoOutcome;
  createdAt: number;
}

const mockTasks = new Map<string, MockTaskState>();

let mockTaskSeq = 0;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function mockGetModels(
  modality?: DetectionModality
): Promise<ModelCatalogResponse> {
  await wait(400);
  const models = modality
    ? MOCK_MODEL_CATALOG.filter((model) => model.modality === modality)
    : MOCK_MODEL_CATALOG;
  return { models };
}

export interface MockCreateTaskInput {
  modality: DetectionModality;
  model: string;
  outcome: DemoOutcome;
}

export async function mockCreateDetectionTask(
  input: MockCreateTaskInput
): Promise<DetectionResponse> {
  await wait(800);
  mockTaskSeq += 1;
  const id = `mock_${String(mockTaskSeq).padStart(4, "0")}`;
  mockTasks.set(id, {
    modality: input.modality,
    model: input.model,
    outcome: input.outcome,
    createdAt: Date.now(),
  });
  return {
    id,
    modality: input.modality,
    status: "queued",
    model: { name: input.model, version: "1.0.0" },
  };
}

export async function mockGetDetectionTask(
  id: string
): Promise<DetectionResponse> {
  await wait(150);
  const task = mockTasks.get(id);
  if (!task) {
    return {
      id,
      modality: "text",
      status: "failed",
      error: { code: "not_found", message: "Task not found." },
    };
  }

  const model = { name: task.model, version: "1.0.0" };
  const elapsed = Date.now() - task.createdAt;

  if (elapsed < 1200) {
    return { id, modality: task.modality, status: "queued", model };
  }
  if (elapsed < 2600) {
    return { id, modality: task.modality, status: "processing", model };
  }

  const demo = pickDemo(task.modality, task.outcome);
  return { ...demo, id, model };
}

function pickDemo(
  modality: DetectionModality,
  outcome: DemoOutcome
): DetectionResponse {
  if (modality === "text") {
    return outcome === "success" ? DEMO_SUCCESS_TEXT : DEMO_FAILURE_TEXT;
  }
  if (modality === "image") {
    return outcome === "success" ? DEMO_SUCCESS_IMAGE : DEMO_FAILURE_IMAGE;
  }
  return outcome === "success" ? DEMO_SUCCESS_VIDEO : DEMO_FAILURE_VIDEO;
}