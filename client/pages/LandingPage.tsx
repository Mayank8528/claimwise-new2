import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1a3e] to-[#2d1b4e] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full text-center">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/15 transition-colors">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white font-medium">
              Real-Time AI Claims Triage
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            Transform Claims Chaos
            <br />
            Into
          </h1>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
            Instant Intelligence
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop wasting 40% of adjuster time on manual routing. ClaimWise uses AI
          to classify, detect fraud, and route insurance claims in real-time—cutting
          triage delays from days to seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => navigate("/upload")}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
          >
            User
          </button>
          <button
            onClick={() => navigate("/team")}
            className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400/10 transition-all duration-200 text-lg"
          >
            Team
          </button>
        </div>

        {/* Feature Checkmarks */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm text-gray-400 pt-8">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            Real-time claim processing
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            AI-powered fraud detection
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            Zero manual routing delays
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
