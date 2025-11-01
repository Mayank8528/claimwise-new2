import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const RulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rules</h1>
          <p className="text-muted-foreground">
            Manage triage rules and AI classification
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <div className="text-muted-foreground mb-4">
            <svg
              className="w-16 h-16 mx-auto opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Rules Page
          </h2>
          <p className="text-muted-foreground">
            This page is a placeholder. Continue building this feature by
            providing more details about what rules management functionality you'd
            like to see.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
