
import { Link } from "react-router-dom";
import HomeNavbar from "../HomeNavbar";

const Hero = () => {
  const brands = [
    "Instagram",
    "Framer",
    "Microsoft",
    "Huawei",
    "Walmart",
  ];

  return (
    <>
      {/* Home Navbar */}
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-white pb-16">

        {/* Background Gradient */}
        <div className="pointer-events-none absolute left-1/2 top-20 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-300 opacity-30 blur-[100px] sm:h-96 sm:w-96 lg:h-[500px] lg:w-[500px]" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-5 text-center sm:px-8 lg:px-16 xl:px-24">

          {/* Avatars + Rating */}
          <div className="mt-16 flex items-center gap-3 sm:mt-20">

            <div className="flex -space-x-3">
              {[
                { name: "Alex", color: "bg-blue-600" },
                { name: "Sam", color: "bg-purple-600" },
                { name: "John", color: "bg-orange-500" },
                { name: "Mike", color: "bg-pink-600" },
                { name: "David", color: "bg-green-600" },
              ].map((person, index) => (
                <div
                  key={person.name}
                  title={person.name}
                  className={`flex size-9 items-center justify-center rounded-full border-2 border-white ${person.color} text-xs font-semibold text-white shadow-sm`}
                  style={{ zIndex: 10 - index }}
                >
                  {person.name.charAt(0)}
                </div>
              ))}
            </div>

            <div className="text-left">
              <div className="flex gap-0.5 text-green-600">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className="size-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-xs text-slate-600 sm:text-sm">
                Used by 10,000+ users
              </p>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="mt-8 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.15]">
            Land your dream job with{" "}
            <span className="bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              AI-powered
            </span>{" "}
            resumes.
          </h1>

          {/* Description */}
          <p className="my-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Create, edit and download professional resumes with
            AI-powered assistance. Build your future with a resume
            that stands out.
          </p>

          {/* CTA Buttons */}
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">

            <Link
              to="/app?state=register"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green-500 px-9 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl active:scale-95 sm:w-auto"
            >
              Get started

              <svg
                className="size-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <a
              href="#features"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-8 text-sm font-medium text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-green-50 sm:w-auto"
            >
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m10 9 5 3-5 3z" />
              </svg>

              Explore features
            </a>
          </div>

          {/* Trust Section */}
          <div className="mt-20 w-full border-t border-slate-100 pt-10 sm:mt-24">

            <p className="mb-8 text-sm font-medium text-slate-500 sm:text-base">
              Trusted by professionals and teams worldwide
            </p>

            {/* Brand Names instead of broken images */}
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">

              {brands.map((brand) => (
                <span
                  key={brand}
                  className="text-base font-bold tracking-tight text-slate-400 transition duration-300 hover:text-green-600 sm:text-xl"
                >
                  {brand}
                </span>
              ))}

            </div>
          </div>

          {/* Bottom Decorative Text */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <svg
                className="size-4 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Professional templates
            </span>

            <span className="hidden text-slate-300 sm:inline">•</span>

            <span>AI-powered assistance</span>

            <span className="hidden text-slate-300 sm:inline">•</span>

            <span>Easy PDF downloads</span>
          </div>

        </div>
      </section>
    </>
  );
};

export default Hero;
