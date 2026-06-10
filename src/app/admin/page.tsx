"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMetrics,
  updateMetric,
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getNewsItems,
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  getInquiries,
  deleteInquiry,
  seedInitialData,
  PortfolioItem,
  NewsItem,
  MetricItem,
  InquiryItem
} from "@/lib/contentService";
import {
  Lock,
  LogOut,
  FolderOpen,
  Newspaper,
  TrendingUp,
  Inbox,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Database,
  Calendar,
  Sparkles,
  Download,
  AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"portfolio" | "news" | "metrics" | "inquiries" | "settings">("portfolio");

  // Credentials for inline login check
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Loading and feedback states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Content states
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);

  // Edit/Add modal states
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [isAddingPortfolio, setIsAddingPortfolio] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState<Omit<PortfolioItem, "id">>({
    name: "",
    industry_ko: "",
    industry_en: "",
    type_ko: "",
    type_en: "",
    status: "active",
    entry: "",
    exit: "",
    irr: "",
    description_ko: "",
    description_en: "",
    size: "",
    logo: "",
    featured: false
  });

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<Omit<NewsItem, "id">>({
    category_ko: "",
    category_en: "",
    title_ko: "",
    title_en: "",
    date: ""
  });

  // Check auth on mount
  useEffect(() => {
    setMounted(true);
    const authState = sessionStorage.getItem("isAdmin");
    if (authState === "true") {
      setIsAdmin(true);
      loadAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [metricsData, portfolioData, newsData, inquiriesData] = await Promise.all([
        getMetrics(),
        getPortfolioItems(),
        getNewsItems(),
        getInquiries()
      ]);
      setMetrics(metricsData);
      setPortfolio(portfolioData);
      setNews(newsData);
      setInquiries(inquiriesData);
    } catch (e) {
      console.error("Error loading admin data:", e);
      showFeedback("데이터를 불러오는데 오류가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showFeedback = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "willkim@gmail.com" && password === "rlarudwns09q0") {
      sessionStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
      setLoginError("");
      loadAllData();
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    setIsAdmin(false);
    router.push("/");
  };

  // --- Actions: Metrics ---
  const handleUpdateMetric = async (metric: MetricItem) => {
    const success = await updateMetric(metric);
    if (success) {
      showFeedback("지표가 수정되었습니다.", "success");
      loadAllData();
    } else {
      showFeedback("지표 수정 실패 (파이어베이스 연동 필요)", "error");
    }
  };

  // --- Actions: Portfolio ---
  const handlePortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPortfolio && editingPortfolio.id) {
      const success = await updatePortfolioItem(editingPortfolio.id, portfolioForm);
      if (success) {
        showFeedback("포트폴리오가 성공적으로 수정되었습니다.", "success");
        setEditingPortfolio(null);
        loadAllData();
      } else {
        showFeedback("포트폴리오 수정 실패", "error");
      }
    } else {
      const newId = await addPortfolioItem(portfolioForm);
      if (newId) {
        showFeedback("포트폴리오가 신규 등록되었습니다.", "success");
        setIsAddingPortfolio(false);
        loadAllData();
      } else {
        showFeedback("포트폴리오 등록 실패", "error");
      }
    }
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingPortfolio(item);
    setPortfolioForm({
      name: item.name,
      industry_ko: item.industry_ko,
      industry_en: item.industry_en,
      type_ko: item.type_ko,
      type_en: item.type_en,
      status: item.status,
      entry: item.entry,
      exit: item.exit || "",
      irr: item.irr || "",
      description_ko: item.description_ko,
      description_en: item.description_en,
      size: item.size || "",
      logo: item.logo || "",
      featured: item.featured || false
    });
    setIsAddingPortfolio(true);
  };

  const handleDeletePortfolio = async (id: string) => {
    if (confirm("정말로 이 포트폴리오를 삭제하시겠습니까?")) {
      const success = await deletePortfolioItem(id);
      if (success) {
        showFeedback("포트폴리오가 삭제되었습니다.", "success");
        loadAllData();
      } else {
        showFeedback("포트폴리오 삭제 실패", "error");
      }
    }
  };

  // --- Actions: News ---
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNews && editingNews.id) {
      const success = await updateNewsItem(editingNews.id, newsForm);
      if (success) {
        showFeedback("뉴스가 성공적으로 수정되었습니다.", "success");
        setEditingNews(null);
        loadAllData();
      } else {
        showFeedback("뉴스 수정 실패", "error");
      }
    } else {
      const newId = await addNewsItem(newsForm);
      if (newId) {
        showFeedback("뉴스가 신규 등록되었습니다.", "success");
        setIsAddingNews(false);
        loadAllData();
      } else {
        showFeedback("뉴스 등록 실패", "error");
      }
    }
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({
      category_ko: item.category_ko,
      category_en: item.category_en,
      title_ko: item.title_ko,
      title_en: item.title_en,
      date: item.date
    });
    setIsAddingNews(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm("정말로 이 뉴스 항목을 삭제하시겠습니까?")) {
      const success = await deleteNewsItem(id);
      if (success) {
        showFeedback("뉴스가 삭제되었습니다.", "success");
        loadAllData();
      } else {
        showFeedback("뉴스 삭제 실패", "error");
      }
    }
  };

  // --- Actions: Inquiries ---
  const handleDeleteInquiryItem = async (id: string, type: "general" | "deal") => {
    if (confirm("정말로 이 접수 내역을 삭제하시겠습니까?")) {
      const success = await deleteInquiry(id, type);
      if (success) {
        showFeedback("접수 내역이 삭제되었습니다.", "success");
        loadAllData();
      } else {
        showFeedback("접수 내역 삭제 실패", "error");
      }
    }
  };

  // --- Actions: Seeding DB ---
  const handleSeedDatabase = async () => {
    if (confirm("Firebase Firestore를 데모용 정적 데이터로 초기 세팅하시겠습니까? 기존 데이터가 덮어씌워지거나 중복될 수 있습니다.")) {
      setLoading(true);
      const success = await seedInitialData();
      setLoading(false);
      if (success) {
        showFeedback("Firebase Firestore 데이터 초기 세팅 완료!", "success");
        loadAllData();
      } else {
        showFeedback("세딩 실패 (Firebase 설정 키를 확인해주세요)", "error");
      }
    }
  };

  if (!mounted) return null;

  // Render Login Card if not Authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy-deep flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl" />
        <div className="bg-navy-light/60 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-2xl max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-accent-gold/10 p-3 inline-block rounded-full mb-2">
              <Lock className="w-6 h-6 text-accent-gold" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">관리자 포털</h1>
            <p className="text-xs text-white/50">원데이즈PE 시스템 관리를 위해 로그인이 필요합니다.</p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-white/60">아이디 (이메일)</label>
              <input
                type="email"
                required
                placeholder="willkim@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-deep/80 border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-accent-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-white/60">비밀번호</label>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy-deep/80 border border-white/10 rounded px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-accent-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent-gold text-navy-deep py-3 rounded text-xs font-bold hover:bg-accent-gold-dark transition-all duration-300 shadow-lg shadow-accent-gold/10 cursor-pointer mt-6"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col md:flex-row relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* FEEDBACK TOAST */}
      {message && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded shadow-lg text-xs font-semibold z-50 flex items-center gap-2 animate-bounce border ${
          message.type === "success"
            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
            : "bg-rose-500/10 border-rose-500 text-rose-400"
        }`}>
          {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-navy-light/40 border-r border-white/10 flex flex-col justify-between p-6 relative z-10">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2 pb-6 border-b border-white/10">
            <Sparkles className="w-5 h-5 text-accent-gold" />
            <span className="font-extrabold text-sm tracking-wider gold-gradient-text uppercase">ONEDAYS PE ADMIN</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "portfolio"
                  ? "bg-accent-gold text-navy-deep shadow-lg shadow-accent-gold/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              포트폴리오 관리
            </button>

            <button
              onClick={() => setActiveTab("news")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "news"
                  ? "bg-accent-gold text-navy-deep shadow-lg shadow-accent-gold/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              인사이트 / 뉴스 관리
            </button>

            <button
              onClick={() => setActiveTab("metrics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "metrics"
                  ? "bg-accent-gold text-navy-deep shadow-lg shadow-accent-gold/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              홈 AUM 지표 관리
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "inquiries"
                  ? "bg-accent-gold text-navy-deep shadow-lg shadow-accent-gold/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Inbox className="w-4 h-4" />
              고객 접수 내역
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-accent-gold text-navy-deep shadow-lg shadow-accent-gold/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              설정 & 데이터 초기화
            </button>
          </nav>
        </div>



        {/* Logout */}
        <div className="pt-6 border-t border-white/10 mt-6 md:mt-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 py-2.5 rounded text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 p-6 md:p-10 relative z-10 max-h-screen overflow-y-auto">
        {/* Firebase unconfigured warning */}
        {!process.env.NEXT_PUBLIC_FIREBASE_API_KEY && (
          <div className="mb-6 flex gap-3 items-start border border-amber-500/20 bg-amber-500/5 p-4 rounded text-xs text-amber-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
            <div>
              <span className="font-bold">Firebase 환경변수 미작동 알림:</span> 현재 로컬 개발 모드로 작동 중이며, 변경사항은 세션 로컬 캐시에 시뮬레이션되거나 적용에 한계가 있을 수 있습니다. 실제 데이터 동기화를 원하시면 <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono font-semibold">.env.local</code> 설정을 완료하십시오.
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-96 flex items-center justify-center flex-col gap-2">
            <div className="w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-white/50">데이터 동기화 중...</span>
          </div>
        ) : (
          <>
            {/* TABS: PORTFOLIO */}
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-wide">포트폴리오 실적 리스트</h2>
                    <p className="text-xs text-white/50">투자 및 회수 완료된 포트폴리오 기업 정보들을 CRUD 관리합니다.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPortfolio(null);
                      setPortfolioForm({
                        name: "",
                        industry_ko: "",
                        industry_en: "",
                        type_ko: "",
                        type_en: "",
                        status: "active",
                        entry: "",
                        exit: "",
                        irr: "",
                        description_ko: "",
                        description_en: "",
                        size: "",
                        logo: "",
                        featured: false
                      });
                      setIsAddingPortfolio(true);
                    }}
                    className="bg-accent-gold text-navy-deep px-4 py-2.5 rounded text-xs font-bold hover:bg-accent-gold-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-gold/10"
                  >
                    <Plus className="w-4 h-4" /> 실적 추가
                  </button>
                </div>

                {isAddingPortfolio ? (
                  <form onSubmit={handlePortfolioSubmit} className="bg-navy-light/40 border border-white/10 p-6 rounded-lg space-y-6">
                    <h3 className="text-sm font-bold border-b border-white/10 pb-2 text-accent-gold">
                      {editingPortfolio ? "실적 정보 수정" : "신규 실적 등록"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">기업명</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.name}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, name: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">산업분야 (국문)</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.industry_ko}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, industry_ko: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">산업분야 (영문)</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.industry_en}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, industry_en: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">투자 기법 (국문)</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.type_ko}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, type_ko: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">투자 기법 (영문)</label>
                        <input
                          type="text"
                          required
                          value={portfolioForm.type_en}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, type_en: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">투자 진행 현황</label>
                        <select
                          value={portfolioForm.status}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, status: e.target.value as "active" | "realized" })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        >
                          <option value="active">Active (투자 중)</option>
                          <option value="realized">Realized (회수 완료)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">투자 진입일 (Entry)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2025.11"
                          value={portfolioForm.entry}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, entry: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">회수 완료일 (Exit - 선택)</label>
                        <input
                          type="text"
                          placeholder="e.g. 2025.02"
                          value={portfolioForm.exit}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, exit: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">내부수수료율 (IRR - 선택)</label>
                        <input
                          type="text"
                          placeholder="e.g. 28.5%"
                          value={portfolioForm.irr}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, irr: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">투자 규모 (Size - 메인 노출용)</label>
                        <input
                          type="text"
                          placeholder="e.g. 350B KRW"
                          value={portfolioForm.size}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, size: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">메인 로고 약칭 (2글자 - 선택)</label>
                        <input
                          type="text"
                          placeholder="e.g. BL"
                          value={portfolioForm.logo}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, logo: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={portfolioForm.featured}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, featured: e.target.checked })}
                          className="w-4 h-4 rounded border-white/10 text-accent-gold focus:ring-accent-gold accent-accent-gold"
                        />
                        <label htmlFor="featured" className="text-xs font-semibold cursor-pointer text-white/80">
                          홈 화면에 주요 실적(Featured Deal)으로 노출
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">설명글 (국문)</label>
                        <textarea
                          required
                          rows={3}
                          value={portfolioForm.description_ko}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, description_ko: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none resize-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">설명글 (영문)</label>
                        <textarea
                          required
                          rows={3}
                          value={portfolioForm.description_en}
                          onChange={(e) => setPortfolioForm({ ...portfolioForm, description_en: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsAddingPortfolio(false)}
                        className="px-4 py-2 border border-white/20 rounded text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-accent-gold text-navy-deep rounded text-xs font-bold hover:bg-accent-gold-dark transition-all cursor-pointer"
                      >
                        {editingPortfolio ? "저장하기" : "등록하기"}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* Portfolio list grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {portfolio.map((item) => (
                    <div key={item.id} className="bg-navy-light/20 border border-white/10 rounded-lg p-5 flex flex-col justify-between hover:border-accent-gold/40 transition-colors">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-accent-gold/10 text-accent-gold border border-accent-gold/20">
                              {item.industry_ko}
                            </span>
                            {item.featured && (
                              <span className="ml-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            item.status === "active" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"
                          }`}>
                            {item.status === "active" ? "Active" : "Realized"}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold">{item.name}</h4>
                          <p className="text-xs text-white/40 font-medium">{item.type_ko}</p>
                        </div>

                        <div className="text-xs text-white/60 line-clamp-3 leading-relaxed">
                          {item.description_ko}
                        </div>
                      </div>

                      <div className="border-t border-white/5 mt-5 pt-4 flex justify-between items-center text-[10px] text-white/40 font-mono">
                        <div>
                          진입: <span className="text-white font-bold">{item.entry}</span>
                          {item.exit && (
                            <> | 회수: <span className="text-white font-bold">{item.exit}</span></>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditPortfolio(item)}
                            className="p-1 text-white/40 hover:text-accent-gold transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => item.id && handleDeletePortfolio(item.id)}
                            className="p-1 text-white/40 hover:text-rose-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS: NEWS */}
            {activeTab === "news" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-wide">뉴스 및 인사이트</h2>
                    <p className="text-xs text-white/50">홈 화면 하단 및 인사이트 페이지용 미디어/뉴스룸 컬렉션을 관리합니다.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNews(null);
                      setNewsForm({
                        category_ko: "",
                        category_en: "",
                        title_ko: "",
                        title_en: "",
                        date: new Date().toISOString().split("T")[0].replace(/-/g, ".")
                      });
                      setIsAddingNews(true);
                    }}
                    className="bg-accent-gold text-navy-deep px-4 py-2.5 rounded text-xs font-bold hover:bg-accent-gold-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-gold/10"
                  >
                    <Plus className="w-4 h-4" /> 뉴스 추가
                  </button>
                </div>

                {isAddingNews ? (
                  <form onSubmit={handleNewsSubmit} className="bg-navy-light/40 border border-white/10 p-6 rounded-lg space-y-6">
                    <h3 className="text-sm font-bold border-b border-white/10 pb-2 text-accent-gold">
                      {editingNews ? "뉴스 수정" : "신규 뉴스 등록"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">뉴스 분류 (국문)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 뉴스룸, 시장 인사이트"
                          value={newsForm.category_ko}
                          onChange={(e) => setNewsForm({ ...newsForm, category_ko: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">뉴스 분류 (영문)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Newsroom, Market Insights"
                          value={newsForm.category_en}
                          onChange={(e) => setNewsForm({ ...newsForm, category_en: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">작성일 (Date)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2026.05.15"
                          value={newsForm.date}
                          onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">제목 (국문)</label>
                        <input
                          type="text"
                          required
                          value={newsForm.title_ko}
                          onChange={(e) => setNewsForm({ ...newsForm, title_ko: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-white/50">제목 (영문)</label>
                        <input
                          type="text"
                          required
                          value={newsForm.title_en}
                          onChange={(e) => setNewsForm({ ...newsForm, title_en: e.target.value })}
                          className="w-full bg-navy-deep border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-accent-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsAddingNews(false)}
                        className="px-4 py-2 border border-white/20 rounded text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-accent-gold text-navy-deep rounded text-xs font-bold hover:bg-accent-gold-dark transition-all cursor-pointer"
                      >
                        {editingNews ? "저장하기" : "등록하기"}
                      </button>
                    </div>
                  </form>
                ) : null}

                {/* News list tables */}
                <div className="bg-navy-light/10 border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold tracking-wider text-white/50">
                        <th className="p-4">날짜</th>
                        <th className="p-4">카테고리</th>
                        <th className="p-4">제목 (국문 / 영문)</th>
                        <th className="p-4 text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {news.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-white/60">{item.date}</td>
                          <td className="p-4">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-accent-gold/15 text-accent-gold">
                              {item.category_ko}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            <div className="font-bold text-white text-sm">{item.title_ko}</div>
                            <div className="text-white/40 font-light">{item.title_en}</div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end items-center gap-1.5">
                              <button
                                onClick={() => handleEditNews(item)}
                                className="p-1.5 text-white/40 hover:text-accent-gold transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => item.id && handleDeleteNews(item.id)}
                                className="p-1.5 text-white/40 hover:text-rose-500 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TABS: METRICS */}
            {activeTab === "metrics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold tracking-wide">홈화면 핵심 지표 (AUM Metrics)</h2>
                  <p className="text-xs text-white/50">홈 화면 히어로 배너 하단에 렌더링되는 4대 지표 수치를 수정합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.map((metric, idx) => (
                    <div key={metric.id} className="bg-navy-light/20 border border-white/10 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-accent-gold font-mono uppercase">ID: {metric.id}</span>
                        <TrendingUp className="w-4 h-4 text-white/20" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-white/40">라벨 (국문)</label>
                          <input
                            type="text"
                            value={metric.label_ko}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              newMetrics[idx].label_ko = e.target.value;
                              setMetrics(newMetrics);
                            }}
                            className="w-full bg-navy-deep border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-accent-gold focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-white/40">라벨 (영문)</label>
                          <input
                            type="text"
                            value={metric.label_en}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              newMetrics[idx].label_en = e.target.value;
                              setMetrics(newMetrics);
                            }}
                            className="w-full bg-navy-deep border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-accent-gold focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-white/40">수치 (Value)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={metric.value}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              newMetrics[idx].value = parseFloat(e.target.value) || 0;
                              setMetrics(newMetrics);
                            }}
                            className="w-full bg-navy-deep border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-accent-gold focus:outline-none font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-white/40">접미사 (국문)</label>
                          <input
                            type="text"
                            value={metric.suffix_ko}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              newMetrics[idx].suffix_ko = e.target.value;
                              setMetrics(newMetrics);
                            }}
                            className="w-full bg-navy-deep border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-accent-gold focus:outline-none font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-white/40">접미사 (영문)</label>
                          <input
                            type="text"
                            value={metric.suffix_en}
                            onChange={(e) => {
                              const newMetrics = [...metrics];
                              newMetrics[idx].suffix_en = e.target.value;
                              setMetrics(newMetrics);
                            }}
                            className="w-full bg-navy-deep border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-accent-gold focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleUpdateMetric(metric)}
                          className="bg-accent-gold text-navy-deep hover:bg-accent-gold-dark transition-all px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> 저장
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS: INQUIRIES */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold tracking-wide">고객 문의 및 Deal 접수 현황</h2>
                  <p className="text-xs text-white/50">Contact Us 페이지를 통해 고객이 제출한 문의 및 제안 목록을 조회합니다.</p>
                </div>

                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="border border-white/10 rounded-lg p-12 text-center text-xs text-white/30 space-y-2">
                      <Inbox className="w-12 h-12 mx-auto text-white/10" />
                      <div>현재 접수된 문의 내역이 존재하지 않습니다.</div>
                    </div>
                  ) : (
                    inquiries.map((inq) => (
                      <div key={inq.id} className="bg-navy-light/10 border border-white/10 rounded-lg p-6 space-y-4 hover:border-white/20 transition-colors">
                        <div className="flex flex-wrap justify-between items-center border-b border-white/5 pb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              inq.type === "deal"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                                : "bg-teal-500/15 text-teal-400 border border-teal-500/20"
                            }`}>
                              {inq.type === "deal" ? "Deal Proposal" : "General Inquiry"}
                            </span>
                            {inq.nda_requested && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                NDA Requested
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/40 flex items-center gap-1.5 font-mono">
                            <Calendar className="w-3.5 h-3.5" />
                            {inq.created_at?.seconds
                              ? new Date(inq.created_at.seconds * 1000).toLocaleString()
                              : "임시 시뮬레이션"}
                          </div>
                        </div>

                        {/* General Inquiry Details */}
                        {inq.type === "general" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                              <div><span className="text-white/40">보낸 사람:</span> <span className="font-bold text-white">{inq.name}</span></div>
                              <div><span className="text-white/40">이메일:</span> <a href={`mailto:${inq.email}`} className="text-accent-gold underline">{inq.email}</a></div>
                              <div><span className="text-white/40">회사명:</span> <span className="text-white">{inq.company || "-"}</span></div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-white/40 mb-1">문의 내용:</div>
                              <p className="bg-navy-deep/60 p-3 rounded text-white/80 leading-relaxed font-light whitespace-pre-wrap">{inq.message}</p>
                            </div>
                          </div>
                        ) : (
                          /* Deal Submission Details */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                              <div><span className="text-white/40">대상 회사명:</span> <span className="font-bold text-white">{inq.company_name}</span></div>
                              <div><span className="text-white/40">담당자:</span> <span className="text-white">{inq.contact_name}</span></div>
                              <div><span className="text-white/40">연락처:</span> <span className="text-white">{inq.phone}</span></div>
                              <div><span className="text-white/40">이메일:</span> <a href={`mailto:${inq.email}`} className="text-accent-gold underline">{inq.email}</a></div>
                              <div><span className="text-white/40">산업 분야:</span> <span className="text-white">{inq.industry}</span></div>
                              {inq.upload_path && (
                                <div className="flex items-center gap-1.5 text-accent-gold font-semibold mt-1">
                                  <Download className="w-4 h-4" />
                                  <span>첨부 파일: {inq.upload_path}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="text-white/40 mb-1">투자 기회 상세 설명:</div>
                              <p className="bg-navy-deep/60 p-3 rounded text-white/80 leading-relaxed font-light whitespace-pre-wrap">{inq.description}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => inq.id && handleDeleteInquiryItem(inq.id, inq.type)}
                            className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> 삭제하기
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TABS: SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold tracking-wide">설정 및 DB 초기화 도구</h2>
                  <p className="text-xs text-white/50">데이터베이스 동기화 문제를 점검하고 초기 데이터를 Firestore에 세팅합니다.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Database Seeding Tool */}
                  <div className="bg-navy-light/20 border border-white/10 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 text-accent-gold">
                      <Database className="w-5 h-5" />
                      <h3 className="font-bold text-sm">기본 데이터베이스 세딩(Seed)</h3>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      Firestore 연동 후 데이터가 없을 경우 메인 페이지의 metrics, 포트폴리오, 뉴스룸 기본 데이터를 Firestore에 세팅합니다.
                      이 작업은 컬렉션이 존재하는 경우 덮어씌울 수 있습니다.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={handleSeedDatabase}
                        className="bg-accent-gold text-navy-deep hover:bg-accent-gold-dark transition-all px-4 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-accent-gold/10"
                      >
                        <Database className="w-4 h-4" /> Firestore 데이터 세딩 실행
                      </button>
                    </div>
                  </div>

                  {/* System Credentials Info */}
                  <div className="bg-navy-light/20 border border-white/10 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-2 text-accent-gold">
                      <Lock className="w-5 h-5" />
                      <h3 className="font-bold text-sm">관리자 계정 정보</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-white/40">로그인 아이디:</span>
                        <code className="ml-2 bg-navy-deep px-1.5 py-0.5 rounded font-mono font-bold text-accent-gold">willkim@gmail.com</code>
                      </div>
                      <div>
                        <span className="text-white/40">로그인 비밀번호:</span>
                        <code className="ml-2 bg-navy-deep px-1.5 py-0.5 rounded font-mono font-bold text-accent-gold">rlarudwns09q0</code>
                      </div>
                      <p className="text-[10px] text-white/30 pt-2 border-t border-white/5">
                        * 해당 정보는 요구사항에 따라 클라이언트 소스 내에 하드코딩 형식으로 저장되어 관리됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
