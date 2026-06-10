"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Mail, Briefcase, Loader2, CheckCircle2, AlertTriangle, FileUp, Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Contact() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "deal">("general");

  // Admin login states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");


  // 일반 문의 Form State
  const [generalForm, setGeneralForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  // Deal Submission Form State
  const [dealForm, setDealForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    description: "",
    ndaRequested: false,
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [firebaseWarning, setFirebaseWarning] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Firebase 연결이 정상적인지 확인 (API Key 여부 체크)
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      setFirebaseWarning(true);
    }
    
    // URL에 ?login=admin 이 들어오면 자동으로 관리자 로그인 모달 열기
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "admin") {
        setShowAdminLogin(true);
      }
    }
  }, []);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const targetEmail = "willkim@gmail.com";
    const targetPassword = "rlarudwns09q0";
    
    if (adminEmail === targetEmail && adminPassword === targetPassword) {
      sessionStorage.setItem("isAdmin", "true");
      setShowAdminLogin(false);
      router.push("/admin");
    } else {
      setLoginError(language === "en" ? "Invalid email or password." : "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };


  if (!mounted) return null;

  // 일반 문의 제출
  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // 실제 Firestore에 저장
        await addDoc(collection(db, "contact_inquiries"), {
          name: generalForm.name,
          email: generalForm.email,
          company: generalForm.company,
          message: generalForm.message,
          created_at: serverTimestamp(),
        });
      } else {
        // Firebase 설정이 없는 경우 개발 시뮬레이션 작동
        console.log("Firebase config not found. Simulating Firestore submission:", generalForm);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setSuccess(true);
      setGeneralForm({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact inquiry:", err);
      alert(t.contactPage.error);
    } finally {
      setLoading(false);
    }
  };

  // Deal Submission 제출
  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        // 실제 Firestore에 저장
        await addDoc(collection(db, "deal_submissions"), {
          company_name: dealForm.companyName,
          contact_name: dealForm.contactName,
          email: dealForm.email,
          phone: dealForm.phone,
          industry: dealForm.industry,
          description: dealForm.description,
          nda_requested: dealForm.ndaRequested,
          upload_path: fileName || "No file uploaded",
          created_at: serverTimestamp(),
        });
      } else {
        // Firebase 설정이 없는 경우 개발 시뮬레이션 작동
        console.log("Firebase config not found. Simulating Firestore submission:", dealForm);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setSuccess(true);
      setDealForm({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        description: "",
        ndaRequested: false,
      });
      setFileName(null);
    } catch (err) {
      console.error("Error submitting deal submission:", err);
      alert(t.contactPage.error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };

  return (
    <div className="bg-light-gray py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-navy-deep">
            {t.contactPage.title}
          </h1>
          <p className="text-sm text-navy-deep/60 leading-relaxed font-light">
            {language === "en"
              ? "Submit general inquiries or upload mid-market strategic deal proposals securely."
              : "일반 업무 문의 제안 또는 중견기업 대상의 전략적 투자 기회를 안전하게 제출하실 수 있습니다."}
          </p>
        </div>

        {/* Firebase Config warning */}
        {firebaseWarning && (
          <div className="mb-8 flex gap-3 items-start border border-amber-500/20 bg-amber-500/5 p-4 rounded text-xs text-amber-800 leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Developer Notice:</span> Firebase config keys are not loaded yet. Submissions will be simulated locally. To enable actual Firestore database synchronization, please configure your Firebase credentials in the <code className="bg-amber-500/10 px-1 py-0.5 rounded font-mono font-semibold">.env.local</code> file.
            </div>
          </div>
        )}

        {/* Tab triggers */}
        <div className="flex border-b border-black/10 mb-8">
          <button
            onClick={() => {
              setActiveTab("general");
              setSuccess(false);
            }}
            className={`flex-1 py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex justify-center items-center gap-2 ${
              activeTab === "general"
                ? "border-accent-gold text-navy-deep"
                : "border-transparent text-navy-deep/40 hover:text-navy-deep"
            }`}
          >
            <Mail className="w-4 h-4" />
            {t.contactPage.generalInquiry}
          </button>
          <button
            onClick={() => {
              setActiveTab("deal");
              setSuccess(false);
            }}
            className={`flex-1 py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex justify-center items-center gap-2 ${
              activeTab === "deal"
                ? "border-accent-gold text-navy-deep"
                : "border-transparent text-navy-deep/40 hover:text-navy-deep"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {t.contactPage.dealSubmission}
          </button>
        </div>

        {/* Success Modal/Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 border border-emerald-500/20 bg-emerald-500/5 p-6 rounded text-center space-y-3"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-navy-deep">
              {t.contactPage.success}
            </h3>
          </motion.div>
        )}

        {/* GENERAL INQUIRY FORM */}
        {activeTab === "general" && !success && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleGeneralSubmit}
            className="bg-white border border-black/5 p-8 rounded shadow-sm space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  {t.contactPage.name} *
                </label>
                <input
                  type="text"
                  required
                  value={generalForm.name}
                  onChange={e => setGeneralForm({ ...generalForm, name: e.target.value })}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  {t.contactPage.email} *
                </label>
                <input
                  type="email"
                  required
                  value={generalForm.email}
                  onChange={e => setGeneralForm({ ...generalForm, email: e.target.value })}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                {t.contactPage.company}
              </label>
              <input
                type="text"
                value={generalForm.company}
                onChange={e => setGeneralForm({ ...generalForm, company: e.target.value })}
                className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                {t.contactPage.message} *
              </label>
              <textarea
                required
                rows={5}
                value={generalForm.message}
                onChange={e => setGeneralForm({ ...generalForm, message: e.target.value })}
                className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-deep text-white py-3 rounded text-xs font-bold hover:bg-navy-deep/90 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.contactPage.submitting}
                </>
              ) : (
                t.contactPage.submit
              )}
            </button>
          </motion.form>
        )}

        {/* DEAL SUBMISSION FORM */}
        {activeTab === "deal" && !success && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleDealSubmit}
            className="bg-white border border-black/5 p-8 rounded shadow-sm space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  {language === "en" ? "Company Name" : "대상 회사명"} *
                </label>
                <input
                  type="text"
                  required
                  value={dealForm.companyName}
                  onChange={e => setDealForm({ ...dealForm, companyName: e.target.value })}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  {t.contactPage.name} *
                </label>
                <input
                  type="text"
                  required
                  value={dealForm.contactName}
                  onChange={e => setDealForm({ ...dealForm, contactName: e.target.value })}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  {t.contactPage.email} *
                </label>
                <input
                  type="email"
                  required
                  value={dealForm.email}
                  onChange={e => setDealForm({ ...dealForm, email: e.target.value })}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  {t.contactPage.phone} *
                </label>
                <input
                  type="text"
                  required
                  value={dealForm.phone}
                  onChange={e => setDealForm({ ...dealForm, phone: e.target.value })}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                {t.contactPage.industry} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Healthcare, Semiconductor, Consumer..."
                value={dealForm.industry}
                onChange={e => setDealForm({ ...dealForm, industry: e.target.value })}
                className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                {t.contactPage.description} *
              </label>
              <textarea
                required
                rows={4}
                value={dealForm.description}
                onChange={e => setDealForm({ ...dealForm, description: e.target.value })}
                className="w-full bg-light-gray/60 border border-black/5 rounded px-4 py-2.5 text-xs text-navy-deep placeholder-navy-deep/30 focus:border-accent-gold focus:outline-none resize-none"
              />
            </div>

            {/* Checkbox NDA */}
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="nda"
                checked={dealForm.ndaRequested}
                onChange={e => setDealForm({ ...dealForm, ndaRequested: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-accent-gold focus:ring-accent-gold accent-navy-deep"
              />
              <label htmlFor="nda" className="text-xs text-navy-deep font-semibold cursor-pointer">
                {t.contactPage.nda}
              </label>
            </div>

            {/* File Upload Simulator */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60 block">
                {t.contactPage.fileUpload}
              </label>
              <div className="border-2 border-dashed border-black/10 hover:border-accent-gold rounded p-6 text-center cursor-pointer relative group transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="space-y-2">
                  <FileUp className="w-8 h-8 text-navy-deep/30 group-hover:text-accent-gold mx-auto transition-colors" />
                  <p className="text-xs text-navy-deep/60">
                    {fileName ? (
                      <span className="font-bold text-navy-deep">{fileName}</span>
                    ) : (
                      "Drag & drop your PDF file, or click to browse"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-deep text-white py-3 rounded text-xs font-bold hover:bg-navy-deep/90 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.contactPage.submitting}
                </>
              ) : (
                t.contactPage.submit
              )}
            </button>
          </motion.form>
        )}
      </div>

      {/* Bottom Right Admin Login Trigger Button */}
      <div className="max-w-4xl mx-auto flex justify-end mt-8">
        <button
          onClick={() => {
            setShowAdminLogin(true);
            setLoginError("");
          }}
          className="text-[11px] font-bold text-navy-deep/20 hover:text-accent-gold transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Lock className="w-3 h-3" /> Admin Portal
        </button>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-navy-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-black/5 rounded shadow-xl w-full max-w-md overflow-hidden relative"
          >
            {/* Modal Header */}
            <div className="bg-navy-deep text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-gold" />
                <span className="text-xs font-bold uppercase tracking-wider">Admin Login</span>
              </div>
              <button
                onClick={() => setShowAdminLogin(false)}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Content */}
            <form onSubmit={handleAdminLoginSubmit} className="p-6 space-y-4">
              {loginError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs p-3 rounded font-medium">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="willkim@gmail.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-3 py-2 text-xs text-navy-deep focus:border-accent-gold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-navy-deep/60">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-light-gray/60 border border-black/5 rounded px-3 py-2 text-xs text-navy-deep focus:border-accent-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-navy-deep text-white py-2.5 rounded text-xs font-bold hover:bg-navy-deep/90 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                Sign In
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

