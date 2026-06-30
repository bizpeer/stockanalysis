"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { RESEARCH_SKILLS, ResearchSkill } from "@/lib/skillsData";
import {
  verifyMarketCap,
  verifyValuation,
  crossValidate,
  benfordCheck,
  calculateThreeScenarioValuation,
  formatFinancialNumber,
  VerificationResult
} from "@/lib/financialRigor";
import {
  BrainCircuit,
  Calculator,
  MessageSquare,
  History,
  Settings,
  Key,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Terminal,
  ChevronRight,
  Trash2,
  ChevronDown
} from "lucide-react";

export default function ResearchStudio() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"studio" | "sandbox" | "roundtable" | "history">("studio");
  
  // Settings
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [showSettings, setShowSettings] = useState(false);
  
  // Studio State
  const [selectedSkill, setSelectedSkill] = useState<ResearchSkill | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [isResearching, setIsResearching] = useState(false);
  const [researchOutput, setResearchOutput] = useState("");
  const [researchProgress, setResearchProgress] = useState(0);
  const [parsedCommands, setParsedCommands] = useState<ParsedCommand[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  
  // Sandbox State
  const [sandboxTab, setSandboxTab] = useState<"cap" | "val" | "cross" | "benford" | "three">("three");
  
  // Sandbox 1: Market Cap
  const [scPrice, setScPrice] = useState(150);
  const [scShares, setScShares] = useState(2500000000);
  const [scReported, setScReported] = useState(375000000000);
  const [scCurrency, setScCurrency] = useState("USD");
  const [capResult, setCapResult] = useState<VerificationResult | null>(null);
  
  // Sandbox 2: Valuation
  const [valPrice, setValPrice] = useState(150);
  const [valEps, setValEps] = useState(6.5);
  const [valBvps, setValBvps] = useState(25);
  const [valFcf, setValFcf] = useState(8.2);
  const [valDiv, setValDiv] = useState(1.8);
  const [valRev, setValRev] = useState(32);
  const [valResult, setValResult] = useState<VerificationResult | null>(null);
  
  // Sandbox 3: Cross Validate
  const [crossField, setCrossField] = useState("revenue");
  const [crossUnit, setCrossUnit] = useState("亿美元");
  const [crossSources, setCrossSources] = useState('{\n  "Annual Report": 3839,\n  "Yahoo Finance": 3850,\n  "StockAnalysis": 3842\n}');
  const [crossResult, setCrossResult] = useState<VerificationResult | null>(null);
  
  // Sandbox 4: Benford Check
  const [benfordValues, setBenfordValues] = useState('[3839, 3940, 4203, 1203, 2309, 874, 912, 1102, 1948, 2039, 2194, 3029, 3810, 4920, 5829, 6102, 7291, 8019, 9291, 1029, 1394, 1829, 2748, 3019, 4529, 5821, 6102, 7392, 8021, 9120]');
  const [benfordResult, setBenfordResult] = useState<VerificationResult | null>(null);
  
  // Sandbox 5: Three Scenario
  const [tsPrice, setTsPrice] = useState(150);
  const [tsEps, setTsEps] = useState(6.5);
  const [tsShares, setTsShares] = useState(25); // billion
  const [tsGrowthOpt, setTsGrowthOpt] = useState(0.15);
  const [tsGrowthNeu, setTsGrowthNeu] = useState(0.08);
  const [tsGrowthPes, setTsGrowthPes] = useState(0.01);
  const [tsPeOpt, setTsPeOpt] = useState(25);
  const [tsPeNeu, setTsPeNeu] = useState(18);
  const [tsPePes, setTsPePes] = useState(12);
  const [tsYears, setTsYears] = useState(3);
  const [tsCurrency, setTsCurrency] = useState("USD");
  const [tsResult, setTsResult] = useState<VerificationResult | null>(null);
  
  // Roundtable State
  const [rtCompany, setRtCompany] = useState("");
  const [rtIsDebating, setRtIsDebating] = useState(false);
  const [rtDialogue, setRtDialogue] = useState<DialogueItem[]>([]);
  
  // History State
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  
  // Terminal Reference
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  interface ParsedCommand {
    id: string;
    raw: string;
    tool: "verify-market-cap" | "verify-valuation" | "cross-validate" | "three-scenario" | "benford";
    args: Record<string, any>;
    status: "pending" | "executed";
    result?: string;
  }
  
  interface DialogueItem {
    guru: "buffett" | "munger" | "duan" | "li";
    name: string;
    avatar: string;
    text: string;
  }
  
  interface SavedReport {
    id: string;
    company: string;
    skill: string;
    date: string;
    content: string;
  }

  // Load from local storage
  useEffect(() => {
    setMounted(true);
    const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    const savedKey = localStorage.getItem("ai_berkshire_apikey") || envKey;
    const savedModel = localStorage.getItem("ai_berkshire_model") || "gemini-2.5-flash";
    setApiKey(savedKey);
    setSelectedModel(savedModel);
    
    const reports = localStorage.getItem("ai_berkshire_reports");
    if (reports) {
      try { setSavedReports(JSON.parse(reports)); } catch (e) {}
    }
    
    // Default Skill
    setSelectedSkill(RESEARCH_SKILLS.find(s => s.id === "investment-research") || RESEARCH_SKILLS[0]);
  }, []);

  // Save to local storage
  const saveSettings = (keyVal: string, modelVal: string) => {
    localStorage.setItem("ai_berkshire_apikey", keyVal);
    localStorage.setItem("ai_berkshire_model", modelVal);
    setApiKey(keyVal);
    setSelectedModel(modelVal);
    setShowSettings(false);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [researchOutput, rtDialogue]);

  // Execute Financial Sandbox Computations
  const runCapVerification = () => {
    const res = verifyMarketCap(scPrice, scShares, scReported, scCurrency);
    setCapResult(res);
  };

  const runValVerification = () => {
    const res = verifyValuation(valPrice, valEps, valBvps, valFcf, valDiv, valRev);
    setValResult(res);
  };

  const runCrossVerification = () => {
    try {
      const parsed = JSON.parse(crossSources);
      const res = crossValidate(crossField, parsed, crossUnit);
      setCrossResult(res);
    } catch (e) {
      setCrossResult({ success: false, message: "Invalid JSON format in sources input.", log: "Error parsing JSON" });
    }
  };

  const runBenfordCheck = () => {
    try {
      const parsed = JSON.parse(benfordValues);
      if (!Array.isArray(parsed)) throw new Error("Must be a JSON array");
      const res = benfordCheck(parsed);
      setBenfordResult(res);
    } catch (e) {
      setBenfordResult({ success: false, message: "Invalid JSON array format.", log: "Error parsing JSON" });
    }
  };

  const runThreeScenarioVal = () => {
    const res = calculateThreeScenarioValuation(
      tsPrice,
      tsEps,
      tsShares,
      tsGrowthOpt,
      tsGrowthNeu,
      tsGrowthPes,
      tsPeOpt,
      tsPeNeu,
      tsPePes,
      tsYears,
      tsCurrency
    );
    setTsResult(res);
  };

  // Run all calculators once on mount / tab change
  useEffect(() => {
    if (mounted) {
      runCapVerification();
      runValVerification();
      runCrossVerification();
      runBenfordCheck();
      runThreeScenarioVal();
    }
  }, [mounted, sandboxTab]);

  // Parse output for python tools command suggestions
  const scanOutputForCommands = (text: string) => {
    // Regex to match tools command calls in python/bash blocks
    // python3 ~/ai-berkshire/tools/financial_rigor.py verify-market-cap --price 150 --shares 2.5e9 ...
    const regex = /(?:python3\s+~\/ai-berkshire\/tools\/financial_rigor\.py|python\s+tools\/financial_rigor\.py)\s+(\S+)(.*?)(?:\n|```|$)/g;
    let match;
    const newCommands: ParsedCommand[] = [];
    
    while ((match = regex.exec(text)) !== null) {
      const toolName = match[1];
      const argStr = match[2];
      const rawCmd = match[0].replace(/```/g, "").trim();
      
      // Parse arguments
      const args: Record<string, any> = {};
      const argRegex = /--([a-zA-Z0-9-]+)\s+({.*?}|\[.*?\]|\S+)/g;
      let argMatch;
      while ((argMatch = argRegex.exec(argStr)) !== null) {
        const name = argMatch[1];
        let val: any = argMatch[2];
        // Parse numerical values, supporting scientific notation like 9.11e9
        if (!isNaN(val)) {
          val = Number(val);
        } else if (val.toLowerCase().includes("e")) {
          const parts = val.toLowerCase().split("e");
          if (!isNaN(parts[0]) && !isNaN(parts[1])) {
            val = Number(parts[0]) * Math.pow(10, Number(parts[1]));
          }
        } else {
          try {
            val = JSON.parse(val);
          } catch (e) {}
        }
        args[name] = val;
      }
      
      const cmdId = toolName + "_" + Object.values(args).join("_");
      // Prevent duplicates
      if (!parsedCommands.some(c => c.id === cmdId) && !newCommands.some(c => c.id === cmdId)) {
        newCommands.push({
          id: cmdId,
          raw: rawCmd,
          tool: toolName as any,
          args,
          status: "pending"
        });
      }
    }
    
    if (newCommands.length > 0) {
      setParsedCommands(prev => [...prev, ...newCommands]);
    }
  };

  // Run the parsed verification command client-side
  const executeParsedCommand = (cmd: ParsedCommand) => {
    let result: VerificationResult;
    
    switch (cmd.tool) {
      case "verify-market-cap":
        result = verifyMarketCap(
          cmd.args.price || 0,
          cmd.args.shares || 0,
          cmd.args.reported || 0,
          cmd.args.currency || ""
        );
        break;
      case "verify-valuation":
        result = verifyValuation(
          cmd.args.price || 0,
          cmd.args.eps,
          cmd.args.bvps,
          cmd.args["fcf-per-share"] || cmd.args.fcf,
          cmd.args.dividend,
          cmd.args["revenue-per-share"] || cmd.args.revenue
        );
        break;
      case "cross-validate":
        result = crossValidate(
          cmd.args.field || "data",
          cmd.args.values || {},
          cmd.args.unit || "",
          cmd.args.tolerance || 2.0
        );
        break;
      case "three-scenario":
        const growth = cmd.args.growth || [0.1, 0.05, 0];
        const pe = cmd.args.pe || [20, 15, 10];
        result = calculateThreeScenarioValuation(
          cmd.args.price || 0,
          cmd.args.eps || 0,
          cmd.args.shares || 0,
          growth[0], growth[1], growth[2],
          pe[0], pe[1], pe[2],
          cmd.args.years || 3,
          cmd.args.currency || ""
        );
        break;
      case "benford":
        result = benfordCheck(cmd.args.values || []);
        break;
      default:
        result = { success: false, message: "Unknown command", log: "Command not implemented." };
    }
    
    setParsedCommands(prev =>
      prev.map(c => (c.id === cmd.id ? { ...c, status: "executed", result: result.log } : c))
    );
    
    // Automatically append back to the streamed content so the user can easily see
    setResearchOutput(prev => prev + `\n\n### 🖥️ [Client Tool Execution] ${cmd.raw}\n\`\`\`\n${result.log}\n\`\`\``);
  };

  // API Call to Gemini
  const callGeminiAPI = async (promptText: string, onChunk: (text: string) => void) => {
    const activeApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!activeApiKey) {
      throw new Error(language === "ko" ? "Gemini API Key가 설정되지 않았습니다. 상단 설정을 확인해 주세요." : "Gemini API Key is not set. Please update settings.");
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:streamGenerateContent?key=${activeApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }]
            }
          ],
          generationConfig: {
            temperature: 0.3
          }
        })
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || "Failed to contact Gemini API. Make sure your API key is correct.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Response body is not readable.");

    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      // Process chunks (SSE chunks resemble: data: {...})
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          // Streamed response is inside standard JSON parts
          const jsonStr = line.replace(/^\s*,\s*/, "").trim();
          if (jsonStr.startsWith("[") || jsonStr.startsWith("]")) continue;
          
          const parsed = JSON.parse(jsonStr);
          const chunkText = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (chunkText) {
            onChunk(chunkText);
          }
        } catch (e) {
          // SSE format fallback
        }
      }
    }
  };

  // Run Research Studio
  const handleStartResearch = async () => {
    if (!companyName.trim()) return;
    if (!selectedSkill) return;
    
    setIsResearching(true);
    setResearchOutput("");
    setResearchProgress(10);
    setParsedCommands([]);
    
    const sysPrompt = selectedSkill.prompt.replace(/\$ARGUMENTS/g, companyName);
    
    try {
      setResearchProgress(30);
      let fullResponse = "";
      
      await callGeminiAPI(sysPrompt, (chunk) => {
        fullResponse += chunk;
        setResearchOutput(fullResponse);
        scanOutputForCommands(fullResponse);
        setResearchProgress(Math.min(95, Math.floor(30 + fullResponse.length / 80)));
      });
      
      setResearchProgress(100);
      
      // Save report in local storage
      const newReport: SavedReport = {
        id: Date.now().toString(),
        company: companyName,
        skill: selectedSkill.title,
        date: new Date().toLocaleDateString(),
        content: fullResponse
      };
      
      const updated = [newReport, ...savedReports];
      setSavedReports(updated);
      localStorage.setItem("ai_berkshire_reports", JSON.stringify(updated));
      
    } catch (error: any) {
      setResearchOutput(prev => prev + `\n\n❌ **Error during execution:** ${error.message}`);
    } finally {
      setIsResearching(false);
    }
  };

  // Run Roundtable Debate
  const handleStartRoundtable = async () => {
    if (!rtCompany.trim()) return;
    
    setRtIsDebating(true);
    setRtDialogue([]);
    
    const prompt = `
    You are hosting a round-robin investment debate about the company "${rtCompany}". 
    The participants are four legendary investors:
    1. Warren Buffett: Focuses on moat, long-term fundamentals, circle of competence, and cheap price. Uses calm, wise anecdotes.
    2. Charlie Munger: Focuses on checklist, mental models, reverse thinking (what makes the company fail), and biases. Uses sharp, blunt, and intellectual language.
    3. Duan Yongping: Focuses on "right business, right people, right price" (本分, user-oriented). Uses direct, simple sentences, uses "呵呵" and "毛估估".
    4. Li Lu: Focuses on secular global trends, economic civilization evolution, and deep supply chain dynamics. Uses structural and strategic wording.
    
    Please simulate a realistic roundtable discussion where they debate whether to invest in "${rtCompany}" at its current price.
    Have each guru speak 2-3 times, responding to each other's claims. 
    Make the discussion adversarial and rigorous. Do not agree immediately. Let Buffett raise a question, Munger criticize, Duan simplify, and Li Lu analyze the macro trends.
    
    Format the response as a JSON array of dialogues so it can be parsed cleanly. Do not output anything else. No markdown wraps, only the raw JSON.
    Format of JSON:
    [
      { "guru": "buffett", "name": "Warren Buffett", "avatar": "👴", "text": "..." },
      { "guru": "munger", "name": "Charlie Munger", "avatar": "👓", "text": "..." }
    ]
    `;

    try {
      let fullResponse = "";
      
      await callGeminiAPI(prompt, (chunk) => {
        fullResponse += chunk;
        // Try to parse partial or show loading
      });

      // Clean wrap in case Gemini added markdown blocks
      const cleanJsonStr = fullResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed: DialogueItem[] = JSON.parse(cleanJsonStr);
      setRtDialogue(parsed);
      
    } catch (e: any) {
      setRtDialogue([{
        guru: "munger",
        name: "Charlie Munger",
        avatar: "👓",
        text: `Error during dialogue generation: ${e.message}. Please verify your API Key and try again.`
      }]);
    } finally {
      setRtIsDebating(false);
    }
  };

  // Delete saved report
  const handleDeleteReport = (id: string) => {
    const updated = savedReports.filter(r => r.id !== id);
    setSavedReports(updated);
    localStorage.setItem("ai_berkshire_reports", JSON.stringify(updated));
  };

  return (
    <div className="bg-[#0b1329] min-h-screen text-white py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#d4af37] animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase">
                Autonomous Research Workspace
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              AI BERKSHIRE <span className="text-[#d4af37] font-light">STUDIO</span>
            </h1>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              {language === "ko" 
                ? "바菲트, 멍거, 단융평, 리루의 투자 철학과 금융 검증 도구를 장착한 자율형 투자 리서치 플랫폼"
                : "Autonomous research engine powered by value-investing methodologies and programmatical financial checks."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#d4af37]/50 hover:bg-white/10 px-4 py-2 rounded text-xs transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4 text-[#d4af37]" />
              <span>{language === "ko" ? "API 설정" : "API Setup"}</span>
            </button>
          </div>
        </div>

        {/* Settings Modal Inline */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 border border-[#d4af37]/20 p-6 rounded-lg backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#d4af37]">
                  <Key className="w-4 h-4" />
                  <span>Gemini API Credentials</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-white/50 tracking-wider">Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#070b19] border border-white/15 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                  <p className="text-[10px] text-white/40">
                    Your key is saved in LocalStorage and never transmitted outside Google APIs.
                  </p>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-white/50 tracking-wider">Select Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-[#070b19] border border-white/15 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fast)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Recommended - Highly Logical)</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => saveSettings(apiKey, selectedModel)}
                    className="bg-[#d4af37] text-navy-deep px-6 py-2.5 rounded font-bold text-xs hover:bg-[#b8952d] transition-all cursor-pointer"
                  >
                    Save & Initialize
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-2">
          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "studio"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Research Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "sandbox"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Financial Rigor Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("roundtable")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "roundtable"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Guru Roundtable</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === "history"
                ? "border-[#d4af37] text-[#d4af37]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Saved Reports ({savedReports.length})</span>
          </button>
        </div>

        {/* Tab 1: Studio */}
        {activeTab === "studio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Setup & Skills Browser (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Input params */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-extrabold">
                  1. Research Parameters
                </h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] text-white/50 uppercase">Company Ticker / Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apple (AAPL)"
                    className="w-full bg-[#070b19] border border-white/15 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <button
                  onClick={handleStartResearch}
                  disabled={isResearching || !companyName.trim() || !apiKey}
                  className="w-full flex items-center justify-center gap-2 bg-[#d4af37] disabled:bg-white/10 text-navy-deep disabled:text-white/30 font-bold text-xs py-4 rounded hover:bg-[#b8952d] transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isResearching ? "Running Research..." : "Launch Research Agent"}</span>
                </button>
                
                {!apiKey && (
                  <p className="text-[10px] text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Please configure your Gemini API Key first.</span>
                  </p>
                )}
              </div>

              {/* Skills Selector */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-extrabold">
                  2. Select Agent Skill
                </h3>
                
                <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1 border-r border-white/5">
                  {RESEARCH_SKILLS.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill)}
                      className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer block ${
                        selectedSkill?.id === skill.id
                          ? "bg-[#d4af37]/10 border-[#d4af37] text-white"
                          : "bg-[#070b19] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="font-bold text-xs">{skill.title}</div>
                      <div className="text-[10px] text-white/40 mt-1 line-clamp-1">{skill.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Workspace & Output (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Terminal progress */}
              {isResearching && (
                <div className="w-full bg-[#070b19] border border-white/10 rounded-lg p-4 flex items-center gap-4">
                  <div className="h-2 flex-grow bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${researchProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd700]"
                    />
                  </div>
                  <span className="text-xs font-mono">{researchProgress}%</span>
                </div>
              )}

              {/* Live Terminal & Interactive Tools */}
              <div className="bg-[#070b19] border border-white/10 rounded-lg overflow-hidden flex flex-col min-h-[500px]">
                
                {/* Terminal Header */}
                <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                      Research Studio Output Workspace
                    </span>
                  </div>
                  {researchOutput && (
                    <button
                      onClick={() => {
                        const blob = new Blob([researchOutput], { type: "text/markdown" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${companyName || "AI_Berkshire"}_Report.md`;
                        a.click();
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-white/60 hover:text-[#d4af37] transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export MD</span>
                    </button>
                  )}
                </div>

                {/* Terminal Content */}
                <div className="flex-grow p-6 font-mono text-xs overflow-y-auto space-y-6 max-h-[600px] leading-relaxed">
                  {!researchOutput && !isResearching ? (
                    <div className="h-[400px] flex flex-col justify-center items-center text-center space-y-4 text-white/30">
                      <BrainCircuit className="w-12 h-12 text-white/10" />
                      <p className="text-xs">
                        Enter a company name, select an investment research skill from the panel, and launch the research agent.
                      </p>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap select-text break-words">
                      {researchOutput}
                    </div>
                  )}
                  
                  {/* Dynamic Tool Executer widgets */}
                  {parsedCommands.length > 0 && (
                    <div className="border-t border-white/10 pt-6 space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
                        Detected Tool Verification Requests
                      </div>
                      
                      {parsedCommands.map((cmd) => (
                        <div key={cmd.id} className="bg-white/5 border border-white/10 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1 font-mono">
                            <div className="text-[10px] text-[#d4af37]">{cmd.tool}</div>
                            <div className="text-xs text-white/70 select-all">{cmd.raw}</div>
                          </div>
                          
                          <button
                            onClick={() => executeParsedCommand(cmd)}
                            disabled={cmd.status === "executed"}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded text-[10px] font-bold font-sans transition-all cursor-pointer ${
                              cmd.status === "executed"
                                ? "bg-white/15 text-white/40 border border-transparent"
                                : "bg-[#d4af37] text-navy-deep hover:bg-[#b8952d]"
                            }`}
                          >
                            {cmd.status === "executed" ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                <span>Executed</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Run Verification</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Financial Rigor Sandbox */}
        {activeTab === "sandbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sandbox Sidebar (3 cols) */}
            <div className="lg:col-span-3 space-y-2">
              <button
                onClick={() => setSandboxTab("three")}
                className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex justify-between items-center ${
                  sandboxTab === "three" ? "bg-[#d4af37]/10 border-[#d4af37]" : "bg-white/5 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-bold">Three Scenario Valuation</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
              </button>

              <button
                onClick={() => setSandboxTab("cap")}
                className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex justify-between items-center ${
                  sandboxTab === "cap" ? "bg-[#d4af37]/10 border-[#d4af37]" : "bg-white/5 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-bold">Market Cap Verification</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
              </button>

              <button
                onClick={() => setSandboxTab("val")}
                className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex justify-between items-center ${
                  sandboxTab === "val" ? "bg-[#d4af37]/10 border-[#d4af37]" : "bg-white/5 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-bold">Valuation Verification</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
              </button>

              <button
                onClick={() => setSandboxTab("cross")}
                className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex justify-between items-center ${
                  sandboxTab === "cross" ? "bg-[#d4af37]/10 border-[#d4af37]" : "bg-white/5 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-bold">Cross-Source Validation</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
              </button>

              <button
                onClick={() => setSandboxTab("benford")}
                className={`w-full text-left p-3.5 rounded border transition-all cursor-pointer flex justify-between items-center ${
                  sandboxTab === "benford" ? "bg-[#d4af37]/10 border-[#d4af37]" : "bg-white/5 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-xs font-bold">Benford's Law Check</span>
                <ChevronRight className="w-4 h-4 text-[#d4af37]" />
              </button>
            </div>

            {/* Sandbox Workspace (9 cols) */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
              
              {/* Inputs Column (5 cols) */}
              <div className="md:col-span-5 bg-white/5 border border-white/10 p-6 rounded-lg flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-extrabold">
                    Calculator Parameters
                  </h3>
                  
                  {/* Mode 1: Three Scenario */}
                  {sandboxTab === "three" && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-white/50">Current Price</label>
                          <input type="number" value={tsPrice} onChange={e => setTsPrice(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/50">Current EPS</label>
                          <input type="number" value={tsEps} onChange={e => setTsEps(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-white/50">Shares (Billion)</label>
                          <input type="number" value={tsShares} onChange={e => setTsShares(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/50">Horizon (Years)</label>
                          <input type="number" value={tsYears} onChange={e => setTsYears(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 space-y-3">
                        <div className="text-[10px] text-[#d4af37] font-bold">GROWTH RATE (OPTIMISTIC / NEUTRAL / PESSIMISTIC)</div>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="number" step="0.01" value={tsGrowthOpt} onChange={e => setTsGrowthOpt(Number(e.target.value))} placeholder="Bull" className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white text-center" />
                          <input type="number" step="0.01" value={tsGrowthNeu} onChange={e => setTsGrowthNeu(Number(e.target.value))} placeholder="Base" className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white text-center" />
                          <input type="number" step="0.01" value={tsGrowthPes} onChange={e => setTsGrowthPes(Number(e.target.value))} placeholder="Bear" className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white text-center" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[10px] text-[#d4af37] font-bold">TARGET PE MULTIPLE (BULL / BASE / BEAR)</div>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="number" value={tsPeOpt} onChange={e => setTsPeOpt(Number(e.target.value))} placeholder="Bull" className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white text-center" />
                          <input type="number" value={tsPeNeu} onChange={e => setTsPeNeu(Number(e.target.value))} placeholder="Base" className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white text-center" />
                          <input type="number" value={tsPePes} onChange={e => setTsPePes(Number(e.target.value))} placeholder="Bear" className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white text-center" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Market Cap */}
                  {sandboxTab === "cap" && (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-white/50">Current Price</label>
                        <input type="number" value={scPrice} onChange={e => setScPrice(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-white/50">Total Shares</label>
                        <input type="number" value={scShares} onChange={e => setScShares(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        <span className="text-[10px] text-white/30">e.g. 9.11e9 = 9110000000</span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-white/50">Reported Market Cap</label>
                        <input type="number" value={scReported} onChange={e => setScReported(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-white/50">Currency Symbol</label>
                        <input type="text" value={scCurrency} onChange={e => setScCurrency(e.target.value)} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                      </div>
                    </div>
                  )}

                  {/* Mode 3: Valuation */}
                  {sandboxTab === "val" && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-white/50">Stock Price</label>
                          <input type="number" value={valPrice} onChange={e => setValPrice(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/50">EPS (Earnings)</label>
                          <input type="number" value={valEps} onChange={e => setValEps(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-white/50">BVPS (Book Value)</label>
                          <input type="number" value={valBvps} onChange={e => setValBvps(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/50">FCF per Share</label>
                          <input type="number" value={valFcf} onChange={e => setValFcf(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-white/50">DPS (Dividend)</label>
                          <input type="number" value={valDiv} onChange={e => setValDiv(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/50">Revenue per Share</label>
                          <input type="number" value={valRev} onChange={e => setValRev(Number(e.target.value))} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 4: Cross Source */}
                  {sandboxTab === "cross" && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-white/50">Field Name</label>
                          <input type="text" value={crossField} onChange={e => setCrossField(e.target.value)} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-white/50">Unit</label>
                          <input type="text" value={crossUnit} onChange={e => setCrossUnit(e.target.value)} className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-white/50">Source Values JSON Map</label>
                        <textarea
                          rows={6}
                          value={crossSources}
                          onChange={e => setCrossSources(e.target.value)}
                          className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Mode 5: Benford Check */}
                  {sandboxTab === "benford" && (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-white/50">Financial Values (JSON Array)</label>
                        <textarea
                          rows={10}
                          value={benfordValues}
                          onChange={e => setBenfordValues(e.target.value)}
                          className="w-full bg-[#070b19] border border-white/15 p-2.5 rounded text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (sandboxTab === "three") runThreeScenarioVal();
                    else if (sandboxTab === "cap") runCapVerification();
                    else if (sandboxTab === "val") runValVerification();
                    else if (sandboxTab === "cross") runCrossVerification();
                    else if (sandboxTab === "benford") runBenfordCheck();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-navy-deep font-bold text-xs py-4 rounded hover:bg-[#b8952d] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recompute Metrics</span>
                </button>
              </div>

              {/* Outputs Column (7 cols) */}
              <div className="md:col-span-7 bg-[#070b19] border border-white/10 p-6 rounded-lg flex flex-col justify-between">
                
                {/* Live Sandbox Charts or Terminals */}
                <div className="space-y-6 flex-grow">
                  
                  {sandboxTab === "three" && tsResult?.data && (
                    <div className="space-y-6">
                      <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                        Three-Scenario Growth Forecast Chart
                      </h4>
                      
                      {/* Simple SVG Chart */}
                      <div className="h-[180px] bg-white/5 rounded border border-white/5 p-4 flex items-end relative">
                        <svg className="w-full h-full overflow-visible">
                          {/* Y lines */}
                          <line x1="0" y1="0" x2="100%" y2="0" stroke="white" strokeOpacity="0.05" />
                          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeOpacity="0.05" />
                          <line x1="0" y1="100%" x2="100%" y2="100%" stroke="white" strokeOpacity="0.05" strokeWidth="2" />
                          
                          {/* SVG Path calculation */}
                          {(() => {
                            const current = tsPrice;
                            const opt = tsResult.data[0].targetPrice;
                            const neu = tsResult.data[1].targetPrice;
                            const pes = tsResult.data[2].targetPrice;
                            
                            const maxVal = Math.max(current, opt, neu, pes) * 1.1;
                            const getY = (val: number) => 150 - (val / maxVal) * 130;
                            
                            return (
                              <>
                                {/* Current value dot */}
                                <circle cx="30" cy={getY(current)} r="5" fill="#fff" />
                                <text x="35" y={getY(current) - 8} fill="#fff" fontSize="10" fontWeight="bold">Now: {current}</text>
                                
                                {/* Bull scenario */}
                                <line x1="30" y1={getY(current)} x2="85%" y2={getY(opt)} stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2" />
                                <circle cx="85%" cy={getY(opt)} r="5" fill="#22c55e" />
                                <text x="86%" y={getY(opt) - 8} fill="#22c55e" fontSize="10" fontWeight="bold">Bull: {opt.toFixed(1)}</text>
                                
                                {/* Base scenario */}
                                <line x1="30" y1={getY(current)} x2="85%" y2={getY(neu)} stroke="#d4af37" strokeWidth="2" />
                                <circle cx="85%" cy={getY(neu)} r="5" fill="#d4af37" />
                                <text x="86%" y={getY(neu) + 12} fill="#d4af37" fontSize="10" fontWeight="bold">Base: {neu.toFixed(1)}</text>
                                
                                {/* Bear scenario */}
                                <line x1="30" y1={getY(current)} x2="85%" y2={getY(pes)} stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
                                <circle cx="85%" cy={getY(pes)} r="5" fill="#ef4444" />
                                <text x="86%" y={getY(pes) + 12} fill="#ef4444" fontSize="10" fontWeight="bold">Bear: {pes.toFixed(1)}</text>
                              </>
                            );
                          })()}
                        </svg>
                        
                        <div className="absolute bottom-2 left-6 text-[9px] uppercase tracking-wider text-white/30">
                          Horizon: {tsYears} Years
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terminal Log */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="text-[10px] font-mono uppercase text-white/50">Calculation Log Output</span>
                    </div>
                    
                    <pre className="bg-[#0b1329] border border-white/5 p-4 rounded text-[11px] font-mono leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {sandboxTab === "three" && tsResult?.log}
                      {sandboxTab === "cap" && capResult?.log}
                      {sandboxTab === "val" && valResult?.log}
                      {sandboxTab === "cross" && crossResult?.log}
                      {sandboxTab === "benford" && benfordResult?.log}
                    </pre>
                  </div>
                  
                </div>
                
                {/* Result check status */}
                {(() => {
                  const currentResult = 
                    sandboxTab === "three" ? tsResult :
                    sandboxTab === "cap" ? capResult :
                    sandboxTab === "val" ? valResult :
                    sandboxTab === "cross" ? crossResult :
                    benfordResult;
                    
                  if (!currentResult) return null;
                  
                  return (
                    <div className={`mt-6 p-4 rounded flex items-center gap-3 border ${
                      currentResult.success 
                        ? "bg-green-500/5 border-green-500/20 text-green-400" 
                        : "bg-red-500/5 border-red-500/20 text-red-400"
                    }`}>
                      {currentResult.success ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      )}
                      <div className="text-xs">
                        <div className="font-bold">
                          {currentResult.success ? "Rigor Check Approved" : "Rigor Check Disapproved"}
                        </div>
                        <div className="text-white/60 mt-0.5">{currentResult.message}</div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Guru Roundtable */}
        {activeTab === "roundtable" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input card (4 cols) */}
            <div className="lg:col-span-4 bg-white/5 border border-white/10 p-6 rounded-lg space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-extrabold">
                    Guru Roundtable Debate
                  </h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Enter a company name. Four legendary investment gurus will carry out a simulated group chat, debating the company's valuation, moat, and risk profile.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/50 uppercase">Company Name</label>
                <input
                  type="text"
                  value={rtCompany}
                  onChange={(e) => setRtCompany(e.target.value)}
                  placeholder="e.g. Nvidia (NVDA)"
                  className="w-full bg-[#070b19] border border-white/15 px-4 py-3 rounded text-sm text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                onClick={handleStartRoundtable}
                disabled={rtIsDebating || !rtCompany.trim() || !apiKey}
                className="w-full flex items-center justify-center gap-2 bg-[#d4af37] disabled:bg-white/10 text-navy-deep disabled:text-white/30 font-bold text-xs py-4 rounded hover:bg-[#b8952d] transition-all cursor-pointer"
              >
                {rtIsDebating ? "Simulating Roundtable..." : "Start Guru Debate"}
              </button>
              
              {!apiKey && (
                <p className="text-[10px] text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>API Key is required to call the roundtable simulation.</span>
                </p>
              )}
            </div>

            {/* Chat Board (8 cols) */}
            <div className="lg:col-span-8 bg-[#070b19] border border-white/10 rounded-lg overflow-hidden flex flex-col min-h-[500px]">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <div className="text-[10px] font-mono uppercase text-white/50">
                  Guru Roundtable Chat Stream
                </div>
              </div>
              
              <div className="flex-grow p-6 space-y-6 max-h-[500px] overflow-y-auto">
                {rtDialogue.length === 0 && !rtIsDebating ? (
                  <div className="h-[350px] flex flex-col justify-center items-center text-center space-y-4 text-white/30">
                    <MessageSquare className="w-12 h-12 text-white/10 animate-bounce" />
                    <p className="text-xs">
                      Start the debate to see the investment dialogue of the four masters.
                    </p>
                  </div>
                ) : rtIsDebating && rtDialogue.length === 0 ? (
                  <div className="h-[350px] flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-t-transparent border-[#d4af37] rounded-full animate-spin" />
                    <p className="text-xs text-white/40">Gathering gurus into the studio. Reading company reports...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rtDialogue.map((item, index) => {
                      const bubbleColor = 
                        item.guru === "buffett" ? "border-amber-500/20 bg-amber-500/5 text-amber-100" :
                        item.guru === "munger" ? "border-purple-500/20 bg-purple-500/5 text-purple-100" :
                        item.guru === "duan" ? "border-blue-500/20 bg-blue-500/5 text-blue-100" :
                        "border-emerald-500/20 bg-emerald-500/5 text-emerald-100";
                        
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-4 p-4 border rounded-lg ${bubbleColor}`}
                        >
                          <span className="text-2xl h-10 w-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 flex-shrink-0">
                            {item.avatar}
                          </span>
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                              {item.name}
                            </div>
                            <p className="text-xs leading-relaxed font-sans">{item.text}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

          </div>
        )}

        {/* Tab 4: History / Saved Reports */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-extrabold">
              Saved Research Reports ({savedReports.length})
            </h3>
            
            {savedReports.length === 0 ? (
              <div className="bg-white/5 border border-white/10 p-12 text-center rounded text-white/30 space-y-4">
                <History className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-xs">No reports saved yet. Completed research reports in the Studio will automatically save here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedReports.map((report) => (
                  <div key={report.id} className="bg-white/5 border border-white/10 p-6 rounded-lg flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                        <span>{report.date}</span>
                        <span className="bg-[#d4af37]/10 text-[#d4af37] px-2.5 py-0.5 rounded font-sans font-bold">{report.skill}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white">{report.company}</h4>
                      <p className="text-xs text-white/60 line-clamp-3 leading-relaxed font-light font-sans">{report.content}</p>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <button
                        onClick={() => {
                          setCompanyName(report.company);
                          setResearchOutput(report.content);
                          setActiveTab("studio");
                        }}
                        className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#ffd700] font-bold cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Load Workspace</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
