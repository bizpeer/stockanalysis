"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Lock, FileText, Download, ShieldCheck, LogOut, Loader2 } from "lucide-react";

export default function LPHome() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 세션 유지 확인용 간단한 LocalStorage 조회
    const session = localStorage.getItem("onedays_lp_session");
    if (session) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!mounted) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 데모용 LP 자격증명: lp@onedayspe.com / onedays2026
    setTimeout(() => {
      if (email === "lp@onedayspe.com" && password === "onedays2026") {
        setIsLoggedIn(true);
        localStorage.setItem("onedays_lp_session", email);
      } else {
        setError(t.lpPortal.error);
      }
      setLoading(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("onedays_lp_session");
  };

  const mockReports = [
    { title: "2025 Q4 Onedays Opportunity Fund I Quarterly Report", date: "2026.02.15", size: "2.4 MB" },
    { title: "Capital Call Notice - BioLogics Korea Co-Investment", date: "2025.11.02", size: "840 KB" },
    { title: "2025 Q3 Onedays Opportunity Fund I Quarterly Report", date: "2025.11.15", size: "2.1 MB" },
    { title: "Distribution Notice - EcoEnergy Group Realization", date: "2025.09.28", size: "1.2 MB" },
    { title: "2025 Onedays PE Annual ESG Integration Performance Report", date: "2025.06.30", size: "4.8 MB" }
  ];

  return (
    <div className="bg-navy-deep min-h-[80vh] flex items-center justify-center py-20 px-6 relative overflow-hidden">
      {/* Decors */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-3xl" />

      <div className="max-w-4xl w-full relative z-10">
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-navy-light/40 backdrop-blur-md border border-accent-gold/25 p-8 md:p-10 rounded shadow-2xl space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="bg-accent-gold/10 p-3 rounded-full text-accent-gold inline-block">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {t.lpPortal.title}
              </h1>
              <p className="text-xs text-white/50">
                {t.lpPortal.desc}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                  {t.lpPortal.email}
                </label>
                <input
                  type="email"
                  required
                  placeholder="lp@onedayspe.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-navy-deep/80 border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-accent-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/60">
                  {t.lpPortal.password}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-navy-deep/80 border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-accent-gold focus:outline-none"
                />
              </div>

              {error && (
                <div className="text-rose-400 text-xs font-medium border border-rose-500/20 bg-rose-500/5 px-3 py-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-gold text-navy-deep py-3 rounded text-xs font-bold hover:bg-accent-gold-dark transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.lpPortal.loggingIn}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.lpPortal.login}
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-[10px] text-white/30 border-t border-white/5 pt-4">
              Demo Credentials: <span className="font-semibold text-accent-gold">lp@onedayspe.com</span> / <span className="font-semibold text-accent-gold">onedays2026</span>
            </div>
          </motion.div>
        ) : (
          /* SECURE PORTAL DASHBOARD */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-navy-light/20 backdrop-blur-md border border-accent-gold/25 p-8 md:p-12 rounded shadow-2xl space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-accent-gold/15 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure Connection Established
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Limited Partner Secure Room
                </h1>
                <p className="text-xs text-white/60">
                  lp@onedayspe.com {t.lpPortal.welcome}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer border border-rose-500/20 bg-rose-500/5 px-4 py-2 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.lpPortal.logout}
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-accent-gold uppercase tracking-wider">
                {t.lpPortal.reports}
              </h2>

              <div className="divide-y divide-white/5 bg-navy-deep/40 rounded border border-white/5">
                {mockReports.map((report, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors gap-4"
                  >
                    <div className="flex gap-3 items-start">
                      <FileText className="w-5 h-5 text-accent-gold mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                          {report.title}
                        </h3>
                        <span className="text-[10px] text-white/40 font-mono">
                          {report.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/40 font-mono hidden md:inline">
                        {report.size}
                      </span>
                      <a
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          alert(`Downloading: ${report.title}`);
                        }}
                        className="p-2 rounded bg-accent-gold/10 hover:bg-accent-gold hover:text-navy-deep transition-all text-accent-gold cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
