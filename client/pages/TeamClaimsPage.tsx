import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import ClaimTable from "@/components/claims/ClaimTable";
import ReassignModal from "@/components/claims/ReassignModal";
import { fetchClaims, ClaimResponse } from "@/api/claims";
import { useClaimsWebSocket } from "@/hooks/useClaimsWebSocket";

const TeamClaimsPage = () => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedQueue, setSelectedQueue] = useState("");
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  useEffect(() => {
    loadClaims();
  }, []);

  useClaimsWebSocket({
    onClaimCreated: (newClaim) => {
      setClaims((prev) => [newClaim, ...prev]);
    },
    onClaimUpdated: (updatedClaim) => {
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === updatedClaim.id ? updatedClaim : claim
        )
      );
    },
  });

  const loadClaims = async () => {
    setLoading(true);
    try {
      const data = await fetchClaims({
        limit: 25,
        offset: 0,
        severity: selectedSeverity || undefined,
        queue: selectedQueue || undefined,
        search: searchTerm || undefined,
      });
      setClaims(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load claims";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSeverityFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeverity(e.target.value);
  };

  const handleQueueFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQueue(e.target.value);
  };

  const handleReassign = (claimId: string) => {
    setSelectedClaimId(claimId);
    setShowReassignModal(true);
  };

  const handleReassignSuccess = () => {
    loadClaims();
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Claims Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and review all submitted claims
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search claims by ID, claimant name, policy number..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={handleSeverityFilter}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Queue
              </label>
              <select
                value={selectedQueue}
                onChange={handleQueueFilter}
                className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Queues</option>
                <option value="Fraud Detection">Fraud Detection</option>
                <option value="Auto Claims">Auto Claims</option>
                <option value="Standard">Standard</option>
                <option value="Priority">Priority</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadClaims}
                className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Claims Table */}
        <ClaimTable
          claims={claims}
          isLoading={loading}
          onReassign={handleReassign}
        />
      </div>

      {/* Reassign Modal */}
      {selectedClaimId && (
        <ReassignModal
          isOpen={showReassignModal}
          onClose={() => {
            setShowReassignModal(false);
            setSelectedClaimId(null);
          }}
          claimId={selectedClaimId}
          onSuccess={handleReassignSuccess}
        />
      )}
    </div>
  );
};

export default TeamClaimsPage;
