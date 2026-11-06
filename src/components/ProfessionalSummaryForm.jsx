import { Loader2, Sparkles, FileText, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const summary = data || "";
  const maxLength = 1000;

  const generateSummary = async () => {
    if (!summary.trim()) {
      toast.error("Please write a summary before enhancing it.");
      return;
    }

    try {
      setIsGenerating(true);

      const prompt = `Enhance the following professional resume summary.
Make it concise, professional, impactful, and ATS-friendly.
Preserve the candidate's actual experience and skills.
Do not invent achievements or qualifications.

Summary: "${summary}"`;

      const response = await api.post(
        "/api/ai/enhanced-pro-sum",
        { userContent: prompt },
        { headers: { Authorization: token } },
      );

      const enhancedContent = response.data.enhancedContent;

      if (!enhancedContent) {
        throw new Error("No enhanced summary was returned.");
      }

      setResumeData((prev) => ({
        ...prev,
        professional_summary: enhancedContent,
      }));

      toast.success("Your summary has been enhanced!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to enhance your summary.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
            <FileText className="size-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Professional Summary
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Introduce your experience, strengths, and career goals.
            </p>
          </div>
        </div>

        {/* AI Enhance Button */}
        <button
          type="button"
          disabled={isGenerating || !summary.trim()}
          onClick={generateSummary}
          className="inline-flex w-fit min-w-max shrink-0
          whitespace-nowrap items-center justify-center gap-2
          px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold
          text-white rounded-xl
          bg-gradient-to-r from-violet-600 to-purple-600
          hover:from-violet-700 hover:to-purple-700
          shadow-sm hover:shadow-md transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="size-4 shrink-0 animate-spin" />
          ) : (
            <Sparkles className="size-4 shrink-0" />
          )}

          <span className="whitespace-nowrap">
            {isGenerating ? "Enhancing..." : "AI Enhance"}
          </span>
        </button>
      </div>

      {/* Summary Editor */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            rows={7}
            maxLength={maxLength}
            disabled={isGenerating}
            placeholder="Example: Results-driven software developer with experience building scalable web applications using React, Node.js, and MongoDB..."
            className="w-full min-h-44 p-4 pb-10 text-sm leading-7
            text-gray-700 placeholder:text-gray-400
            bg-white border border-gray-200 rounded-xl
            outline-none resize-y
            focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            transition-all duration-200
            disabled:bg-gray-50 disabled:cursor-not-allowed"
          />

          {/* Character Counter */}
          <div className="absolute bottom-3 right-4 text-xs text-gray-400">
            {summary.length}/{maxLength}
          </div>
        </div>

        {/* Writing Tip */}
        <div
          className="flex items-start gap-2.5 p-3.5
        rounded-xl bg-blue-50/70 border border-blue-100"
        >
          <WandSparkles className="size-4 mt-0.5 text-blue-600 shrink-0" />

          <div>
            <p className="text-xs font-semibold text-blue-900">Pro Tip</p>

            <p className="text-xs text-blue-800/80 leading-relaxed mt-1">
              Keep your summary around 3–4 sentences. Highlight your strongest
              skills, relevant experience, and measurable achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
