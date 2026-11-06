import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  LogOut,
  UserRound,
  X,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Mail,
  CalendarDays,
  Clock3,
  ChevronDown,
  User,
} from "lucide-react";

import { logout } from "../app/features/authSlice";

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "Email not available";

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  // Prevent background scrolling while logout modal is open.
  useEffect(() => {
    if (!showLogoutModal) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showLogoutModal]);

  // Logout
  const logoutUser = () => {
    try {
      setIsLoggingOut(true);

      localStorage.removeItem("token");
      dispatch(logout());

      setShowLogoutModal(false);
      setShowProfile(false);

      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const closeLogoutModal = () => {
    if (isLoggingOut) return;
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6 lg:px-10">
          {/* LOGO */}
          <Link
            to="/"
            className="flex shrink-0 items-center transition-transform duration-200 hover:scale-[1.02]"
          >
            <img
              src="/logo.svg"
              alt="Resume Builder"
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 sm:gap-5">
            {/* USER PROFILE TRIGGER + POPOVER */}
            <div
              className="relative"
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
              onFocus={() => setShowProfile(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setShowProfile(false);
                }
              }}
            >
              <button
                type="button"
                onClick={() => setShowProfile((prev) => !prev)}
                aria-expanded={showProfile}
                aria-label="View account information"
                className="group flex items-center gap-2 rounded-full p-1.5 pr-2 transition hover:bg-slate-100 sm:gap-3 sm:pr-3"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-100 text-xs font-bold text-emerald-700 shadow-sm sm:h-10 sm:w-10 sm:text-sm">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={userName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* User Name */}
                <div className="hidden text-left sm:block">
                  <p className="text-[11px] font-medium text-slate-400">
                    Welcome back
                  </p>

                  <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
                    {userName}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`hidden text-slate-400 transition-transform sm:block ${
                    showProfile ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* PROFILE POPOVER */}
              {showProfile && (
                <div
                  role="region"
                  aria-label="User account details"
                  className="absolute right-0 top-full z-[60] mt-3 w-[min(340px,calc(100vw-24px))] origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
                    {/* Profile Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-emerald-950 p-5 text-white">
                      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />

                      <div className="relative flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-lg font-bold text-emerald-300">
                          {user?.image ? (
                            <img
                              src={user.image}
                              alt={userName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold">
                            {userName}
                          </h3>

                          <p className="mt-1 truncate text-xs text-slate-300">
                            {userEmail}
                          </p>

                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Account
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="p-4">
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Account Information
                      </p>

                      <div className="space-y-3">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <User size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-slate-400">
                              Full Name
                            </p>
                            <p className="break-words text-sm font-semibold text-slate-700">
                              {user?.name || "Not available"}
                            </p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Mail size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-slate-400">
                              Email Address
                            </p>
                            <p className="break-all text-sm font-semibold text-slate-700">
                              {user?.email || "Not available"}
                            </p>
                          </div>
                        </div>

                        {/* Account Created */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                            <CalendarDays size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-slate-400">
                              Account Created
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {formatDate(user?.createdAt || user?.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Account Updated */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                            <Clock3 size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] text-slate-400">
                              Last Updated
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {formatDate(user?.updatedAt || user?.updated_at)}
                            </p>
                          </div>
                        </div>

                        {/* Optional Phone */}
                        {user?.phone && (
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                              <UserRound size={16} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] text-slate-400">
                                Phone
                              </p>
                              <p className="text-sm font-semibold text-slate-700">
                                {user.phone}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
                        <ShieldCheck
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />
                        <p className="text-xs leading-5 text-emerald-800">
                          Your account information is protected.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            {/* LOGOUT BUTTON */}
            <button
              type="button"
              onClick={() => {
                setShowProfile(false);
                setShowLogoutModal(true);
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 sm:px-5"
            >
              <LogOut
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />

              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </nav>
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 px-3 py-5 backdrop-blur-sm sm:px-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="relative my-auto max-h-[92dvh] w-full max-w-[420px] overflow-y-auto overscroll-contain rounded-3xl border border-white/60 bg-white p-5 shadow-2xl shadow-slate-950/20 animate-in fade-in zoom-in-95 duration-200 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={closeLogoutModal}
              aria-label="Close logout dialog"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:right-5 sm:top-5"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
              <LogOut size={28} />
            </div>

            {/* Heading */}
            <div className="mt-5 text-center">
              <h2
                id="logout-title"
                className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
              >
                Ready to leave?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to log out of your account? Your progress
                is saved, and you can come back anytime.
              </p>
            </div>

            {/* User Information */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-500">{userEmail}</p>
              </div>

              <ShieldCheck size={21} className="shrink-0 text-emerald-500" />
            </div>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={closeLogoutModal}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stay logged in
              </button>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={logoutUser}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut size={17} />
                    Yes, logout
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Sparkles size={13} className="text-emerald-500" />
              Thanks for using Resume Builder!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
