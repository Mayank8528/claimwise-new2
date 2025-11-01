import { useQuery } from "@tanstack/react-query";
import { getClaims } from "@/api/claims";

export const useClaims = () => {
  return useQuery({
    queryKey: ["claims"],
    queryFn: getClaims,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
