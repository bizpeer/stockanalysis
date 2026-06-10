"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Compass, Coins, Landmark, Scale, CheckCircle } from "lucide-react";

export default function Finance() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const services = [
    {
      id: "ma",
      title: t.financeMenu.ma,
      icon: <Compass className="w-8 h-8 text-accent-gold" />,
      desc:
        language === "ko"
          ? "국내외 기업 M&A 거래 자문 및 정교한 인수/매각 전략 수립"
          : "Buy-side and sell-side advisory for cross-border and domestic M&A transactions.",
      details:
        language === "ko"
          ? [
              "매수자/매도자 실사(Due Diligence) 관리 및 최적의 협상 조건 설계",
              "시너지 창출이 가능한 전략적 및 재무적 인수 대상 기업 발굴",
              "PMI (Post-Merger Integration) 자문을 통한 기업 가치 제고 계획 수립"
            ]
          : [
              "Managing buyer/seller due diligence and structural negotiations.",
              "Identifying high-value acquisition targets delivering strategic synergy.",
              "Developing value-creation blueprints for post-merger integration (PMI)."
            ]
    },
    {
      id: "raising",
      title: t.financeMenu.raising,
      icon: <Coins className="w-8 h-8 text-accent-gold" />,
      desc:
        language === "ko"
          ? "대규모 설비 투자, 지분 매각, 채권 발행 등 자본 조달 총괄 자문"
          : "Comprehensive capital syndication for expansion capital, block deals, and debt issuance.",
      details:
        language === "ko"
          ? [
              "해외 연기금, 대형 기관 투자자, 시중 금융기관 매칭 및 펀딩 신디케이션",
              "지분 투자(Equity)와 대출(Debt)이 복합적으로 연결된 최적의 자산 구성(Capital Stack) 기획",
              "정부 지원 펀드 및 메자닌 자본 연계 자문"
            ]
          : [
              "Syndicating investments with institutional LPs, commercial banks, and foreign wealth funds.",
              "Designing corporate capital stacks balancing equity and non-dilutive credit.",
              "Connecting client firms with state-backed growth funds and private mezzanine groups."
            ]
    },
    {
      id: "acquisition",
      title: t.financeMenu.acquisition,
      icon: <Landmark className="w-8 h-8 text-accent-gold" />,
      desc:
        language === "ko"
          ? "경영권 M&A 및 기업 인수를 지원하는 고성능 인수금융 설계"
          : "Tailored acquisition financing to facilitate strategic corporate M&A.",
      details:
        language === "ko"
          ? [
              "LBO (Leveraged Buyout) 금융 구조화 및 리스크 관리 계획 수립",
              "선순위, 중순위(Mezzanine), 후순위 대출 신디케이션 주선",
              "차입 한도 및 금리 헤지 계약 최적화 조건 도출"
            ]
          : [
              "Architecting Leveraged Buyout (LBO) financing models with strict risk parameters.",
              "Syndicating senior, mezzanine, and junior debt layers.",
              "Optimizing borrowing covenants and interest rate hedge agreements."
            ]
    },
    {
      id: "restructure",
      title: t.financeMenu.restructure,
      icon: <Scale className="w-8 h-8 text-accent-gold" />,
      desc:
        language === "ko"
          ? "재무적 곤경 및 구조조정 상황에서의 오퍼튜니스틱 회생 자문"
          : "Advisory services for capital restructurings, debt workouts, and corporate reorganizations.",
      details:
        language === "ko"
          ? [
              "채권단 협상 조율 및 채무 재조정 (Debt Restructuring) 모델링",
              "한계 자산 매각 및 비핵심 사업부 신속 정리 자문",
              "신규 DIP (Debtor-in-Possession) 금융 조달 매칭"
            ]
          : [
              "Coordinating creditor talks and debt restructuring plans.",
              "Advising on rapid non-core asset sales and business carve-outs.",
              "Matching distressed firms with specialized DIP financing."
            ]
    }
  ];

  return (
    <div className="bg-light-gray py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
            CORPORATE FINANCE ADVISORY
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-deep">
            {language === "en" ? "Strategic Advisory Services" : "기업 금융 자문"}
          </h1>
          <p className="text-sm text-navy-deep/60 leading-relaxed font-light">
            {language === "en"
              ? "We provide tactical advisory services designed to solve complex corporate capital dilemmas."
              : "정교한 딜 메이킹 역량을 바탕으로 기업의 중대한 자본 애로사항을 해결하는 자문 서비스를 제공합니다."}
          </p>
        </div>

        {/* Services list */}
        <div className="space-y-12">
          {services.map((service) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-12 border border-black/5 rounded shadow-sm flex flex-col lg:flex-row gap-8 items-start scroll-mt-24"
            >
              <div className="lg:w-1/3 space-y-4">
                <div className="bg-navy-deep p-4 rounded text-white inline-block">
                  {service.icon}
                </div>
                <h2 className="text-2xl font-extrabold text-navy-deep">
                  {service.title}
                </h2>
                <p className="text-sm text-navy-deep/70 font-light leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="lg:w-2/3 w-full bg-light-gray p-6 md:p-8 rounded border border-black/5 space-y-6">
                <h3 className="text-xs font-extrabold text-navy-deep uppercase tracking-widest border-b border-black/5 pb-2">
                  Advisory Scope & Execution
                </h3>
                <ul className="space-y-4">
                  {service.details.map((detail, index) => (
                    <li key={index} className="flex gap-3 items-start text-xs text-navy-deep/80 leading-relaxed font-light">
                      <CheckCircle className="w-4.5 h-4.5 text-accent-gold flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
