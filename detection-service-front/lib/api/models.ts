import { apiRequest, buildQueryString } from "./client";
import { USE_MOCKS } from "@/lib/constants";
import { mockGetModels } from "@/lib/mocks/api";
import type {
  DetectionModality,
  ModelCatalogResponse,
} from "@/lib/types/detection";

export function getModels(
  modality?: DetectionModality
): Promise<ModelCatalogResponse> {
  if (USE_MOCKS) {
    return mockGetModels(modality);
  }
  const query = buildQueryString({ modality });
  return apiRequest<ModelCatalogResponse>(`/models${query}`);
}