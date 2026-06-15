"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Activity,
  Cpu,
  ShoppingBag,
  Zap,
  ChevronRight,
  FileText
} from "lucide-react";
import {
  getMetrics,
  getPortfolioItems,
  getNewsItems
} from "@/lib/contentService";

export default function Home() {
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  interface MetricData { label: string; value: number; suffix: string; target: number; }
  interface DealData { company: string; industry: string; type: string; size: string; date: string; logo: string; }
  interface NewsData { category: string; title: string; date: string; }
  const [metricsData, setMetricsData] = useState<MetricData[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<DealData[]>([]);
  const [newsList, setNewsList] = useState<NewsData[]>([]);

  // Hydration 대비 & 데이터 Fetch
  useEffect(() => {
    setMounted(true);
    
    const fetchData = async () => {
      try {
        const [mList, pList, nList] = await Promise.all([
          getMetrics(),
          getPortfolioItems(),
          getNewsItems()
        ]);

        // Map Metrics
        setMetricsData(mList.map(m => ({
          label: language === "ko" ? m.label_ko : m.label_en,
          value: m.value,
          suffix: language === "ko" ? m.suffix_ko : m.suffix_en,
          target: m.value
        })));

        // Map Featured Deals (featured === true)
        const featured = pList.filter(p => p.featured !== false);
        setFeaturedDeals(featured.map(f => ({
          company: f.name,
          industry: language === "ko" ? f.industry_ko : f.industry_en,
          type: language === "ko" ? f.type_ko : f.type_en,
          size: f.size || "",
          date: f.entry,
          logo: f.logo || f.name.slice(0, 2).toUpperCase()
        })));

        // Map News
        setNewsList(nList.map(n => ({
          category: language === "ko" ? n.category_ko : n.category_en,
          title: language === "ko" ? n.title_ko : n.title_en,
          date: n.date
        })));
      } catch (err) {
        console.error("Error loading home page content:", err);
      }
    };

    fetchData();
  }, [language]);

  if (!mounted) {
    return <div className="min-h-screen bg-navy-deep" />;
  }


  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    },
  };

  const strategies = [
    {
      title: t.strategyMenu.buyout,
      desc: t.strategySection.buyoutDesc,
      icon: <Briefcase className="w-6 h-6 text-accent-gold" />,
    },
    {
      title: t.strategyMenu.growth,
      desc: t.strategySection.growthDesc,
      icon: <TrendingUp className="w-6 h-6 text-accent-gold" />,
    },
    {
      title: t.strategyMenu.structured,
      desc: t.strategySection.creditDesc,
      icon: <Layers className="w-6 h-6 text-accent-gold" />,
    },
    {
      title: t.financeMenu.acquisition,
      desc: t.strategySection.acquisitionDesc,
      icon: <ShieldCheck className="w-6 h-6 text-accent-gold" />,
    },
    {
      title: t.strategyMenu.merchant,
      desc: t.strategySection.specialDesc,
      icon: <Building className="w-6 h-6 text-accent-gold" />,
    },
  ];

  const industries = [
    { name: t.industriesMenu.healthcare, icon: <Activity className="w-5 h-5" /> },
    { name: t.industriesMenu.industrial, icon: <Building className="w-5 h-5" /> },
    { name: t.industriesMenu.tech, icon: <Cpu className="w-5 h-5" /> },
    { name: t.industriesMenu.consumer, icon: <ShoppingBag className="w-5 h-5" /> },
    { name: t.industriesMenu.energy, icon: <Zap className="w-5 h-5" /> },
  ];


  return (
    <div className="relative">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-navy-deep text-white overflow-hidden py-24">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl z-0" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and text */}
            <div className="lg:col-span-7">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Tagline */}
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 border border-accent-gold/30 bg-accent-gold/5 px-4 py-1.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-accent-gold animate-pulse" />
                  <span className="text-xs font-semibold tracking-wider text-accent-gold uppercase">
                    PE + IB + Structured Capital Hybrid
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
                >
                  {t.hero.headline}
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-white/70 font-light leading-relaxed"
                >
                  {t.hero.subheadline}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/contact?type=deal"
                    className="inline-flex items-center justify-center gap-2 text-sm font-bold text-navy-deep bg-accent-gold px-8 py-4 rounded hover:bg-accent-gold-dark transition-all duration-300 shadow-lg shadow-accent-gold/10"
                  >
                    {t.hero.ctaSubmit}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white border border-white/20 hover:border-accent-gold hover:bg-white/5 px-8 py-4 rounded transition-all duration-300"
                  >
                    {t.hero.ctaContact}
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column: Video Frame */}
            <div className="lg:col-span-5 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-video w-full rounded-lg overflow-hidden border border-accent-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] bg-black"
              >
                <iframe
                  className="w-full h-full border-0"
                  src="https://www.youtube.com/embed/1jwyOicGYlk?autoplay=1&mute=1&loop=1&playlist=1jwyOicGYlk&controls=1&rel=0&modestbranding=1"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] tracking-widest uppercase">SCROLL</span>
          <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-accent-gold animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. AUM METRICS */}
      <section className="bg-navy-deep/95 border-y border-accent-gold/15 py-12 px-6 text-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {metricsData.map((metric, index) => (
              <div key={index} className="pt-6 md:pt-0 md:px-8 first:pt-0 first:border-t-0">
                <p className="text-[11px] uppercase tracking-widest text-white/50 mb-1 font-semibold">
                  {metric.label}
                </p>
                <div className="text-3xl md:text-4xl font-extrabold text-accent-gold tracking-tight flex items-baseline">
                  <span>{metric.value}</span>
                  <span className="text-lg font-bold ml-1 text-white/80">
                    {metric.suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INVESTMENT VERTICALS */}
      <section className="py-24 px-6 bg-white" id="strategy">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="h-1 w-12 bg-accent-gold" />
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-deep">
              {t.strategySection.title}
            </h2>
            <p className="text-white/70 bg-navy-deep/5 px-4 py-2 border-l-2 border-accent-gold text-sm font-medium">
              {t.strategySection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-light-gray p-8 border border-black/5 hover:border-accent-gold transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="bg-navy-deep p-3 inline-block rounded">
                    {strategy.icon}
                  </div>
                  <h3 className="text-lg font-bold text-navy-deep group-hover:text-accent-gold transition-colors">
                    {strategy.title}
                  </h3>
                  <p className="text-xs text-navy-deep/75 leading-relaxed font-light">
                    {strategy.desc}
                  </p>
                </div>
                <div className="pt-6 flex justify-end">
                  <ArrowRight className="w-4 h-4 text-navy-deep/40 group-hover:text-accent-gold group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED TRANSACTIONS */}
      <section className="py-24 px-6 bg-light-gray border-t border-black/5" id="portfolio">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="space-y-4">
              <div className="h-1 w-12 bg-accent-gold" />
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-deep">
                {t.featured.title}
              </h2>
              <p className="text-sm text-navy-deep/60">
                {t.featured.subtitle}
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-deep hover:text-accent-gold transition-colors group uppercase tracking-wider"
            >
              All Transactions
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="bg-white border border-black/5 shadow-sm hover:shadow-xl hover:border-accent-gold/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Top border decor */}
                <div className="h-1.5 w-full bg-navy-deep group-hover:bg-accent-gold transition-colors" />

                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent-gold bg-accent-gold/10 px-2.5 py-1 rounded">
                      {deal.industry}
                    </span>
                    <span className="text-[10px] text-navy-deep/40 font-mono">
                      {deal.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-navy-deep">
                    {deal.company}
                  </h3>

                  <div className="border-y border-black/5 py-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-navy-deep/50">Deal Structure</span>
                      <span className="font-semibold text-navy-deep">{deal.type}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-navy-deep/50">Deal Size</span>
                      <span className="font-bold text-accent-gold">{deal.size}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-light-gray px-8 py-4 border-t border-black/5 flex justify-between items-center group-hover:bg-navy-deep/5 transition-colors">
                  <span className="text-xs text-navy-deep/60 group-hover:text-navy-deep transition-colors">
                    {t.featured.viewMore}
                  </span>
                  <FileText className="w-4 h-4 text-navy-deep/30 group-hover:text-accent-gold transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INDUSTRY EXPERTISE */}
      <section className="py-24 px-6 bg-navy-deep text-white relative overflow-hidden" id="industries">
        <div className="absolute inset-0 bg-radial-gradient from-navy-light to-navy-deep opacity-60" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="h-1 w-12 bg-accent-gold" />
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              {t.industryExpertise.title}
            </h2>
            <p className="text-sm text-white/60">
              {t.industryExpertise.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {industries.map((ind, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 flex flex-col items-center justify-center text-center rounded hover:border-accent-gold hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="bg-accent-gold/10 p-4 rounded-full text-accent-gold mb-4 group-hover:bg-accent-gold group-hover:text-navy-deep transition-colors duration-300">
                  {ind.icon}
                </div>
                <h3 className="text-sm font-bold tracking-wide">
                  {ind.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INSIGHTS SECTION */}
      <section className="py-24 px-6 bg-white" id="insights">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="h-1 w-12 bg-accent-gold" />
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-deep">
              {t.insightsSection.title}
            </h2>
            <p className="text-sm text-navy-deep/60">
              {t.insightsSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsList.map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-b border-black/10 pb-8 flex flex-col justify-between hover:border-accent-gold transition-colors duration-300 group"
              >
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
                    {news.category}
                  </span>
                  <h3 className="text-lg font-bold text-navy-deep group-hover:text-accent-gold transition-colors duration-300 line-clamp-2 leading-snug">
                    {news.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="text-[11px] font-mono text-navy-deep/40">{news.date}</span>
                  <ChevronRight className="w-4 h-4 text-navy-deep/30 group-hover:text-accent-gold group-hover:translate-x-0.5 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT CTA */}
      <section className="bg-light-gray py-24 px-6 border-t border-black/5">
        <div className="max-w-5xl mx-auto text-center space-y-8 bg-navy-deep text-white p-12 md:p-20 relative overflow-hidden rounded">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff05_10%,transparent_50%)]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t.contactCta.title}
            </h2>
            <p className="text-white/70 font-light leading-relaxed text-sm md:text-base">
              {t.contactCta.desc}
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-bold text-navy-deep bg-accent-gold px-8 py-4 rounded hover:bg-accent-gold-dark transition-all duration-300 shadow-lg shadow-accent-gold/10 cursor-pointer"
              >
                {t.contactCta.btn}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
