import type { DetectionResponse } from "@/lib/types/detection";

export type DemoOutcome = "success" | "failure";

export const DEMO_SUCCESS_TEXT: DetectionResponse = {
  id: "demo_text_001",
  modality: "text",
  status: "completed",
  result: {
    label: "ai_generated",
    ai_probability: 0.93,
    human_probability: 0.07,
    confidence: "high",
    reasoning:
      "The text shows uniformly polished sentence structures, consistent tone throughout, and a high density of formulaic transition phrases — patterns commonly associated with large language models.",
  },
  model: {
    name: "text-detector",
    version: "1.0.0",
  },
};

export const DEMO_FAILURE_TEXT: DetectionResponse = {
  id: "demo_text_002",
  modality: "text",
  status: "failed",
  error: {
    code: "service_unavailable",
    message:
      "The text detection service is temporarily unavailable. Please try again in a moment.",
  },
};

export const DEMO_SUCCESS_IMAGE: DetectionResponse = {
  id: "demo_image_001",
  modality: "image",
  status: "completed",
  result: {
    label: "human_generated",
    ai_probability: 0.12,
    human_probability: 0.88,
    confidence: "medium",
    reasoning:
      "The image contains natural lighting gradients and sensor noise that synthetic generators rarely reproduce. Small inconsistencies are consistent with an authentic camera capture.",
  },
  model: {
    name: "image-detector",
    version: "1.0.0",
  },
};

export const DEMO_FAILURE_IMAGE: DetectionResponse = {
  id: "demo_image_002",
  modality: "image",
  status: "failed",
  error: {
    code: "invalid_file",
    message:
      "The uploaded image could not be processed by the detection service. Please try another file.",
  },
};

export const DEMO_SUCCESS_VIDEO: DetectionResponse = {
  id: "demo_video_001",
  modality: "video",
  status: "completed",
  progress: 100,
  result: {
    label: "ai_generated",
    ai_probability: 0.91,
    human_probability: 0.09,
    confidence: "high",
    reasoning:
      "Frames sampled across the video show consistent synthetic texture patterns and a lack of natural motion blur. Face rendering remains unnaturally stable between adjacent frames.",
  },
  model: {
    name: "video-detector",
    version: "1.0.0",
  },
};

export const DEMO_FAILURE_VIDEO: DetectionResponse = {
  id: "demo_video_002",
  modality: "video",
  status: "failed",
  error: {
    code: "processing_error",
    message:
      "The video could not be analyzed. The file may be corrupted or the processing service timed out.",
  },
};