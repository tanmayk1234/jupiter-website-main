import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "../providers/LanguageContext";

export default function AboutPage() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in animation
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={pageRef} className="bg-[#F5F5F0] text-black min-h-screen pt-32 pb-24 px-6 md:px-[max(1.5rem,min(5vw,4rem))] font-display">
      {/* Global vertical border line on desktop to match the theme */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="max-w-[1100px] mx-auto md:pl-16 relative z-10">
        
        {/* Hero Section */}
        <div className="mb-20 max-w-[800px]">
          <h1 className="font-medium text-[clamp(2.5rem,5.5vw,6rem)] leading-[0.98] tracking-[-0.04em] mb-8">
            {t("about_hero_title_main")}
            <em className="font-accent font-normal tracking-normal italic">{t("about_hero_title_italic")}</em>
          </h1>
          <p className="text-black/60 text-[clamp(15px,1.2vw,18px)] leading-[1.6] max-w-[65ch]">
            {t("about_hero_sub")}
          </p>
        </div>

        {/* Content Split: Values & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 border-t border-black/10 pt-16 mb-20">
          <div>
            <h2 className="font-semibold text-2xl mb-6 tracking-tight">{t("about_vision_title")}</h2>
            <p className="text-black/70 leading-[1.7] text-[15px] mb-6">
              {t("about_vision_desc")}
            </p>
            <ul className="flex flex-col gap-4 text-[14px] font-semibold">
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <span>{t("about_value_1")}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <span>{t("about_value_2")}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-black" />
                <span>{t("about_value_3")}</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold text-2xl mb-6 tracking-tight">{t("about_standards_title")}</h2>
            <p className="text-black/70 leading-[1.7] text-[15px]">
              {t("about_standards_desc")}
            </p>
          </div>
        </div>

        {/* Brand Showcase Block */}
        <div className="bg-black text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full filter blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-[500px]">
            <h3 className="font-semibold text-2xl md:text-3xl mb-4 tracking-tight">{t("about_cta_title")}</h3>
            <p className="text-white/60 text-[14px] leading-[1.6]">
              {t("about_cta_desc")}
            </p>
          </div>
          
          <button className="relative z-10 bg-white hover:bg-neutral-200 text-black font-semibold text-[14px] px-6 py-3.5 rounded-full transition-colors duration-300">
            {t("about_cta_btn")}
          </button>
        </div>

      </div>
    </div>
  );
}
