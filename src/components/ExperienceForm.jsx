import {
  Briefcase,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  CalendarDays,
  Building2,
  WandSparkles,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ExperienceForm = ({ data = [], onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };

    onChange([...data, newExperience]);
  };

  // Remove experience
  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  // Update experience fields
  const updateExperience = (index, field, value) => {
    const updated = [...data];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  };

  // Update multiple fields together
  const updateCurrentStatus = (index, isCurrent) => {
    const updated = [...data];

    updated[index] = {
      ...updated[index],
      is_current: isCurrent,
      end_date: isCurrent ? "" : updated[index].end_date,
    };

    onChange(updated);
  };

  // AI enhance job description
  const generateDescription = async (index) => {
    const experience = data[index];

    if (!experience.company?.trim() || !experience.position?.trim()) {
      toast.error("Please enter your company and job title first.");
      return;
    }

    if (!experience.description?.trim()) {
      toast.error("Please write a description before enhancing it.");
      return;
    }

    try {
      setGeneratingIndex(index);

      const prompt = `Improve this resume job description for a ${
        experience.position
      } role at ${experience.company}.

Make it professional, concise, achievement-focused, and ATS-friendly.
Preserve the candidate's actual responsibilities and experience.
Do not invent metrics, achievements, or skills.

Current description: ${experience.description}`;

      const { data: responseData } = await api.post(
        "/api/ai/enhanced-job-desc",
        { userContent: prompt },
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (!responseData.enhancedContent) {
        throw new Error("No enhanced description was returned.");
      }

      updateExperience(index, "description", responseData.enhancedContent);

      toast.success("Job description enhanced!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to enhance description.",
      );
    } finally {
      setGeneratingIndex(-1);
    }
  };

  // Reusable input styles
  const inputClass =
    "w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200";

  const labelClass = "block mb-2 text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
            <Briefcase className="size-5 text-blue-600" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Professional Experience
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Highlight your previous roles and achievements.
            </p>
          </div>
        </div>

        {/* Add Experience Button */}
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex w-fit shrink-0 whitespace-nowrap
          items-center justify-center gap-2 px-4 py-2.5
          text-sm font-semibold text-green-700 bg-green-50
          border border-green-100 rounded-xl
          hover:bg-green-100 transition-all duration-200"
        >
          <Plus className="size-4 shrink-0" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center text-center
          py-12 px-5 bg-gray-50/70 border border-dashed
          border-gray-300 rounded-2xl"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
            <Briefcase className="size-8 text-gray-400" />
          </div>

          <h4 className="text-base font-semibold text-gray-800">
            No experience added yet
          </h4>

          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Add your work experience to showcase your professional journey and
            achievements.
          </p>

          <button
            type="button"
            onClick={addExperience}
            className="mt-5 inline-flex w-fit whitespace-nowrap
            items-center justify-center gap-2 px-4 py-2.5
            text-sm font-medium text-white bg-blue-600
            rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="size-4 shrink-0" />
            Add Your First Experience
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 bg-white border border-gray-200
              rounded-2xl space-y-5 shadow-sm hover:shadow-md
              transition-shadow duration-200"
            >
              {/* Experience Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex items-center justify-center
                    size-9 shrink-0 rounded-xl bg-blue-50
                    text-blue-600 font-semibold text-sm"
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900">
                      Experience #{index + 1}
                    </h4>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Add your role and responsibilities
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  aria-label={`Remove experience ${index + 1}`}
                  className="p-2 shrink-0 text-gray-400 rounded-lg
                  hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="border-t border-gray-100" />

              {/* Company and Position */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company Name</label>

                  <div className="relative">
                    <Building2
                      className="absolute left-3.5 top-1/2
                      -translate-y-1/2 size-4 text-gray-400"
                    />

                    <input
                      value={experience.company || ""}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      type="text"
                      placeholder="e.g. Google"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Job Title</label>

                  <input
                    value={experience.position || ""}
                    onChange={(e) =>
                      updateExperience(index, "position", e.target.value)
                    }
                    type="text"
                    placeholder="e.g. Software Developer"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Employment Period */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="size-4 text-gray-500" />

                  <h5 className="text-sm font-medium text-gray-700">
                    Employment Period
                  </h5>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Start Date</label>

                    <input
                      value={experience.start_date || ""}
                      onChange={(e) =>
                        updateExperience(index, "start_date", e.target.value)
                      }
                      type="month"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>End Date</label>

                    <input
                      value={experience.end_date || ""}
                      onChange={(e) =>
                        updateExperience(index, "end_date", e.target.value)
                      }
                      type="month"
                      disabled={experience.is_current}
                      className={`${inputClass}
                      disabled:bg-gray-100
                      disabled:text-gray-400
                      disabled:cursor-not-allowed`}
                    />
                  </div>
                </div>

                {/* Currently Working Checkbox */}
                <label
                  className="flex items-center gap-3 mt-4 p-3
                  bg-gray-50 rounded-xl cursor-pointer
                  hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={experience.is_current || false}
                    onChange={(e) =>
                      updateCurrentStatus(index, e.target.checked)
                    }
                    className="size-4 rounded border-gray-300
                    text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-gray-700">
                    I currently work here
                  </span>
                </label>
              </div>

              {/* Job Description */}
              <div className="space-y-3">
                <div
                  className="flex flex-col sm:flex-row
                  sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <label className="text-sm font-semibold text-gray-800">
                      Job Description
                    </label>

                    <p className="text-xs text-gray-500 mt-1">
                      Describe your responsibilities and achievements.
                    </p>
                  </div>

                  {/* AI Enhance Button */}
                  <button
                    type="button"
                    onClick={() => generateDescription(index)}
                    disabled={
                      generatingIndex !== -1 ||
                      !experience.company?.trim() ||
                      !experience.position?.trim() ||
                      !experience.description?.trim()
                    }
                    className="inline-flex w-fit shrink-0 whitespace-nowrap
                    items-center justify-center gap-2 px-3 py-2
                    text-xs font-semibold text-white
                    bg-gradient-to-r from-violet-600 to-purple-600
                    rounded-lg hover:from-violet-700 hover:to-purple-700
                    shadow-sm transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingIndex === index ? (
                      <Loader2 className="size-3.5 shrink-0 animate-spin" />
                    ) : (
                      <Sparkles className="size-3.5 shrink-0" />
                    )}

                    <span>
                      {generatingIndex === index
                        ? "Enhancing..."
                        : "Enhance with AI"}
                    </span>
                  </button>
                </div>

                {/* Description Textarea */}
                <div className="relative">
                  <textarea
                    value={experience.description || ""}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    rows={5}
                    maxLength={2000}
                    disabled={generatingIndex === index}
                    placeholder="Describe your key responsibilities, projects, and achievements..."
                    className="w-full min-h-32 px-4 py-3 pb-9
                    text-sm leading-7 text-gray-700 bg-white
                    border border-gray-200 rounded-xl outline-none
                    resize-y placeholder:text-gray-400
                    focus:border-blue-500 focus:ring-4
                    focus:ring-blue-500/10 transition-all
                    disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />

                  <div
                    className="absolute bottom-3 right-4
                    text-xs text-gray-400"
                  >
                    {(experience.description || "").length}/2000
                  </div>
                </div>

                {/* AI Tip */}
                <div
                  className="flex items-start gap-2 p-3
                  bg-purple-50/70 border border-purple-100 rounded-xl"
                >
                  <WandSparkles className="size-4 mt-0.5 text-purple-600 shrink-0" />

                  <p className="text-xs text-purple-800/80 leading-relaxed">
                    <span className="font-semibold text-purple-900">
                      AI Tip:
                    </span>{" "}
                    Use action verbs and focus on measurable results. AI can
                    help improve your wording while preserving your actual
                    experience.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
