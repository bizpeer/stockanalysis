"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep text-white/60 border-t border-accent-gold/20 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Info */}
        <div className="space-y-2 text-center md:text-left">
          <Link href="/" className="inline-block">
            <span className="text-xl font-black tracking-wider text-white">
              ONEDAYS<span className="text-accent-gold font-normal"> PE</span>
            </span>
          </Link>
          <p className="text-[10px] max-w-md leading-relaxed text-white/40">
            {t.footer.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="text-xs text-white/30 text-center md:text-right">
          <div>{t.footer.copyright}</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
