import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Badge from "@/components/shared/Badge";
import PdfViewerModal from "@/components/shared/PdfViewerModal";
import ReassignModal from "@/components/claims/ReassignModal";
import { fetchClaim, ClaimDetailResponse } from "@/api/claims";

const ClaimDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [claim, setClaim] = useState<ClaimDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<{
    filename: string;
    url: string;
  } | null>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<boolean>(true);

  useEffect(() => {
    loadClaim();
  }, [id]);

  const loadClaim = async () => {
    if (!id) {
      navigate("/team");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchClaim(id);
      setClaim(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load claim";
      toast.error(errorMessage);
      navigate("/team");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-t-primary border-primary/20 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading claim...</p>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Claim not found</p>
          <button
            onClick={() => navigate("/team")}
            className="mt-4 text-primary hover:underline"
          >
            Back to Claims
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/team")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Claims
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {claim.id}
              </h1>
              <p className="text-muted-foreground">{claim.claimant}</p>
            </div>
            <button
              onClick={() => setShowReassignModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
            >
              Reassign Claim
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="severity" severity={claim.severity}>
              {claim.severity} Severity
            </Badge>
            <Badge variant="status" status={claim.status}>
              {claim.status}
            </Badge>
            <Badge variant="queue">{claim.queue}</Badge>
            <span className="text-sm text-muted-foreground">
              Created {formatDate(claim.created_at)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Claim Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Claimant Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Claimant Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="text-foreground font-medium">{claim.claimant}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-medium">{claim.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Policy Number
                  </p>
                  <p className="text-foreground font-medium">
                    {claim.policyNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Loss Type
                  </p>
                  <p className="text-foreground font-medium">{claim.loss_type}</p>
                </div>
              </div>
            </div>

            {/* Claim Description */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Description
              </h2>
              <p className="text-foreground leading-relaxed">
                {claim.description}
              </p>
            </div>

            {/* AI Rationale */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                AI Analysis & Rationale
              </h2>
              <p className="text-foreground leading-relaxed">
                {claim.rationale}
              </p>
            </div>

            {/* Evidence Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <button
                onClick={() => setExpandedEvidence(!expandedEvidence)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h2 className="text-xl font-semibold text-foreground">
                  Evidence & Sources
                </h2>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedEvidence ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedEvidence && (
                <div className="space-y-3">
                  {claim.evidence && claim.evidence.length > 0 ? (
                    claim.evidence.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-background rounded-lg border border-border/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.source}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Page {item.page}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground italic border-l-2 border-primary pl-3">
                          "{item.span}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No evidence items available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Analysis & Attachments */}
          <div className="space-y-6">
            {/* Confidence Score */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Confidence Score
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      AI Confidence
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {(claim.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                      style={{ width: `${claim.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on AI analysis of uploaded documents and form data
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Attachments
              </h3>
              <div className="space-y-2">
                {claim.attachments && claim.attachments.length > 0 ? (
                  claim.attachments.map((attachment) => (
                    <button
                      key={attachment.filename}
                      onClick={() =>
                        setSelectedPdf({
                          filename: attachment.filename,
                          url: attachment.url,
                        })
                      }
                      className="w-full flex items-center justify-between p-3 hover:bg-background rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {attachment.filename}
                          </p>
                          {attachment.size && (
                            <p className="text-xs text-muted-foreground">
                              {attachment.size}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-primary text-sm flex-shrink-0">
                        View
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No attachments available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setSelectedPdf(null)}
          filename={selectedPdf.filename}
          url={selectedPdf.url}
        />
      )}

      {/* Reassign Modal */}
      <ReassignModal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        claimId={id || ""}
        onSuccess={loadClaim}
      />
    </div>
  );
};

export default ClaimDetailPage;
