import { useState } from "react";
import {
  Lock,
  Mail,
  User2,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = useState(
    urlState === "register" ? "register" : "login",
  );

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (state === "register" && !formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (
      state === "register" &&
      formData.name.trim() &&
      formData.name.trim().length < 2
    ) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  // Switch between login and register
  const switchState = () => {
    setState((prev) => (prev === "login" ? "register" : "login"));

    setErrors({});
    setServerError("");

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setShowPassword(false);

    const url = new URL(window.location.href);
    url.searchParams.set("state", state === "login" ? "register" : "login");

    window.history.replaceState({}, "", url);
  };

  // Handle API errors
  const handleApiError = (error) => {
    const status = error?.response?.status;
    const responseData = error?.response?.data;

    const message =
      responseData?.message || responseData?.error || error?.message;

    // Handle backend field validation errors
    const backendErrors = responseData?.errors || responseData?.fieldErrors;

    if (backendErrors && typeof backendErrors === "object") {
      const formattedErrors = {};

      Object.entries(backendErrors).forEach(([field, value]) => {
        formattedErrors[field] = Array.isArray(value)
          ? value[0]
          : typeof value === "string"
            ? value
            : value?.message || "Invalid value.";
      });

      setErrors((prev) => ({
        ...prev,
        ...formattedErrors,
      }));
    }

    // Custom error messages
    if (!error.response) {
      setServerError(
        "Unable to connect to the server. Please check your internet connection and try again.",
      );
    } else if (status === 400) {
      setServerError(
        message || "Invalid information. Please check your details.",
      );
    } else if (status === 401) {
      setServerError(
        message || "Incorrect email or password. Please try again.",
      );
    } else if (status === 403) {
      setServerError(
        message || "You don't have permission to perform this action.",
      );
    } else if (status === 404) {
      setServerError(
        "The authentication service could not be found. Please check the API connection.",
      );
    } else if (status === 409) {
      setServerError(message || "An account with this email already exists.");
    } else if (status === 422) {
      setServerError(message || "Please correct the highlighted information.");
    } else if (status >= 500) {
      setServerError(
        "Something went wrong on our server. Please try again later.",
      );
    } else {
      setServerError(message || "Something went wrong. Please try again.");
    }

    toast.error("Unable to complete your request.");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setServerError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await api.post(`/api/users/${state}`, {
        ...formData,
        email: formData.email.trim(),
        name: formData.name.trim(),
      });

      dispatch(login(data));

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success(
        data.message ||
          (state === "login"
            ? "Welcome back!"
            : "Account created successfully!"),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-green-200/40 blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 size-80 rounded-full bg-emerald-200/40 blur-[100px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/50 transition-all duration-300 sm:p-10 ${
            loading ? "pointer-events-none" : ""
          }`}
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <a href="/" aria-label="Go to home">
              <img
                src="/logo.svg"
                alt="Resume Builder"
                className="h-10 w-auto object-contain"
              />
            </a>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-green-50">
              {state === "login" ? (
                <Lock className="size-6 text-green-600" />
              ) : (
                <User2 className="size-6 text-green-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {state === "login" ? "Welcome back!" : "Create your account"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {state === "login"
                ? "Sign in to continue building your professional resume."
                : "Join us and create a resume that stands out."}
            </p>
          </div>

          {/* Server Error Panel */}
          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-red-800">
                  {statusHeading(serverError)}
                </h3>

                <p className="mt-1 break-words text-xs leading-5 text-red-700">
                  {serverError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setServerError("")}
                disabled={loading}
                aria-label="Dismiss error"
                className="h-fit text-red-500 transition hover:text-red-700"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Name Field */}
          {state === "register" && (
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <div
                className={`flex h-12 items-center gap-3 rounded-xl border px-4 transition-all ${
                  errors.name
                    ? "border-red-400 bg-red-50/30 focus-within:ring-2 focus-within:ring-red-100"
                    : "border-slate-200 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100"
                }`}
              >
                <User2 size={18} className="shrink-0 text-slate-400" />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>

              {errors.name && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                  <AlertCircle size={13} />
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email Address
            </label>

            <div
              className={`flex h-12 items-center gap-3 rounded-xl border px-4 transition-all ${
                errors.email
                  ? "border-red-400 bg-red-50/30 focus-within:ring-2 focus-within:ring-red-100"
                  : "border-slate-200 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100"
              }`}
            >
              <Mail size={18} className="shrink-0 text-slate-400" />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />
            </div>

            {errors.email && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <AlertCircle size={13} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div
              className={`flex h-12 items-center gap-3 rounded-xl border px-4 transition-all ${
                errors.password
                  ? "border-red-400 bg-red-50/30 focus-within:ring-2 focus-within:ring-red-100"
                  : "border-slate-200 bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100"
              }`}
            >
              <Lock size={18} className="shrink-0 text-slate-400" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete={
                  state === "login" ? "current-password" : "new-password"
                }
                aria-invalid={!!errors.password}
                className="h-full w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <button
                type="button"
                disabled={loading}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="shrink-0 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <AlertCircle size={13} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          {state === "login" && (
            <div className="mb-6 flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  toast("Forgot password functionality coming soon!")
                }
                className="text-sm font-medium text-green-600 transition hover:text-green-700 hover:underline disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 hover:shadow-green-500/30 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-green-400 disabled:opacity-80"
          >
            {loading ? (
              <>
                <LoaderCircle className="size-5 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                {state === "login" ? "Sign In" : "Create Account"}

                <CheckCircle2 size={17} />
              </>
            )}
          </button>

          {/* Switch Login / Register */}
          <div className="mt-7 text-center">
            <p className="text-sm text-slate-500">
              {state === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={switchState}
                disabled={loading}
                className="ml-1 font-semibold text-green-600 transition hover:text-green-700 hover:underline disabled:cursor-not-allowed"
              >
                {state === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-400">
              Build your future, one resume at a time.
            </p>
          </div>
        </form>
      </div>

      {/* Full Screen Loading Overlay */}
      {loading && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Authentication in progress"
        >
          <div className="w-full max-w-xs rounded-2xl border border-white/60 bg-white p-8 text-center shadow-2xl">
            <div className="relative mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-green-50">
              <LoaderCircle className="size-9 animate-spin text-green-500" />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {state === "login"
                ? "Signing you in..."
                : "Creating your account..."}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please wait while we securely process your request.
            </p>

            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom error heading
const statusHeading = (message) => {
  if (message.toLowerCase().includes("already exists")) {
    return "Account already exists";
  }

  if (message.toLowerCase().includes("connect")) {
    return "Connection problem";
  }

  if (message.toLowerCase().includes("incorrect")) {
    return "Authentication failed";
  }

  if (message.toLowerCase().includes("not found")) {
    return "Service unavailable";
  }

  return "Something went wrong";
};

export default Login;
