export const IMAGE_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const IMAGE_MAX_SIZE_BYTES = 15 * 1024 * 1024;

export const VIDEO_ACCEPTED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const VIDEO_MAX_SIZE_BYTES = 500 * 1024 * 1024;

export const TEXT_MIN_LENGTH = 1;

export const TEXT_MAX_LENGTH = 20000;

export const CONTEXT_MAX_LENGTH = 2000;

export const TASK_POLL_INTERVAL_MS = 2000;

export const USE_MOCKS = process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";