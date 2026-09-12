import { useCallback, useEffect, useRef, useState } from "react";
import { formatFileSize } from "@/lib/utils";

interface UseUploadOptions {
  accept: readonly string[];
  maxSizeBytes: number;
}

interface UseUploadResult {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  handleFile: (candidate: File) => void;
  clearFile: () => void;
}

export function useUpload({
  accept,
  maxSizeBytes,
}: UseUploadOptions): UseUploadResult {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  const replacePreview = useCallback((nextUrl: string | null) => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }
    previewRef.current = nextUrl;
    setPreviewUrl(nextUrl);
  }, []);

  const handleFile = useCallback(
    (candidate: File) => {
      if (!accept.includes(candidate.type)) {
        setError(
          `Unsupported file type. Accepted types: ${accept.join(", ")}.`
        );
        return;
      }
      if (candidate.size <= 0 || candidate.size > maxSizeBytes) {
        setError(
          `File is too large. Maximum size is ${formatFileSize(maxSizeBytes)}.`
        );
        return;
      }
      setError(null);
      replacePreview(URL.createObjectURL(candidate));
      setFile(candidate);
    },
    [accept, maxSizeBytes, replacePreview]
  );

  const clearFile = useCallback(() => {
    replacePreview(null);
    setFile(null);
    setError(null);
  }, [replacePreview]);

  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  return { file, previewUrl, error, handleFile, clearFile };
}