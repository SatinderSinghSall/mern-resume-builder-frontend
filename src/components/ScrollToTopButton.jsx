import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full
        bg-gradient-to-r from-emerald-500 to-green-600 text-white
        shadow-lg shadow-emerald-500/30
        hover:scale-110 hover:shadow-xl
        active:scale-95 transition-all duration-300
        ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"}`}
    >
      <ChevronUp size={25} strokeWidth={2.5} />
    </button>
  );
};

export default ScrollToTopButton;
