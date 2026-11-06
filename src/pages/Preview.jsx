import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, AlertCircle } from "lucide-react";

import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";
import api from "../configs/api";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResume = async () => {
      try {
        setIsLoading(true);
        setError("");

        const { data } = await api.get(`/api/resumes/public/${resumeId}`);

        if (isMounted) {
          setResumeData(data.resume);
        }
      } catch (error) {
        console.error("Error loading resume:", error);

        if (isMounted) {
          setError(
            error.response?.data?.message ||
              "This resume may have been removed or made private.",
          );
          setResumeData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (resumeId) {
      loadResume();
    } else {
      setError("Invalid resume link.");
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [resumeId]);

  const handleDownload = () => {
    window.print();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  // Resume Not Found
  if (!resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-lg sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Resume not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error || "Sorry, we couldn't find the resume you're looking for."}
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-all hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo / Home */}
          <Link to="/" className="group flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                Resume Builder
              </h2>
              <p className="hidden text-xs text-slate-400 sm:block">
                Professional resume preview
              </p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-95 sm:px-5 sm:text-sm"
            >
              <Download className="h-4 w-4" />
              <span className="hidden xs:inline">Download PDF</span>
              <span className="xs:hidden">Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Preview Section */}
      <main className="mx-auto w-full max-w-7xl px-2 py-5 sm:px-5 sm:py-8 lg:px-8 lg:py-10">
        {/* Preview Heading */}
        <div className="mb-5 flex flex-col gap-2 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Public Resume
            </div>

            <h1 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl lg:text-3xl">
              Resume Preview
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              View and download this professional resume.
            </p>
          </div>

          <p className="hidden text-xs text-slate-400 sm:block">
            Ready to print or save as PDF
          </p>
        </div>

        {/* Resume Paper */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md sm:rounded-2xl sm:p-3 lg:p-5">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentcolor={resumeData.accent_color || resumeData.accentcolor}
            classes="bg-white"
          />
        </div>

        {/* Footer */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2 pb-4 text-center sm:mt-7">
          <p className="text-xs text-slate-400">Created with Resume Builder by Satinder Singh Sall</p>
        </div>
      </main>
    </div>
  );
};

export default Preview;
