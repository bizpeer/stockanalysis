import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "원데이즈PE | Onedays Private Equity",
  description:
    "Strategic Capital Partner for Mid-Market Opportunities. 사모펀드, 기업금융 및 구조화 자본 솔루션을 제공하는 원데이즈PE입니다.",
  keywords: [
    "Private Equity Korea",
    "Structured Finance Korea",
    "Merchant Banking",
    "Acquisition Financing",
    "Corporate Finance Advisory",
    "Mid-Market Investment",
    "원데이즈PE",
    "사모펀드",
    "구조화금융",
    "인수금융",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-light-gray text-inst-black min-h-screen flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-grow pt-[72px] lg:pt-[84px]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
