import { useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ClaimResponse } from "@/api/claims";

interface ClaimEvent {
  type: "claim.created" | "claim.updated";
  data: ClaimResponse;
}

interface UseClaimsWebSocketProps {
  onClaimCreated?: (claim: ClaimResponse) => void;
  onClaimUpdated?: (claim: ClaimResponse) => void;
}

export const useClaimsWebSocket = ({
  onClaimCreated,
  onClaimUpdated,
}: UseClaimsWebSocketProps) => {
  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/claims`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as ClaimEvent;

        if (message.type === "claim.created") {
          onClaimCreated?.(message.data);
          toast.success("New claim received");
        } else if (message.type === "claim.updated") {
          onClaimUpdated?.(message.data);
          toast.info("Claim updated by system");
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    return ws;
  }, [onClaimCreated, onClaimUpdated]);

  useEffect(() => {
    const ws = connectWebSocket();

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connectWebSocket]);
};
