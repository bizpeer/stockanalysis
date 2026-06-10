"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { getPortfolioItems } from "@/lib/contentService";

export default function Portfolio() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "realized">("all");
  interface PortfolioData { name: string; industry: string; type: string; status: string; entry: string; exit: string; irr: string; description: string; }
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioData[]>([]);

  useEffect(() => {
    setMounted(true);
    const fetchPortfolio = async () => {
      try {
        const items = await getPortfolioItems();
        // Map database schema to the page UI fields based on locale
        const mapped = items.map(item => ({
          name: item.name,
          industry: language === "ko" ? item.industry_ko : item.industry_en,
          type: language === "ko" ? item.type_ko : item.type_en,
          status: item.status,
          entry: item.entry,
          exit: item.exit || "",
          irr: item.irr || "",
          description: language === "ko" ? item.description_ko : item.description_en
        }));
        setPortfolioCompanies(mapped);
      } catch (e) {
        console.error("Error fetching portfolio items:", e);
      }
    };
    fetchPortfolio();
  }, [language]);


  if (!mounted) return null;



  const filteredCompanies = portfolioCompanies.filter(comp => {
    if (filter === "all") return true;
    return comp.status === filter;
  });

  return (
    <div className="bg-light-gray py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
            PORTFOLIO & TRACK RECORD
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-deep">
            {language === "en" ? "Investment Portfolio" : "투자 실적 및 포트폴리오"}
          </h1>
          <p className="text-sm text-navy-deep/60 leading-relaxed font-light">
            {language === "en"
              ? "We partner with leading mid-market companies to drive operational excellence and capital efficiency."
              : "탁월한 시장 리더 기업들과 협력하여 비즈니스 모델 혁신과 최적의 자본 효율성을 지원해왔습니다."}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-12">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === "all"
                ? "bg-navy-deep text-white shadow-md"
                : "bg-white text-navy-deep/60 hover:text-navy-deep border border-black/5"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            All ({portfolioCompanies.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              filter === "active"
                ? "bg-navy-deep text-white shadow-md"
                : "bg-white text-navy-deep/60 hover:text-navy-deep border border-black/5"
            }`}
          >
            {t.portfolioMenu.current} ({portfolioCompanies.filter(c => c.status === "active").length})
          </button>
          <button
            onClick={() => setFilter("realized")}
            className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
              filter === "realized"
                ? "bg-navy-deep text-white shadow-md"
                : "bg-white text-navy-deep/60 hover:text-navy-deep border border-black/5"
            }`}
          >
            {t.portfolioMenu.realized} ({portfolioCompanies.filter(c => c.status === "realized").length})
          </button>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((deal, index) => (
            <motion.div
              key={deal.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white border border-black/5 p-8 rounded shadow-sm flex flex-col justify-between hover:border-accent-gold transition-colors duration-300"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent-gold bg-accent-gold/10 px-2 py-0.5 rounded">
                      {deal.industry}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded ${
                      deal.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {deal.status === "active" ? "Active" : "Realized"}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-navy-deep">{deal.name}</h3>
                  <p className="text-xs font-medium text-navy-deep/60">
                    {deal.type}
                  </p>
                </div>

                <p className="text-xs text-navy-deep/75 leading-relaxed font-light">
                  {deal.description}
                </p>
              </div>

              <div className="border-t border-black/5 mt-8 pt-4 flex justify-between items-center text-xs font-mono text-navy-deep/50">
                <div>
                  Entry: <span className="font-bold text-navy-deep">{deal.entry}</span>
                </div>
                {deal.status === "realized" && deal.exit && (
                  <div>
                    Exit: <span className="font-bold text-navy-deep">{deal.exit}</span>
                    {deal.irr && (
                      <span className="ml-2 bg-accent-gold/20 text-accent-gold-dark font-bold px-1.5 py-0.5 rounded text-[10px]">
                        IRR {deal.irr}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
