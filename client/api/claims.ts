import {
  ClaimResponse,
  ClaimDetailResponse,
  ReassignData,
  Queue,
} from "@shared/api";

// Get API base URL from environment
// In development: Will be /api (relative) which works with vite dev server proxy
// In production: Will be /api (relative) which uses the same domain
// Format: empty string (same domain) or full URL (different domain)
const VITE_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// Build the API base URL - if env is /api, use it as is
// Otherwise treat as domain/port and keep as is
export const API_BASE_URL = VITE_API_BASE.replace(/\/$/, "");

export interface ClaimUploadData {
  fullName?: string;
  name?: string;
  email: string;
  policyNumber?: string;
  policy_no?: string;
  dateOfLoss?: string;
  date_of_loss?: string;
  claimType?: string;
  claim_type?: string;
  description: string;
  files?: Record<string, File[]>;
}

// Re-export shared types for backwards compatibility
export type {
  ClaimResponse,
  ClaimDetailResponse,
  ReassignData,
  Queue,
} from "@shared/api";
export type { Evidence, Attachment } from "@shared/api";

export interface FetchClaimsParams {
  limit?: number;
  offset?: number;
  queue?: string;
  severity?: string;
  search?: string;
}

// Upload a new claim
export const uploadClaim = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/claims/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload claim");
  }

  return response.json() as Promise<{ id: string }>;
};

// Fetch all claims
export const fetchClaims = async (params: FetchClaimsParams = {}) => {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.offset) queryParams.append("offset", params.offset.toString());
  if (params.queue) queryParams.append("queue", params.queue);
  if (params.severity) queryParams.append("severity", params.severity);
  if (params.search) queryParams.append("search", params.search);

  const response = await fetch(
    `${API_BASE_URL}/api/claims?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch claims");
  }

  return response.json() as Promise<ClaimResponse[]>;
};

// Fetch single claim detail
export const fetchClaim = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/claims/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch claim");
  }

  return response.json() as Promise<ClaimDetailResponse>;
};

// Reassign a claim
export const reassignClaim = async (id: string, data: ReassignData) => {
  const response = await fetch(`${API_BASE_URL}/api/claims/${id}/reassign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to reassign claim");
  }

  return response.json();
};

// Fetch all queues
export const fetchQueues = async () => {
  const response = await fetch(`${API_BASE_URL}/api/queues`);

  if (!response.ok) {
    throw new Error("Failed to fetch queues");
  }

  return response.json() as Promise<Queue[]>;
};
