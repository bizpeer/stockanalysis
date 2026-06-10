"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Dictionary, dictionaries, defaultLanguage } from "@/locales/dictionaries";

interface LanguageContextProps {
  language: Language;
  t: Dictionary;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // 클라이언트 측 로드 시 쿠키나 로컬스토리지에서 기존 언어 설정 가져오기
    const savedLang = localStorage.getItem("onedays_lang") as Language;
    if (savedLang === "ko" || savedLang === "en") {
      setLanguageState(savedLang);
    } else {
      // 브라우저 기본 언어 감지
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "en") {
        setLanguageState("en");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("onedays_lang", lang);
    // 선택 언어를 쿠키에도 저장하여 필요시 서버사이드 렌더링에 대응 가능하도록 조치
    document.cookie = `onedays_lang=${lang}; path=/; max-age=31536000`;
  };

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
