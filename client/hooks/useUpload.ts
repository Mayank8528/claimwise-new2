import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadClaim, ClaimUploadData } from "@/api/claims";

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export const useUpload = () => {
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });

  const mutation = useMutation({
    mutationFn: async (data: ClaimUploadData) => {
      // Note: For real progress tracking, you would need to use XMLHttpRequest
      // or fetch with streaming. This is a simplified version.
      setProgress({ loaded: 0, total: 100, percentage: 0 });

      try {
        const result = await uploadClaim(data);
        setProgress({ loaded: 100, total: 100, percentage: 100 });
        return result;
      } catch (error) {
        setProgress({ loaded: 0, total: 100, percentage: 0 });
        throw error;
      }
    },
  });

  const uploadWithProgress = useCallback(
    async (data: ClaimUploadData) => {
      return mutation.mutate(data);
    },
    [mutation]
  );

  return {
    upload: uploadWithProgress,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    progress,
  };
};
