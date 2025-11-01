export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  claims: {
    upload: "/api/claims/upload",
    list: "/api/claims",
    get: (id: string) => `/api/claims/${id}`,
    reassign: (id: string) => `/api/claims/${id}/reassign`,
  },
  queues: {
    list: "/api/queues",
  },
  rules: {
    list: "/api/rules",
  },
} as const;
