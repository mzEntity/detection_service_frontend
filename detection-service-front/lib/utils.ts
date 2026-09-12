import type { ConfidenceLevel, DetectionLabel } from "@/lib/types/detection";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function formatProbability(value: number | undefined | null): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.round(clamp(value, 0, 1) * 100);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const display = unitIndex === 0 ? String(Math.round(value)) : value.toFixed(1);
  return `${display} ${units[unitIndex]}`;
}

export function toLabelText(label: DetectionLabel): string {
  switch (label) {
    case "ai_generated":
      return "Likely AI-generated";
    case "human_generated":
      return "Likely human-generated";
    case "uncertain":
      return "Uncertain";
  }
}

export function toConfidenceText(confidence: ConfidenceLevel): string {
  switch (confidence) {
    case "low":
      return "Low confidence";
    case "medium":
      return "Medium confidence";
    case "high":
      return "High confidence";
  }
}