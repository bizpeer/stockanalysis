"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-navy-deep backdrop-blur-md border-b border-accent-gold/20 ${
        scrolled ? "py-3 shadow-lg" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-accent-gold transition-colors">
            ONEDAYS<span className="text-accent-gold font-normal"> PE</span>
          </span>
          <span className="hidden md:inline-block h-4 w-[1px] bg-white/20 mx-2"></span>
          <span className="hidden md:inline-block text-[10px] tracking-widest text-white/50 uppercase font-medium">
            Stock Auto Analysis
          </span>
        </Link>

        {/* Right Side: Visible & Graphical Language Switcher */}
        <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setLanguage("ko")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              language === "ko"
                ? "bg-accent-gold text-navy-deep shadow-md"
                : "text-white/60 hover:text-white"
            }`}
            title="한국어"
          >
            KO
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              language === "en"
                ? "bg-accent-gold text-navy-deep shadow-md"
                : "text-white/60 hover:text-white"
            }`}
            title="English"
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
