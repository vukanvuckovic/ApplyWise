"use client";
import { ArrowUp } from "iconsax-react";
import React, { useEffect, useState } from "react";

const BackToTop = () => {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`transition-all duration-300 ${
        showBtn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      } h-10 w-10 rounded-full flex justify-center items-center border border-gray-200 bg-white/80 backdrop-blur-lg custom-shadow hover:bg-gray-50 fixed bottom-6 right-6 z-40`}
    >
      <ArrowUp size={16} color="#6b7280" />
    </button>
  );
};

export default BackToTop;
