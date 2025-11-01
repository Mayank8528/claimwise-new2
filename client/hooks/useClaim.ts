import { useQuery } from "@tanstack/react-query";
import { getClaimDetail } from "@/api/claims";

export const useClaim = (id: string | undefined) => {
  return useQuery({
    queryKey: ["claim", id],
    queryFn: () => {
      if (!id) throw new Error("Claim ID is required");
      return getClaimDetail(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
