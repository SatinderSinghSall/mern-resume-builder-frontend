import {
  FilePenLine,
  LoaderCircle,
  Pencil,
  Trash2,
  UploadCloud,
  X,
  Plus,
  Search,
  FileText,
  Sparkles,
  Clock3,
  ArrowUpRight,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  FileUp,
  ShieldCheck,
  Trash,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../configs/api";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";

const colors = [
  "from-violet-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
];

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    (error?.code === "ERR_NETWORK"
      ? "Unable to connect to the server. Please check your internet connection."
      : error?.message || "Something went wrong. Please try again.")
  );
};

const formatDate = (date) => {
  if (!date) return "Recently updated";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently updated";
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [allResumes, setAllResumes] = useState([]);

  // Modal states
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [deleteResumeId, setDeleteResumeId] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [search, setSearch] = useState("");
  const [titleError, setTitleError] = useState("");
  const [fileError, setFileError] = useState("");
  const [modalError, setModalError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const modalOpen =
    showCreateResume ||
    showUploadResume ||
    Boolean(editResumeId) ||
    Boolean(deleteResumeId);

  // Prevent background scrolling whenever a modal is open.
  // No backdrop click or Escape-key handler is added:
  // modals close only through their own close buttons.
  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [modalOpen]);

  // Fetch resumes
  const loadAllResumes = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/api/users/resumes", {
        headers: { Authorization: token },
      });

      setAllResumes(data.resumes || []);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllResumes();
    } else {
      setLoading(false);
      setError("Please log in to view your resumes.");
    }
  }, [token]);

  // Reset and close regular modals
  const closeModals = () => {
    if (actionLoading) return;

    setShowCreateResume(false);
    setShowUploadResume(false);
    setEditResumeId("");
    setTitle("");
    setResume(null);
    setTitleError("");
    setFileError("");
    setModalError("");
    setDeleteError("");
  };

  const openCreateModal = () => {
    setTitleError("");
    setFileError("");
    setModalError("");
    setTitle("");
    setShowUploadResume(false);
    setEditResumeId("");
    setShowCreateResume(true);
  };

  const openUploadModal = () => {
    setTitleError("");
    setFileError("");
    setModalError("");
    setTitle("");
    setResume(null);
    setShowCreateResume(false);
    setEditResumeId("");
    setShowUploadResume(true);
  };

  const openEditModal = (item) => {
    setTitleError("");
    setModalError("");
    setTitle(item.title || "");
    setShowCreateResume(false);
    setShowUploadResume(false);
    setEditResumeId(item._id);
  };

  // Create resume
  const createResume = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Please enter a resume title.");
      return;
    }
    if (title.trim().length > 80) {
      setTitleError("Resume title must be 80 characters or fewer.");
      return;
    }

    setTitleError("");
    setModalError("");
    setActionLoading(true);

    try {
      const { data } = await api.post(
        "/api/resumes/create",
        { title: title.trim() },
        { headers: { Authorization: token } },
      );

      setAllResumes((prev) => [...prev, data.resume]);

      setTitle("");
      setShowCreateResume(false);

      toast.success("Resume created successfully!");

      navigate(`/app/builder/${data.resume._id}`);
    } catch (err) {
      const message = getErrorMessage(err);
      setModalError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  // Upload PDF resume
  const uploadResume = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Please enter a resume title.");
      return;
    }
    if (title.trim().length > 80) {
      setTitleError("Resume title must be 80 characters or fewer.");
      return;
    }
    if (!resume) {
      setFileError("Please select a PDF file.");
      return;
    }

    const isPdf =
      resume.type === "application/pdf" ||
      resume.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setFileError("Only PDF files are accepted.");
      return;
    }

    setTitleError("");
    setFileError("");
    setModalError("");
    setActionLoading(true);

    try {
      const resumeText = await pdfToText(resume);

      if (!resumeText.trim()) {
        throw new Error(
          "Could not extract text from this PDF. Please try another file.",
        );
      }

      const { data } = await api.post(
        "/api/ai/upload-resume",
        {
          title: title.trim(),
          resumeText,
        },
        { headers: { Authorization: token } },
      );

      setTitle("");
      setResume(null);
      setShowUploadResume(false);

      toast.success("Resume uploaded successfully!");

      navigate(`/app/builder/${data.resumeId}`);
    } catch (err) {
      const message = getErrorMessage(err);
      setModalError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit resume title
  const editTitle = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError("Resume title cannot be empty.");
      return;
    }
    if (title.trim().length > 80) {
      setTitleError("Resume title must be 80 characters or fewer.");
      return;
    }

    setTitleError("");
    setModalError("");
    setActionLoading(true);

    try {
      const { data } = await api.put(
        "/api/resumes/update",
        {
          resumeId: editResumeId,
          resumeData: { title: title.trim() },
        },
        { headers: { Authorization: token } },
      );

      setAllResumes((prev) =>
        prev.map((item) =>
          item._id === editResumeId ? { ...item, title: title.trim() } : item,
        ),
      );

      setTitle("");
      setEditResumeId("");

      toast.success(data.message || "Resume title updated!");
    } catch (err) {
      const message = getErrorMessage(err);
      setModalError(message);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete resume
  const deleteResume = async () => {
    if (!deleteResumeId) return;

    setDeleteError("");
    setDeletingId(deleteResumeId);

    try {
      const { data } = await api.delete(
        `/api/resumes/delete/${deleteResumeId}`,
        {
          headers: { Authorization: token },
        },
      );

      setAllResumes((prev) =>
        prev.filter((item) => item._id !== deleteResumeId),
      );

      setDeleteResumeId("");

      toast.success(data.message || "Resume deleted successfully!");
    } catch (err) {
      const message = getErrorMessage(err);
      setDeleteError(message);
      toast.error(message);
    } finally {
      setDeletingId("");
    }
  };

  // Search resumes
  const filteredResumes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return allResumes;

    return allResumes.filter((item) =>
      item.title?.toLowerCase().includes(query),
    );
  }, [allResumes, search]);

  // Latest updated resume
  const latestResume = useMemo(() => {
    if (!allResumes.length) return null;

    return [...allResumes].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    )[0];
  }, [allResumes]);

  // Public resume count
  const publicResumeCount = allResumes.filter(
    (item) => item.public === true,
  ).length;

  // Reusable modal header
  const ModalHeader = ({ icon: Icon, title, subtitle, color = "emerald" }) => (
    <div className="mb-6 flex items-start gap-4 pr-8">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          color === "purple"
            ? "bg-purple-50 text-purple-600"
            : color === "red"
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-600"
        }`}
      >
        <Icon size={24} />
      </div>

      <div className="min-w-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );

  // Reusable modal wrapper
  const Modal = ({ children, onClose, maxWidth = "max-w-md" }) => (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-5"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative my-3 w-full ${maxWidth} shrink-0 rounded-2xl border border-white/60 bg-white p-5 shadow-2xl sm:my-5 sm:rounded-3xl sm:p-8`}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={actionLoading}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:right-5 sm:top-5"
        >
          <X size={19} />
        </button>

        {children}
      </div>
    </div>
  );

  // Reusable form field
  const TitleField = () => (
    <div>
      <label
        htmlFor="resume-title"
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        Resume title
      </label>

      <input
        id="resume-title"
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (titleError) setTitleError("");
          if (modalError) setModalError("");
        }}
        placeholder="e.g. Frontend Developer Resume"
        disabled={actionLoading}
        required
        maxLength={80}
        autoFocus
        className={`w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${titleError ? "border-red-400 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10"}`}
        aria-invalid={Boolean(titleError)}
        aria-describedby={titleError ? "resume-title-error" : undefined}
      />

      {titleError && (
        <p
          id="resume-title-error"
          className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600"
          role="alert"
        >
          <AlertCircle size={14} /> {titleError}
        </p>
      )}
      <p className="mt-1.5 text-right text-xs text-slate-400">
        {title.length}/80 characters
      </p>
    </div>
  );

  // Reusable submit button
  const SubmitButton = ({ children }) => (
    <button
      type="submit"
      disabled={actionLoading || !title.trim() || (showUploadResume && !resume)}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {actionLoading && <LoaderCircle size={18} className="animate-spin" />}
      {actionLoading ? "Please wait..." : children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        {/* Welcome Hero */}
        <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-8 text-white shadow-xl sm:px-9 sm:py-11 lg:px-12">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <Sparkles size={14} />
                Your career starts here
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Welcome back,{" "}
                <span className="text-emerald-400">
                  {user?.name?.split(" ")[0] || "there"}!
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Your next opportunity starts with a great resume. Create,
                manage, and improve your professional profile all in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400 sm:w-auto"
            >
              <Plus size={19} />
              Create New Resume
              <ArrowUpRight size={17} />
            </button>
          </div>
        </section>

        {/* Dashboard Statistics */}
        <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={23} />
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                Library
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Total Resumes
            </p>
            <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {loading ? "—" : allResumes.length}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Resumes in your account
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={23} />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Visibility
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Public Resumes
            </p>
            <h3 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              {loading ? "—" : publicResumeCount}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Resumes available to share
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <CalendarDays size={23} />
              </div>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                Activity
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Last Updated
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {loading
                ? "Loading..."
                : latestResume
                  ? formatDate(latestResume.updatedAt || latestResume.createdAt)
                  : "No activity yet"}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Your latest resume activity
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose how you want to create your resume.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={openCreateModal}
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg sm:gap-5 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 text-white shadow-lg shadow-indigo-500/20 transition group-hover:scale-110 sm:h-14 sm:w-14">
                <Plus size={27} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">Create New Resume</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Start from scratch and build your professional resume.
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-indigo-600" />
            </button>

            <button
              type="button"
              onClick={openUploadModal}
              className="group flex min-w-0 items-center gap-4 rounded-2xl border border-purple-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg sm:gap-5 sm:p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-600 text-white shadow-lg shadow-purple-500/20 transition group-hover:scale-110 sm:h-14 sm:w-14">
                <UploadCloud size={26} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">
                  Upload Existing Resume
                </h3>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                  Upload a PDF and let AI help you improve it.
                </p>
              </div>

              <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-purple-600" />
            </button>
          </div>
        </section>

        {/* Resume Collection */}
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="text-emerald-600" size={21} />
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  My Resumes
                </h2>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {allResumes.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Manage, edit, and organize your resumes.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your resumes..."
                aria-label="Search resumes"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <LoaderCircle className="h-8 w-8 animate-spin text-emerald-500" />
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                Loading your resumes
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Please wait while we prepare your dashboard.
              </p>
            </div>
          ) : error ? (
            // Error State
            <div className="rounded-2xl border border-red-100 bg-white px-5 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle size={28} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Unable to load your resumes
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={loadAllResumes}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : allResumes.length === 0 ? (
            // No Resumes State
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                <FileText size={32} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Your resume library is empty
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You haven't created any resumes yet. Start building your
                professional profile today.
              </p>

              <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  <Plus size={18} />
                  Create Resume
                </button>

                <button
                  type="button"
                  onClick={openUploadModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <UploadCloud size={18} />
                  Upload PDF
                </button>
              </div>
            </div>
          ) : filteredResumes.length === 0 ? (
            // Search Empty State
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-5 py-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No resumes found
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                We couldn't find a resume matching{" "}
                <span className="font-semibold text-slate-700">"{search}"</span>
                . Try another title or clear your search.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <X size={16} />
                Clear Search
              </button>
            </div>
          ) : (
            // Resume Cards
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">
                  Showing {filteredResumes.length} of {allResumes.length}{" "}
                  resumes
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResumes.map((item) => {
                  const originalIndex = allResumes.findIndex(
                    (r) => r._id === item._id,
                  );

                  const color = colors[originalIndex % colors.length];

                  return (
                    <article
                      key={item._id}
                      className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                    >
                      {/* Card Top */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md`}
                        >
                          <FilePenLine size={23} />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            title="Edit resume title"
                            aria-label={`Edit ${item.title}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError("");
                              setDeleteResumeId(item._id);
                            }}
                            disabled={Boolean(deletingId)}
                            title="Delete resume"
                            aria-label={`Delete ${item.title}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="mt-5 min-w-0 flex-1">
                        <h3
                          className="min-h-12 break-words text-base font-bold leading-6 text-slate-800 transition group-hover:text-emerald-700"
                          title={item.title}
                        >
                          {item.title || "Untitled Resume"}
                        </h3>

                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                          <Clock3 size={14} />
                          Updated {formatDate(item.updatedAt || item.createdAt)}
                        </div>

                        <div className="mt-3">
                          {item.public ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Private
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Open Button */}
                      <button
                        type="button"
                        onClick={() => navigate(`/app/builder/${item._id}`)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition group-hover:bg-emerald-500 group-hover:text-white"
                      >
                        Open Resume
                        <ArrowUpRight size={16} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 py-7 text-center">
          <p className="text-xs text-slate-400">
            Made with <span className="text-emerald-500">♥</span> for your next
            career opportunity.
          </p>
        </footer>
      </main>

      {/* CREATE RESUME MODAL */}
      {showCreateResume && (
        <Modal onClose={closeModals}>
          <ModalHeader
            icon={FilePenLine}
            title="Create New Resume"
            subtitle="Give your resume a name and start building your professional profile."
          />

          <form onSubmit={createResume}>
            <TitleField />
            {modalError && (
              <p
                className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {modalError}
              </p>
            )}

            <SubmitButton>
              <Plus size={18} />
              Create Resume
            </SubmitButton>

            <button
              type="button"
              onClick={closeModals}
              disabled={actionLoading}
              className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>
          </form>
        </Modal>
      )}

      {/* EDIT RESUME MODAL */}
      {editResumeId && (
        <Modal onClose={closeModals}>
          <ModalHeader
            icon={Pencil}
            title="Edit Resume Title"
            subtitle="Update the name of your existing resume."
            color="purple"
          />

          <form onSubmit={editTitle}>
            <TitleField />
            {modalError && (
              <p
                className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {modalError}
              </p>
            )}

            <SubmitButton>
              <CheckCircle2 size={18} />
              Save Changes
            </SubmitButton>

            <button
              type="button"
              onClick={closeModals}
              disabled={actionLoading}
              className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>
          </form>
        </Modal>
      )}

      {/* UPLOAD RESUME MODAL */}
      {showUploadResume && (
        <Modal onClose={closeModals} maxWidth="max-w-lg">
          <ModalHeader
            icon={UploadCloud}
            title="Upload Your Resume"
            subtitle="Upload an existing PDF and let AI help you improve your resume."
            color="purple"
          />

          <form onSubmit={uploadResume}>
            <TitleField />

            <div className="mt-5">
              <label
                htmlFor="resume-input"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition ${
                  resume
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-slate-200 bg-slate-50 hover:border-purple-400 hover:bg-purple-50/50"
                } ${actionLoading ? "pointer-events-none opacity-50" : ""}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <FileUp size={25} />
                </div>

                <p className="mt-3 break-all text-sm font-semibold text-slate-700">
                  {resume ? resume.name : "Choose your PDF resume"}
                </p>

                <p className="mt-1 text-xs text-slate-400">PDF files only</p>

                <span className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">
                  Browse Files
                </span>

                <input
                  type="file"
                  id="resume-input"
                  accept="application/pdf,.pdf"
                  disabled={actionLoading}
                  hidden
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setResume(selectedFile);
                    setFileError("");
                    setModalError("");
                    if (
                      selectedFile &&
                      !(
                        selectedFile.type === "application/pdf" ||
                        selectedFile.name.toLowerCase().endsWith(".pdf")
                      )
                    ) {
                      setResume(null);
                      setFileError(
                        "Only PDF files are accepted. Please choose a .pdf file.",
                      );
                      e.target.value = "";
                    }
                  }}
                />
              </label>
              {fileError && (
                <p
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
                  role="alert"
                >
                  <AlertCircle size={14} /> {fileError}
                </p>
              )}

              {resume && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText size={17} className="shrink-0 text-emerald-600" />
                    <span className="truncate text-xs font-medium text-emerald-800">
                      {resume.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setResume(null);
                      setFileError("");
                    }}
                    disabled={actionLoading}
                    aria-label="Remove selected PDF"
                    className="shrink-0 rounded-lg p-1.5 text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {modalError && (
              <p
                className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                role="alert"
              >
                {modalError}
              </p>
            )}
            <SubmitButton>
              <UploadCloud size={18} />
              Upload & Continue
            </SubmitButton>

            <button
              type="button"
              onClick={closeModals}
              disabled={actionLoading}
              className="mt-3 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Close
            </button>
          </form>
        </Modal>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteResumeId && (
        <Modal
          onClose={() => {
            if (!deletingId) setDeleteResumeId("");
          }}
          maxWidth="max-w-md"
        >
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Trash size={29} />
            </div>

            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Delete this resume?
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Are you sure you want to delete this resume? This action cannot be
              undone, and your resume will be permanently removed.
            </p>

            {deleteError && (
              <p
                className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-left text-sm text-red-700"
                role="alert"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setDeleteResumeId("")}
                disabled={Boolean(deletingId)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteResume}
                disabled={Boolean(deletingId)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Resume
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setDeleteResumeId("")}
              disabled={Boolean(deletingId)}
              className="mt-4 text-xs font-medium text-slate-400 underline-offset-4 transition hover:text-slate-600 hover:underline disabled:opacity-50"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
