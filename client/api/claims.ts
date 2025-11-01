import { API_BASE, API_ENDPOINTS } from "./config";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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

export interface Evidence {
  source: string;
  page: number;
  span: string;
}

export interface Attachment {
  filename: string;
  url: string;
  size?: string;
}

export interface ClaimResponse {
  id: string;
  claimant: string;
  policy_no: string;
  loss_type: string;
  created_at: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  confidence: number;
  queue: string;
  status: "Processing" | "Completed" | "Rejected";
  amount?: string;
}

export interface ClaimDetailResponse extends ClaimResponse {
  email: string;
  description: string;
  rationale: string;
  evidence: Evidence[];
  attachments: Attachment[];
  assignee?: string;
}

export interface ReassignData {
  queue: string;
  assignee: string;
  note: string;
}

export interface Queue {
  id: string;
  name: string;
  assignees?: string[];
}

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

export const getClaims = async () => {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.claims.list}`);

  if (!response.ok) {
    throw new Error("Failed to fetch claims");
  }

  return response.json() as Promise<ClaimResponse[]>;
};

export const getClaimDetail = async (id: string) => {
  const response = await fetch(
    `${API_BASE}${API_ENDPOINTS.claims.get(id)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch claim detail");
  }

  return response.json() as Promise<ClaimDetailResponse>;
};

export const reassignClaim = async (id: string, data: ReassignData) => {
  const response = await fetch(
    `${API_BASE}${API_ENDPOINTS.claims.reassign(id)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reassign claim");
  }

  return response.json();
};
