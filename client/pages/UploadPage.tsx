import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { Loader } from "@/components/shared/Loader";
import { toast } from "sonner";
import { uploadClaim } from "@/api/claims";

const UploadPage = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    userDetails: true,
    acord: false,
    police: false,
    assessment: false,
    supporting: false,
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    policy_no: "",
    date_of_loss: "",
    claim_type: "",
    description: "",
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    acord: null,
    police: null,
    survey: null,
    supporting: null,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [claimId, setClaimId] = useState<string>("");

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !form.name ||
      !form.email ||
      !form.policy_no ||
      !form.date_of_loss ||
      !form.claim_type ||
      !form.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!files.acord) {
      toast.error("Please upload ACORD/FNOL form");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Append form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      const response = await uploadClaim(formData);
      setClaimId(response.id);
      setSuccess(true);
      toast.success("Claim submitted successfully!");

      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        navigate("/upload-confirmation", { state: { claimId: response.id } });
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Submission failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const Section = ({
    id,
    title,
    required,
    children,
  }: {
    id: string;
    title: string;
    required?: boolean;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[id];
    return (
      <div className="border border-border rounded-lg mb-4">
        <button
          onClick={() => toggleSection(id)}
          type="button"
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-card/50 transition-colors"
        >
          <span className="font-semibold text-foreground flex items-center gap-2">
            {title}
            {required && <span className="text-primary">*</span>}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
        {isExpanded && (
          <div className="px-6 py-4 border-t border-border bg-card/30">
            {children}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <Loader text="Submitting your claim..." />;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle2 className="w-24 h-24 text-primary animate-bounce" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Claim Submitted Successfully!
          </h1>

          <p className="text-muted-foreground mb-6">
            Your insurance claim has been received and is being processed by our
            AI system.
          </p>

          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Your Claim ID</p>
            <p className="text-2xl font-bold text-primary font-mono">
              {claimId}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Save this ID for your records
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            File Your Claim
          </h1>
          <p className="text-muted-foreground">
            Complete the form below to submit your insurance claim
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Details Section */}
          <Section id="userDetails" title="Claimant Details" required>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Policy Number *
                </label>
                <input
                  type="text"
                  name="policy_no"
                  required
                  value={form.policy_no}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="POL-123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date of Loss *
                </label>
                <input
                  type="date"
                  name="date_of_loss"
                  required
                  value={form.date_of_loss}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Claim Type *
                </label>
                <select
                  name="claim_type"
                  required
                  value={form.claim_type}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select claim type</option>
                  <option value="property">Property Damage</option>
                  <option value="auto">Auto Accident</option>
                  <option value="health">Health</option>
                  <option value="workers">Workers Compensation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Describe what happened..."
                />
              </div>
            </div>
          </Section>

          {/* ACORD Form Section */}
          <Section id="acord" title="ACORD / FNOL Form" required>
            <div className="space-y-4">
              {files.acord && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  ✓ {files.acord.name}
                </div>
              )}
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-card/30 transition-colors cursor-pointer block">
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                  />
                </svg>
                <p className="text-foreground font-medium">
                  Drag and drop your ACORD form here
                </p>
                <p className="text-muted-foreground text-sm">or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "acord")}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          </Section>

          {/* Police Report Section */}
          <Section id="police" title="Police Report">
            <div className="space-y-4">
              {files.police && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  ✓ {files.police.name}
                </div>
              )}
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-card/30 transition-colors cursor-pointer block">
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                  />
                </svg>
                <p className="text-foreground font-medium">
                  Drag and drop your police report here
                </p>
                <p className="text-muted-foreground text-sm">or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "police")}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          </Section>

          {/* Loss Assessment Section */}
          <Section id="assessment" title="Loss Assessment / Survey Report">
            <div className="space-y-4">
              {files.survey && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  ✓ {files.survey.name}
                </div>
              )}
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-card/30 transition-colors cursor-pointer block">
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                  />
                </svg>
                <p className="text-foreground font-medium">
                  Drag and drop your assessment report here
                </p>
                <p className="text-muted-foreground text-sm">or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "survey")}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          </Section>

          {/* Supporting Documents Section */}
          <Section id="supporting" title="Supporting Documents">
            <div className="space-y-4">
              {files.supporting && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                  ✓ {files.supporting.name}
                </div>
              )}
              <label className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-card/30 transition-colors cursor-pointer block">
                <svg
                  className="w-12 h-12 mx-auto text-muted-foreground mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                  />
                </svg>
                <p className="text-foreground font-medium">
                  Drag and drop supporting documents here
                </p>
                <p className="text-muted-foreground text-sm">or click to browse</p>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, "supporting")}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </Section>

          {/* Submit Button */}
          <div className="flex gap-4 pt-8">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-card transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
            >
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
