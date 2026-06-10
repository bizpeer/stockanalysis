"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-deep text-white/60 border-t border-accent-gold/20 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-wider text-white">
              ONEDAYS<span className="text-accent-gold font-normal"> PE</span>
            </span>
          </Link>
          <p className="text-xs max-w-sm leading-relaxed text-white/50">
            {t.footer.disclaimer}
          </p>
          <p className="text-xs text-white/40">
            {t.footer.address} <br />
            {t.footer.phone}
          </p>
        </div>

        {/* Quick Links 1 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-gold">
            SERVICES
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/strategy#buyout" className="hover:text-white transition-colors">
                {t.strategyMenu.buyout}
              </Link>
            </li>
            <li>
              <Link href="/strategy#structured" className="hover:text-white transition-colors">
                {t.strategyMenu.structured}
              </Link>
            </li>
            <li>
              <Link href="/finance#ma" className="hover:text-white transition-colors">
                {t.financeMenu.ma}
              </Link>
            </li>
            <li>
              <Link href="/finance#acquisition" className="hover:text-white transition-colors">
                {t.financeMenu.acquisition}
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links 2 */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-accent-gold">
            PORTAL & INQUIRY
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/lp-portal" className="hover:text-white transition-colors">
                {t.investorsMenu.lpPortal}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                {t.nav.contact}
              </Link>
            </li>
            <li>
              <Link href="/careers#positions" className="hover:text-white transition-colors">
                {t.careersMenu.positions}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
        <div>{t.footer.copyright}</div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
