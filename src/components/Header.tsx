"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const navItems = [
    {
      name: t.nav.about,
      key: "about",
      subItems: [
        { name: t.aboutMenu.overview, href: "/about#overview" },
        { name: t.aboutMenu.leadership, href: "/about#leadership" },
        { name: t.aboutMenu.governance, href: "/about#governance" },
        { name: t.aboutMenu.network, href: "/about#network" },
      ],
    },
    {
      name: t.nav.strategy,
      key: "strategy",
      subItems: [
        { name: t.strategyMenu.buyout, href: "/strategy#buyout" },
        { name: t.strategyMenu.growth, href: "/strategy#growth" },
        { name: t.strategyMenu.mezzanine, href: "/strategy#mezzanine" },
        { name: t.strategyMenu.structured, href: "/strategy#structured" },
        { name: t.strategyMenu.merchant, href: "/strategy#merchant" },
      ],
    },
    {
      name: t.nav.finance,
      key: "finance",
      subItems: [
        { name: t.financeMenu.ma, href: "/finance#ma" },
        { name: t.financeMenu.raising, href: "/finance#raising" },
        { name: t.financeMenu.acquisition, href: "/finance#acquisition" },
        { name: t.financeMenu.restructure, href: "/finance#restructure" },
        { name: t.financeMenu.strategic, href: "/finance#strategic" },
      ],
    },
    {
      name: t.nav.portfolio,
      key: "portfolio",
      subItems: [
        { name: t.portfolioMenu.current, href: "/portfolio#current" },
        { name: t.portfolioMenu.realized, href: "/portfolio#realized" },
        { name: t.portfolioMenu.cases, href: "/portfolio#cases" },
      ],
    },
    {
      name: t.nav.industries,
      key: "industries",
      subItems: [
        { name: t.industriesMenu.healthcare, href: "/industries#healthcare" },
        { name: t.industriesMenu.industrial, href: "/industries#industrial" },
        { name: t.industriesMenu.tech, href: "/industries#tech" },
        { name: t.industriesMenu.consumer, href: "/industries#consumer" },
        { name: t.industriesMenu.energy, href: "/industries#energy" },
      ],
    },
    {
      name: t.nav.investors,
      key: "investors",
      subItems: [
        { name: t.investorsMenu.overview, href: "/investors#overview" },
        { name: t.investorsMenu.lpPortal, href: "/lp-portal" },
        { name: t.investorsMenu.reporting, href: "/investors#reporting" },
      ],
    },
    {
      name: t.nav.insights,
      key: "insights",
      subItems: [
        { name: t.insightsMenu.news, href: "/insights#news" },
        { name: t.insightsMenu.market, href: "/insights#market" },
        { name: t.insightsMenu.trends, href: "/insights#trends" },
      ],
    },
    {
      name: t.nav.careers,
      key: "careers",
      subItems: [
        { name: t.careersMenu.positions, href: "/careers#positions" },
        { name: t.careersMenu.internship, href: "/careers#internship" },
        { name: t.careersMenu.culture, href: "/careers#culture" },
      ],
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-deep/95 backdrop-blur-md border-b border-accent-gold/20 py-3 shadow-lg"
          : "bg-transparent py-5"
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
            Structured Capital
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.key}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.key)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-accent-gold py-2 transition-colors cursor-pointer">
                {item.name}
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Dropdown Box */}
              {activeDropdown === item.key && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 bg-navy-deep border border-accent-gold/20 rounded shadow-2xl overflow-hidden py-1 animate-fadeIn">
                  {item.subItems.map((sub, index) => (
                    <Link
                      key={index}
                      href={sub.href}
                      className="block px-4 py-2.5 text-xs text-white/70 hover:text-navy-deep hover:bg-accent-gold transition-colors font-medium border-b border-white/5 last:border-0"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/contact"
            className="text-xs font-semibold uppercase tracking-wider text-accent-gold hover:text-white border border-accent-gold hover:bg-accent-gold/10 px-4 py-2 rounded transition-all duration-300"
          >
            {t.nav.contact}
          </Link>
        </nav>

        {/* Right Side: Visible & Graphical Language Switcher */}
        <div className="hidden lg:flex items-center gap-3 ml-4 bg-white/5 p-1 rounded-full border border-white/10">
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

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Mobile Language Selector (Simple Switch) */}
          <div className="flex items-center bg-white/5 rounded-md p-0.5 border border-white/10">
            <button
              onClick={() => setLanguage(language === "ko" ? "en" : "ko")}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-accent-gold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              {language.toUpperCase()}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-accent-gold p-1"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-navy-deep border-b border-accent-gold/20 max-h-[85vh] overflow-y-auto shadow-2xl">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="text-sm font-bold text-accent-gold border-b border-white/5 pb-1">
                  {item.name}
                </div>
                <div className="grid grid-cols-2 gap-2 pl-2 py-1">
                  {item.subItems.map((sub, index) => (
                    <Link
                      key={index}
                      href={sub.href}
                      onClick={() => setIsOpen(false)}
                      className="text-xs text-white/70 hover:text-accent-gold py-1.5"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs font-bold text-navy-deep bg-accent-gold py-2.5 rounded hover:bg-accent-gold-dark transition-colors"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
