import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
  LoaderCircle,
  Save,
} from "lucide-react";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

import api from "../configs/api";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  // Resume data
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);

  // Form states
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  // Form sections
  const sections = [
    {
      id: "personal",
      name: "Personal Information",
      shortName: "Personal Info",
      icon: User,
    },
    {
      id: "summary",
      name: "Professional Summary",
      shortName: "Summary",
      icon: FileText,
    },
    {
      id: "experience",
      name: "Work Experience",
      shortName: "Experience",
      icon: Briefcase,
    },
    {
      id: "education",
      name: "Education",
      shortName: "Education",
      icon: GraduationCap,
    },
    {
      id: "projects",
      name: "Projects",
      shortName: "Projects",
      icon: FolderIcon,
    },
    { id: "skills", name: "Skills", shortName: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  // Load existing resume
  const loadExistingResume = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
        headers: { Authorization: token },
      });

      if (data.resume) {
        const resume = data.resume;

        setResumeData({
          _id: resume._id || "",
          title: resume.title || "",
          personal_info: resume.personal_info || {},
          professional_summary: resume.professional_summary || "",
          experience: resume.experience || [],
          education: resume.education || [],
          project: resume.project || [],
          skills: resume.skills || [],
          template: resume.template || "classic",
          accent_color: resume.accent_color || "#3B82F6",
          public: resume.public || false,
        });

        document.title = resume.title || "Resume Builder";
      }
    } catch (error) {
      console.error("Error loading resume:", error);

      toast.error(
        error.response?.data?.message || "Unable to load your resume.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [resumeId, token]);

  useEffect(() => {
    if (resumeId && token) {
      loadExistingResume();
    } else {
      setIsLoading(false);
    }
  }, [resumeId, token, loadExistingResume]);

  // Validate personal information
  const validatePersonalInfo = () => {
    const info = resumeData.personal_info || {};

    if (!info.full_name?.trim()) {
      toast.error("Please enter your full name.");
      setActiveSectionIndex(0);
      return false;
    }

    if (info.full_name.trim().length < 2) {
      toast.error("Name must contain at least 2 characters.");
      setActiveSectionIndex(0);
      return false;
    }

    if (!info.email?.trim()) {
      toast.error("Please enter your email address.");
      setActiveSectionIndex(0);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(info.email.trim())) {
      toast.error("Please enter a valid email address.");
      setActiveSectionIndex(0);
      return false;
    }

    if (
      info.phone?.trim() &&
      !/^[+]?[\d\s()-]{7,20}$/.test(info.phone.trim())
    ) {
      toast.error("Please enter a valid phone number.");
      setActiveSectionIndex(0);
      return false;
    }

    for (const field of ["linkedin", "website"]) {
      const value = info[field]?.trim();

      if (value) {
        try {
          const url = new URL(
            value.startsWith("http://") || value.startsWith("https://")
              ? value
              : `https://${value}`,
          );

          if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Invalid URL");
          }
        } catch {
          toast.error(
            `Please enter a valid ${
              field === "linkedin" ? "LinkedIn" : "website"
            } URL.`,
          );

          setActiveSectionIndex(0);
          return false;
        }
      }
    }

    return true;
  };

  // Save resume
  const saveResume = async () => {
    if (isSaving || isVisibilityUpdating) return;

    if (!validatePersonalInfo()) return;

    setIsSaving(true);

    try {
      const updatedResumeData = structuredClone(resumeData);

      // Remove image from JSON data.
      // Image is uploaded separately using FormData.
      if (
        updatedResumeData.personal_info?.image &&
        typeof updatedResumeData.personal_info.image === "object"
      ) {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();

      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) {
        formData.append("removeBackground", "yes");
      }

      if (resumeData.personal_info.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
      }

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: {
          Authorization: token,
        },
      });

      if (data.resume) {
        setResumeData((prev) => ({
          ...prev,
          ...data.resume,
        }));
      }

      toast.success(data.message || "Resume saved successfully!");
    } catch (error) {
      console.error("Error saving resume:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save your resume. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Change resume visibility
  const changeResumeVisibility = async () => {
    if (isSaving || isVisibilityUpdating) return;

    try {
      setIsVisibilityUpdating(true);

      const formData = new FormData();

      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: token },
      });

      setResumeData((prev) => ({
        ...prev,
        public: !prev.public,
      }));

      toast.success(data.message || "Visibility updated successfully.");
    } catch (error) {
      console.error("Error updating visibility:", error);

      toast.error(
        error.response?.data?.message || "Unable to update resume visibility.",
      );
    } finally {
      setIsVisibilityUpdating(false);
    }
  };

  // Share resume
  const handleShare = async () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          url: resumeUrl,
          text: "My Resume",
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resumeUrl);
        toast.success("Resume link copied to clipboard!");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share your resume.");
      }
    }
  };

  // Download resume
  const downloadResume = () => {
    window.print();
  };

  // Navigate between form sections
  const goToSection = (index) => {
    if (isSaving || isVisibilityUpdating) return;

    setActiveSectionIndex(Math.max(0, Math.min(index, sections.length - 1)));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update personal information
  const handlePersonalInfoChange = (data) => {
    setResumeData((prev) => ({
      ...prev,
      personal_info: data,
    }));
  };

  // Update summary
  const handleSummaryChange = (data) => {
    setResumeData((prev) => ({
      ...prev,
      professional_summary: data,
    }));
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Loading your resume
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we prepare your workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Back navigation */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* LEFT PANEL - FORM */}
          <div className="min-w-0 lg:col-span-5">
            <div
              className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
                isSaving ? "cursor-not-allowed" : ""
              }`}
            >
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100">
                <div
                  className="h-full rounded-r-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${
                      ((activeSectionIndex + 1) * 100) / sections.length
                    }%`,
                  }}
                />
              </div>

              <fieldset
                disabled={isSaving}
                className="min-w-0 border-0 p-0 disabled:cursor-not-allowed [&_*:disabled]:cursor-not-allowed"
              >
                <div className="p-4 sm:p-6">
                  {/* Top controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <TemplateSelector
                        selectedTemplate={resumeData.template}
                        onChange={(template) =>
                          setResumeData((prev) => ({
                            ...prev,
                            template,
                          }))
                        }
                      />

                      <ColorPicker
                        selectedColor={resumeData.accent_color}
                        onChange={(color) =>
                          setResumeData((prev) => ({
                            ...prev,
                            accent_color: color,
                          }))
                        }
                      />
                    </div>

                    {/* Previous / Next */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => goToSection(activeSectionIndex - 1)}
                        disabled={activeSectionIndex === 0 || isSaving}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={() => goToSection(activeSectionIndex + 1)}
                        disabled={
                          activeSectionIndex === sections.length - 1 || isSaving
                        }
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section heading */}
                  <div className="mb-5 mt-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        {(() => {
                          const Icon = activeSection.icon;
                          return <Icon className="h-5 w-5" />;
                        })()}
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-900">
                          {activeSection.name}
                        </h2>
                        <p className="text-xs text-slate-500 sm:text-sm">
                          Section {activeSectionIndex + 1} of {sections.length}{" "}
                          • Complete your resume details
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section tabs */}
                  <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {sections.map((section, index) => {
                      const Icon = section.icon;
                      const isActive = activeSectionIndex === index;

                      return (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => goToSection(index)}
                          disabled={isSaving}
                          title={section.name}
                          className={`flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-3 text-center transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                            isActive
                              ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
                              : "border-slate-100 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="w-full truncate text-[10px] font-medium sm:text-[11px]">
                            {section.shortName}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Form content */}
                  <div className="min-h-[300px] space-y-6">
                    {activeSection.id === "personal" && (
                      <PersonalInfoForm
                        data={resumeData.personal_info}
                        onChange={handlePersonalInfoChange}
                        removeBackground={removeBackground}
                        setRemoveBackground={setRemoveBackground}
                        isSaving={isSaving}
                      />
                    )}

                    {activeSection.id === "summary" && (
                      <ProfessionalSummaryForm
                        data={resumeData.professional_summary}
                        onChange={handleSummaryChange}
                        setResumeData={setResumeData}
                      />
                    )}

                    {activeSection.id === "experience" && (
                      <ExperienceForm
                        data={resumeData.experience}
                        onChange={(data) =>
                          setResumeData((prev) => ({
                            ...prev,
                            experience: data,
                          }))
                        }
                      />
                    )}

                    {activeSection.id === "education" && (
                      <EducationForm
                        data={resumeData.education}
                        onChange={(data) =>
                          setResumeData((prev) => ({
                            ...prev,
                            education: data,
                          }))
                        }
                      />
                    )}

                    {activeSection.id === "projects" && (
                      <ProjectForm
                        data={resumeData.project}
                        onChange={(data) =>
                          setResumeData((prev) => ({
                            ...prev,
                            project: data,
                          }))
                        }
                      />
                    )}

                    {activeSection.id === "skills" && (
                      <SkillsForm
                        data={resumeData.skills}
                        onChange={(data) =>
                          setResumeData((prev) => ({
                            ...prev,
                            skills: data,
                          }))
                        }
                      />
                    )}
                  </div>

                  {/* Save button */}
                  <div className="mt-8 border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={saveResume}
                      disabled={isSaving || isVisibilityUpdating}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-100 transition-all duration-200 hover:-translate-y-0.5 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                    >
                      {isSaving ? (
                        <>
                          <LoaderCircle className="h-5 w-5 animate-spin" />
                          Saving your resume...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-center text-xs text-slate-400">
                      Save your changes to keep your resume up to date.
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* Saving overlay */}
              {isSaving && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-lg">
                    <LoaderCircle className="h-5 w-5 animate-spin text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Saving your resume
                      </p>
                      <p className="text-xs text-slate-500">
                        Please don't close this page.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - PREVIEW */}
          <div className="min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-6">
              {/* Preview toolbar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:px-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <EyeIcon className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Live Preview
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Changes appear here automatically
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Share */}
                  {resumeData.public && (
                    <button
                      type="button"
                      onClick={handleShare}
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Share2Icon className="h-4 w-4" />
                      Share
                    </button>
                  )}

                  {/* Visibility */}
                  <button
                    type="button"
                    onClick={changeResumeVisibility}
                    disabled={isSaving || isVisibilityUpdating}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      resumeData.public
                        ? "border-purple-100 bg-purple-50 text-purple-600 hover:bg-purple-100"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {isVisibilityUpdating ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : resumeData.public ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}

                    {isVisibilityUpdating
                      ? "Updating..."
                      : resumeData.public
                        ? "Public"
                        : "Private"}
                  </button>

                  {/* Download */}
                  <button
                    type="button"
                    onClick={downloadResume}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              {/* Resume preview */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentcolor={resumeData.accent_color}
                />
              </div>

              <p className="mt-3 text-center text-xs text-slate-400">
                Your resume preview updates as you edit your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
