import { RequestHandler } from "express";
import { ClaimResponse, ClaimDetailResponse } from "@shared/api";

// Mock data for demonstration
const mockClaims: ClaimDetailResponse[] = [
  {
    id: "CLM-2024-001",
    claimant: "John Smith",
    email: "john.smith@example.com",
    policy_no: "POL-2024-12345",
    policyNumber: "POL-2024-12345",
    loss_type: "Auto Accident",
    created_at: new Date().toISOString(),
    severity: "High",
    confidence: 0.87,
    queue: "Auto Claims",
    status: "Processing",
    amount: "$15,000",
    description: "Multi-vehicle collision on highway",
    rationale:
      "High severity due to multiple vehicles involved and reported injuries. Confidence score is high based on clear police report documentation.",
    evidence: [
      {
        source: "police_report.pdf",
        page: 2,
        span: "driver reports broken leg and internal injuries",
      },
      {
        source: "fnol_form.pdf",
        page: 1,
        span: "estimated repair cost $15,000 for vehicle damage",
      },
    ],
    attachments: [
      {
        filename: "fnol_form.pdf",
        url: "/files/fnol_form.pdf",
        size: "2.4 MB",
      },
      {
        filename: "police_report.pdf",
        url: "/files/police_report.pdf",
        size: "1.8 MB",
      },
    ],
    assignee: "Team Lead A",
  },
  {
    id: "CLM-2024-002",
    claimant: "Jane Doe",
    email: "jane.doe@example.com",
    policy_no: "POL-2024-12346",
    policyNumber: "POL-2024-12346",
    loss_type: "Property Damage",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    severity: "Medium",
    confidence: 0.72,
    queue: "Standard",
    status: "Completed",
    amount: "$8,500",
    description: "Water damage to residential property",
    rationale:
      "Medium severity due to water damage extent. Confidence is moderate as visual assessment needed.",
    evidence: [
      {
        source: "damage_assessment.pdf",
        page: 1,
        span: "water damage affecting 2 rooms, estimated $8,500",
      },
    ],
    attachments: [
      {
        filename: "damage_assessment.pdf",
        url: "/files/damage_assessment.pdf",
        size: "3.2 MB",
      },
    ],
    assignee: "Adjuster B",
  },
];

export const fetchClaims: RequestHandler = (req, res) => {
  const limit = parseInt(req.query.limit as string) || 25;
  const offset = parseInt(req.query.offset as string) || 0;

  // Filter by severity if provided
  const severity = req.query.severity as string | undefined;
  const queue = req.query.queue as string | undefined;
  const search = req.query.search as string | undefined;

  let filtered = mockClaims;

  if (severity) {
    filtered = filtered.filter((claim) => claim.severity === severity);
  }

  if (queue) {
    filtered = filtered.filter((claim) => claim.queue === queue);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (claim) =>
        claim.id.toLowerCase().includes(searchLower) ||
        claim.claimant.toLowerCase().includes(searchLower) ||
        claim.policy_no.toLowerCase().includes(searchLower)
    );
  }

  const paginatedClaims: ClaimResponse[] = filtered
    .slice(offset, offset + limit)
    .map((claim) => ({
      id: claim.id,
      claimant: claim.claimant,
      policy_no: claim.policy_no,
      loss_type: claim.loss_type,
      created_at: claim.created_at,
      severity: claim.severity,
      confidence: claim.confidence,
      queue: claim.queue,
      status: claim.status,
      amount: claim.amount,
    }));

  res.json(paginatedClaims);
};

export const fetchClaimDetail: RequestHandler = (req, res) => {
  const { id } = req.params;
  const claim = mockClaims.find((c) => c.id === id);

  if (!claim) {
    return res.status(404).json({ error: "Claim not found" });
  }

  res.json(claim);
};

export const reassignClaim: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { queue, assignee, note } = req.body;

  const claim = mockClaims.find((c) => c.id === id);

  if (!claim) {
    return res.status(404).json({ error: "Claim not found" });
  }

  // Update the claim
  claim.queue = queue || claim.queue;
  claim.assignee = assignee || claim.assignee;

  res.json({ success: true, message: "Claim reassigned successfully", claim });
};

export const uploadClaim: RequestHandler = (req, res) => {
  const { name, email, policy_no, description, claim_type, date_of_loss } =
    req.body;

  if (!name || !email || !policy_no || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newClaimId = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newClaim: ClaimDetailResponse = {
    id: newClaimId,
    claimant: name,
    email,
    policy_no,
    policyNumber: policy_no,
    loss_type: claim_type || "General",
    created_at: new Date().toISOString(),
    severity: "Medium",
    confidence: 0.65,
    queue: "Standard",
    status: "Processing",
    description,
    rationale: "Pending AI analysis of uploaded documents",
    evidence: [],
    attachments: [],
  };

  mockClaims.push(newClaim);

  res.status(201).json({ id: newClaimId });
};
