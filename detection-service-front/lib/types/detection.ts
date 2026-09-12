export type DetectionModality = "text" | "image" | "video";

export type DetectionStatus = "queued" | "processing" | "completed" | "failed";

export type DetectionLabel = "ai_generated" | "human_generated" | "uncertain";

export type ConfidenceLevel = "low" | "medium" | "high";

export interface DetectionResult {
  label: DetectionLabel;
  ai_probability: number;
  human_probability: number;
  confidence?: ConfidenceLevel;
  reasoning?: string;
}

export interface DetectionModel {
  name: string;
  version: string;
}

export interface DetectionModelInfo {
  name: string;
  version: string;
  modality: DetectionModality;
}

export interface ModelCatalogResponse {
  models: DetectionModelInfo[];
}

export interface DetectionError {
  code?: string;
  message: string;
}

export interface DetectionResponse {
  id: string;
  modality: DetectionModality;
  status: DetectionStatus;
  progress?: number;
  result?: DetectionResult;
  model?: DetectionModel;
  error?: DetectionError;
}