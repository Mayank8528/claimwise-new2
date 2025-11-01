import { API_BASE, API_ENDPOINTS } from "./config";

export interface Rule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export const getRules = async () => {
  const response = await fetch(`${API_BASE}${API_ENDPOINTS.rules.list}`);

  if (!response.ok) {
    throw new Error("Failed to fetch rules");
  }

  return response.json() as Promise<Rule[]>;
};
