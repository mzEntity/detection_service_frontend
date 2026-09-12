import type { DetectionError } from "@/lib/types/detection";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const API_PREFIX = "/api/v1";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly isNetworkError: boolean;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.isNetworkError = status === 0;
  }
}

async function parseErrorBody(response: Response): Promise<DetectionError> {
  try {
    const body = (await response.json()) as {
      error?: Partial<DetectionError>;
    };
    return {
      code: body.error?.code,
      message:
        body.error?.message ?? `Request failed with status ${response.status}.`,
    };
  } catch {
    return { message: `Request failed with status ${response.status}.` };
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${API_PREFIX}${path}`;

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError(
      "Cannot reach the detection service. Check your connection and try again.",
      0,
      "network_error"
    );
  }

  if (!response.ok) {
    const error = await parseErrorBody(response);
    throw new ApiError(error.message, response.status, error.code);
  }

  return (await response.json()) as T;
}

export function buildQueryString(
  params: Record<string, string | undefined>
): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string] => entry[1] !== undefined
  );
  if (entries.length === 0) {
    return "";
  }
  const query = new URLSearchParams(entries).toString();
  return `?${query}`;
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}