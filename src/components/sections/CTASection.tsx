import { useRef } from "react";
import { useTranslation } from "../providers/LanguageContext";

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-black">
      <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" fill="currentColor"/>
    </svg>
  );
}

export default function CTASection({ onNavigate }: { onNavigate?: () => void }) {
  const { language, t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  const localizedComparisons = [
    {
      bad: t("cta_row_1_bad"),
      good: t("cta_row_1_good")
    },
    {
      bad: t("cta_row_2_bad"),
      good: t("cta_row_2_good")
    },
    {
      bad: t("cta_row_3_bad"),
      good: t("cta_row_3_good")
    },
    {
      bad: t("cta_row_4_bad"),
      good: t("cta_row_4_good")
    }
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#F5F5F0] pt-8 md:pt-12 pb-6 md:pb-8">
      {/* Global Vertical line */}
      <div className="hidden md:block absolute top-[0px] bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Top horizontal border to seamlessly connect with Testimonials */}
      <div className="hidden md:block absolute top-0 right-0 h-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] px-6 md:px-12 relative z-10 h-full mt-4 md:mt-8">
        
        {/* The Peach Box */}
        <div className="bg-[#FFF3ED] rounded-[2rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
          
          {/* Black Swoosh Background Graphic */}
          <div className="absolute top-[15%] right-[-15%] w-[800px] h-[1000px] border-[1px] border-black/10 rounded-[50%] -rotate-[15deg] pointer-events-none z-0" />

          {/* Header */}
          <div className="text-center relative z-10 max-w-[800px] mx-auto mb-16">
            <h2 className="font-display font-medium text-[clamp(2rem,4vw,3.75rem)] text-black leading-[1.05] tracking-tight mb-5">
              {t("cta_title_1")} <br />
              <em className="font-accent font-normal tracking-normal italic">{t("cta_title_2")}</em>
            </h2>
            <p className="font-display text-[15px] md:text-[16px] text-black/80 max-w-[560px] mx-auto leading-[1.6] font-medium">
              {t("cta_subtext")}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="relative z-10 max-w-[1000px] mx-auto">
            {/* Table Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-6 relative">
              
              {/* Left Header */}
              <div className="flex flex-col items-center md:items-center text-center">
                <h3 className="font-display font-semibold text-[20px] md:text-[22px] text-black">{t("cta_table_isolated_title")}</h3>
                <p className="font-display text-[13px] md:text-[14px] text-black/50 mt-1">{t("cta_table_isolated_sub")}</p>
              </div>
              
              {/* Right Header */}
              <div className="flex flex-col items-center md:items-center text-center relative">
                {/* Spark Icon */}
                <div className="hidden md:block absolute -left-10 lg:-left-12 top-0 w-10 h-10 text-black">
                  <SparkIcon />
                </div>
                <h3 className="font-display font-semibold text-[20px] md:text-[22px] text-black">{t("cta_table_wgb_title")}</h3>
                <p className="font-display text-[13px] md:text-[14px] text-black/50 mt-1">{t("cta_table_wgb_sub")}</p>
              </div>
              
            </div>

            {/* Table Rows */}
            <div className="flex flex-col gap-3.5">
              {localizedComparisons.map((item, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-12">
                  {/* Bad Card */}
                  <div className="bg-white rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="w-8 h-8 rounded-xl bg-[#FFE9E0] text-[#FF5A00] flex items-center justify-center shrink-0">
                      <CloseIcon />
                    </div>
                    <p className="font-display text-[14px] md:text-[15px] text-black/90 leading-[1.5] mt-1 font-medium">
                      {item.bad}
                    </p>
                  </div>

                  {/* Good Card */}
                  <div className="bg-white rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <PlusIcon />
                    </div>
                    <p className="font-display text-[14px] md:text-[15px] text-black/90 leading-[1.5] mt-1 font-medium">
                      {item.good}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 flex justify-center relative z-10">
            <button 
              onClick={onNavigate || (() => { window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); })}
              className="group inline-flex items-center gap-3 bg-black text-white rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl hover:bg-neutral-800 shadow-lg shadow-black/10"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black transition-all duration-500 ease-out group-hover:scale-110">
                <PlusIcon />
              </span>
              {t("cta_btn")}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
