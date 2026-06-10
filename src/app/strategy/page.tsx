"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Layers, Landmark, CheckCircle } from "lucide-react";

export default function Strategy() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const strategies = [
    {
      id: "buyout",
      title: t.strategyMenu.buyout,
      icon: <Briefcase className="w-8 h-8 text-accent-gold" />,
      desc: t.strategySection.buyoutDesc,
      details:
        language === "ko"
          ? [
              "경영권 인수를 통한 근본적인 기업 체질 개선 및 가치 제고 (Value Creation)",
              "재무 구조 최적화 및 유관 기업 M&A를 통한 볼트온(Bolt-on) 전략 실행",
              "대기업 구조조정 사업부 분사(Carve-out) 및 중견 패밀리 비즈니스 승계 거래 지원"
            ]
          : [
              "Fundamental operational improvements and value creation through control investments.",
              "Financial structure optimization and bolt-on acquisition execution.",
              "Carve-outs from large conglomerates and succession support for family-owned mid-market firms."
            ]
    },
    {
      id: "growth",
      title: t.strategyMenu.growth,
      icon: <TrendingUp className="w-8 h-8 text-accent-gold" />,
      desc: t.strategySection.growthDesc,
      details:
        language === "ko"
          ? [
              "시장 선도적 지위 및 높은 진입 장벽을 갖춘 우량 중견기업 대상 소수 지분 투자",
              "해외 진출, 신규 설비 증설(CapEx) 등 성장 자금(Expansion Capital) 공급",
              "전략적 파트너로서 마케팅, 재무, 인적 자원 등 다각도 성장 지원"
            ]
          : [
              "Minority equity investments in market-leading mid-cap firms with high entry barriers.",
              "Providing expansion capital for international roll-outs, CapEx, or technology scaling.",
              "Operational acceleration supporting marketing, governance, and talent acquisition."
            ]
    },
    {
      id: "structured",
      title: t.strategyMenu.structured,
      icon: <Layers className="w-8 h-8 text-accent-gold" />,
      desc: t.strategySection.creditDesc,
      details:
        language === "ko"
          ? [
              "안정적인 실물 자산 및 확실한 현금 흐름에 기초한 구조화 신용 (Structured Credit) 설계",
              "메자닌 (전환사채 CB, 신주인수권부사채 BW, 교환사채 EB) 투자를 통한 하방 방어 및 상방 수익 도모",
              "전통적인 은행 대출이 닿지 않는 유연한 형태의 맞춤형 오퍼튜니스틱 대출 집행"
            ]
          : [
              "Structuring credit backed by solid cash flows or high-quality corporate assets.",
              "Mezzanine investments (CB, BW, EB) to protect downside risk while participating in equity upside.",
              "Highly flexible opportunistic lending programs filling gaps left by traditional banks."
            ]
    },
    {
      id: "merchant",
      title: t.strategyMenu.merchant,
      icon: <Landmark className="w-8 h-8 text-accent-gold" />,
      desc: t.strategySection.specialDesc,
      details:
        language === "ko"
          ? [
              "자기자본(PI) 투자와 종합적 금융 자문 솔루션이 통합된 머천트 뱅킹 모델",
              "국내외 금융 네트워크를 활용한 해외 자본 매칭 및 신속한 딜 클로징 지원",
              "기업 구조조정, 특수상황(Special Situations) 딜 발굴 및 자본 투자"
            ]
          : [
              "PI (Principal Investment) model integrated with comprehensive advisory capability.",
              "Global institutional syndication, foreign capital matching, and rapid transaction execution.",
              "Special situations investment targeting corporate restructurings and distressed assets."
            ]
    }
  ];

  return (
    <div className="bg-light-gray py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
            INVESTMENT STRATEGY
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-deep">
            {language === "en" ? "Structured Solutions" : "맞춤형 투자 전략"}
          </h1>
          <p className="text-sm text-navy-deep/60 leading-relaxed font-light">
            {language === "en"
              ? "We deploy flexible capital structures designed to maximize stability and support robust business growth."
              : "안정적인 수익 구조를 보장하면서도 기업의 신속한 스케일업을 지원할 수 있는 하이브리드 자본을 공급합니다."}
          </p>
        </div>

        {/* Strategy list */}
        <div className="space-y-12">
          {strategies.map((strategy) => (
            <motion.div
              key={strategy.id}
              id={strategy.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-12 border border-black/5 rounded shadow-sm flex flex-col lg:flex-row gap-8 items-start scroll-mt-24"
            >
              <div className="lg:w-1/3 space-y-4">
                <div className="bg-navy-deep p-4 rounded text-white inline-block">
                  {strategy.icon}
                </div>
                <h2 className="text-2xl font-extrabold text-navy-deep">
                  {strategy.title}
                </h2>
                <p className="text-xs text-accent-gold font-bold uppercase tracking-wider">
                  Core Mandate
                </p>
                <p className="text-sm text-navy-deep/70 font-light leading-relaxed">
                  {strategy.desc}
                </p>
              </div>

              <div className="lg:w-2/3 w-full bg-light-gray p-6 md:p-8 rounded border border-black/5 space-y-6">
                <h3 className="text-xs font-extrabold text-navy-deep uppercase tracking-widest border-b border-black/5 pb-2">
                  Key Investment Parameters
                </h3>
                <ul className="space-y-4">
                  {strategy.details.map((detail, index) => (
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
