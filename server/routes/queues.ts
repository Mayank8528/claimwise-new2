import { RequestHandler } from "express";
import { Queue } from "@shared/api";

export const fetchQueues: RequestHandler = (req, res) => {
  const queues: Queue[] = [
    {
      id: "auto-claims",
      name: "Auto Claims",
      assignees: ["John Johnson", "Sarah Williams", "Mike Davis"],
    },
    {
      id: "property-damage",
      name: "Property Damage",
      assignees: ["Emily Brown", "Robert Wilson", "Lisa Martinez"],
    },
    {
      id: "fraud-detection",
      name: "Fraud Detection",
      assignees: ["Tom Anderson", "Jennifer Lee", "David Garcia"],
    },
    {
      id: "standard",
      name: "Standard Claims",
      assignees: ["Paul Taylor", "Mary White", "James Martin"],
    },
    {
      id: "priority",
      name: "Priority Queue",
      assignees: ["Margaret Miller", "Charles Thomas", "Sandra Jackson"],
    },
  ];

  res.json(queues);
};
