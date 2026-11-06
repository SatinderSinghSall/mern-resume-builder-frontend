import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomeNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#cta" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="shrink-0">
          <img
            src="/logo.svg"
            alt="Resume Builder"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-green-600"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link
              to="/app"
              className="rounded-full bg-green-500 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/app?state=register"
                className="rounded-full bg-green-500 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
              >
                Get started
              </Link>

              <Link
                to="/app?state=login"
                className="rounded-full border border-slate-300 px-7 py-2.5 text-sm font-medium text-slate-700 transition hover:border-green-500 hover:bg-green-50 active:scale-95"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-green-50 md:hidden"
        >
          {menuOpen ? (
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m18 6-12 12M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "max-h-[450px] opacity-100"
            : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-600"
            >
              {link.name}
            </a>
          ))}

          <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-4">
            {user ? (
              <Link
                to="/app"
                onClick={closeMenu}
                className="rounded-full bg-green-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-600"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/app?state=register"
                  onClick={closeMenu}
                  className="rounded-full bg-green-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-600"
                >
                  Get started
                </Link>

                <Link
                  to="/app?state=login"
                  onClick={closeMenu}
                  className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeNavbar;
