import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const QueuesPage = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Queues</h1>
          <p className="text-muted-foreground">
            View and manage claim processing queues
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
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Queues Page
          </h2>
          <p className="text-muted-foreground">
            This page is a placeholder. Continue building this feature by
            providing more details about what queue management functionality
            you'd like to see.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QueuesPage;
