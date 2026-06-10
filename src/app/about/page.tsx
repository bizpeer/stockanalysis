"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Shield, Network, Landmark } from "lucide-react";

export default function About() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const leaders = [
    {
      name: language === "en" ? "Jun-seo Kim" : "김준서",
      title: language === "en" ? "Managing Partner & CEO" : "대표 파트너 / CEO",
      bio:
        language === "en"
          ? "Former Head of Korea at Global PEF & Corporate Finance division leader. Over 20 years of investment track record in Asia and Korea."
          : "前 글로벌 사모펀드 한국 대표 및 대형 IB 부문장 역임. 20년 이상의 아시아 및 한국 시장 투자 경력 보유.",
      image: "JS",
    },
    {
      name: language === "en" ? "Hyun-woo Lee" : "이현우",
      title: language === "en" ? "Partner, Investment Division" : "투자 부문 파트너",
      bio:
        language === "en"
          ? "Specialist in structured credit and mezzanine investments. Led numerous corporate restructurings and acquisition financing structures."
          : "구조화 신용 및 메자닌 투자 스페셜리스트. 다양한 기업 자산 재조정 및 인수금융 설계 주도.",
      image: "HW",
    },
    {
      name: language === "en" ? "Sarah Park" : "Sarah Park",
      title: language === "en" ? "Partner, Cross-Border Advisory" : "크로스보더 자문 부문 파트너",
      bio:
        language === "en"
          ? "Expert in US-Asia M&A advisory. Led multiple cross-border transactions and foreign capital attractions."
          : "미국 및 아시아 지역 M&A 자문 전문가. 다수의 해외 자본 유치 및 크로스보더 딜 성사 경험.",
      image: "SP",
    },
  ];

  const sections = [
    {
      id: "overview",
      title: t.aboutMenu.overview,
      icon: <Landmark className="w-8 h-8 text-accent-gold" />,
      content: (
        <div className="space-y-6 text-sm text-navy-deep/80 leading-relaxed font-light">
          <p>
            {language === "en"
              ? "Onedays PE is an institutional private equity firm specializing in mid-market opportunities, structured capital solutions, and merchant banking. We combine the disciplined investing of private equity with the strategic agility of corporate finance advisory."
              : "원데이즈PE는 중견·중소기업 성장 및 구조화 자본 솔루션, 머천트 뱅킹 자문에 특화된 글로벌 사모투자 전문 회사입니다. 당사는 사모펀드의 철저한 투자 원칙과 기업금융 자문의 전략적 기민함을 결합하여 차별화된 가치를 창출합니다."}
          </p>
          <p>
            {language === "en"
              ? "We target companies undergoing ownership transitions, requiring expansion capital, or seeking optimized capital structures through structured credit, asset-backed finance, and equity investments."
              : "경영권 승계 과정에 있거나, 글로벌 확장을 위해 추가 자본이 필요하거나, 구조화 신용 및 지분 투자를 통해 최적의 자본 구조를 설계하고자 하는 우량 기업들이 당사의 핵심 파트너입니다."}
          </p>
        </div>
      ),
    },
    {
      id: "governance",
      title: t.aboutMenu.governance,
      icon: <Shield className="w-8 h-8 text-accent-gold" />,
      content: (
        <div className="space-y-6 text-sm text-navy-deep/80 leading-relaxed font-light">
          <p>
            {language === "en"
              ? "We maintain the highest standards of regulatory compliance, fiduciary responsibility, and transparency. Our internal risk management committee independently evaluates all investments to protect our LP partners."
              : "원데이즈PE는 업계 최고 수준의 거버넌스와 컴플라이언스 기준을 준수합니다. 독립적인 리스크 관리 위원회와 내부 통제 시스템을 통해 엄격하게 리스크를 분별하며, 출자자(LP)의 자산을 철저히 보호합니다."}
          </p>
          <p>
            {language === "en"
              ? "ESG integration is a core pillar of our investment process, ensuring sustainable value creation across all portfolio companies."
              : "또한 ESG 가치를 투자 프로세스 전반에 통합하여 포트폴리오 기업들의 지속 가능한 동반 성장을 도모하고 있습니다."}
          </p>
        </div>
      ),
    },
    {
      id: "network",
      title: t.aboutMenu.network,
      icon: <Network className="w-8 h-8 text-accent-gold" />,
      content: (
        <div className="space-y-6 text-sm text-navy-deep/80 leading-relaxed font-light">
          <p>
            {language === "en"
              ? "With offices and strategic affiliates in Seoul, Singapore, and New York, Onedays PE leverages a global network of financial institutions, industry experts, and co-investment partners to facilitate cross-border transactions."
              : "서울, 싱가포르, 뉴욕의 글로벌 거점을 바탕으로 다국적 금융기관, 산업 전문가 네트워크, 공동 투자 파트너들과 긴밀히 공조하고 있습니다. 이를 통해 국경을 넘나드는 크로스보더(Cross-border) 자문 및 투자 집행을 기민하게 추진합니다."}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-light-gray py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
            ABOUT ONEDAYS PE
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-navy-deep">
            {language === "en" ? "Firm Overview & Mission" : "회사 소개 및 미션"}
          </h1>
          <p className="text-sm text-navy-deep/60 leading-relaxed font-light">
            {language === "en"
              ? "A hybrid platform of Private Equity, Structured Credit, and M&A Advisory."
              : "사모펀드 투자, 구조화 신용, 그리고 M&A 자문이 결합된 하이브리드 투자 플랫폼."}
          </p>
        </div>

        {/* Sections: Overview, Governance, Network */}
        <div className="space-y-12 mb-24">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-12 border border-black/5 rounded shadow-sm flex flex-col md:flex-row gap-8 items-start scroll-mt-24"
            >
              <div className="bg-navy-deep p-4 rounded text-white flex-shrink-0">
                {section.icon}
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-navy-deep">{section.title}</h2>
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leadership Section */}
        <div className="scroll-mt-24" id="leadership">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="h-1 w-12 bg-accent-gold" />
            <h2 className="text-3xl font-extrabold text-navy-deep">{t.aboutMenu.leadership}</h2>
            <p className="text-sm text-navy-deep/60">
              {language === "en"
                ? "World-class investment professionals with deep regional expertise."
                : "풍부한 실무 경험과 탄탄한 네트워크를 보유한 글로벌 투자 전문가 그룹."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-black/5 p-8 rounded flex flex-col justify-between group hover:border-accent-gold transition-colors duration-300"
              >
                <div className="space-y-6">
                  {/* Mock Image Placeholder with Initials */}
                  <div className="w-20 h-20 rounded-full bg-navy-deep text-accent-gold flex items-center justify-center font-extrabold text-2xl group-hover:scale-105 transition-transform duration-300">
                    {leader.image}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-navy-deep">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-accent-gold">
                      {leader.title}
                    </p>
                  </div>
                  <p className="text-xs text-navy-deep/70 leading-relaxed font-light">
                    {leader.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
