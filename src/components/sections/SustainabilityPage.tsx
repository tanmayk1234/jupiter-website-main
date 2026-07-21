import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../providers/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

/* ─── Reusable plus icon ─── */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

/* ─── Leaf SVG icon for bullet lists ─── */
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}

/* ─── Component ─── */
export default function SustainabilityPage({ onViewChange }: { onViewChange?: (view: "home" | "order" | "about" | "blog" | "resources" | "sustainability") => void }) {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);

  const greenCards = [
    {
      title: t("sust_card_1_title"),
      desc: t("sust_card_1_desc"),
      icon: "♻️",
    },
    {
      title: t("sust_card_2_title"),
      desc: t("sust_card_2_desc"),
      icon: "🌿",
    },
    {
      title: t("sust_card_3_title"),
      desc: t("sust_card_3_desc"),
      icon: "💧",
    },
  ];

  const envInitiatives = [
    t("sust_env_1"),
    t("sust_env_2"),
    t("sust_env_3"),
    t("sust_env_4"),
    t("sust_env_5"),
    t("sust_env_6"),
    t("sust_env_7"),
    t("sust_env_8"),
    t("sust_env_9"),
  ];





  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page fade in
      gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });

      // Hero text reveal
      gsap.fromTo(
        heroRef.current?.querySelectorAll(".hero-reveal") || [],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
      );

      // Cards stagger
      gsap.fromTo(
        cardsRef.current?.querySelectorAll(".green-card") || [],
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        }
      );

      // Environment section slide in
      const envItems = envRef.current?.querySelectorAll(".env-item") || [];
      gsap.fromTo(envItems,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.5, stagger: 0.06, ease: "power2.out",
          scrollTrigger: { trigger: envRef.current, start: "top 75%" },
        }
      );




    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="bg-[#F5F5F0] text-black min-h-screen font-display">
      {/* Global vertical border */}
      <div className="hidden md:block fixed top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-[max(1.5rem,min(5vw,4rem))] overflow-hidden">
        <div className="max-w-[1100px] mx-auto md:pl-16 relative z-10">
          <span className="hero-reveal inline-block text-black font-semibold text-[13px] tracking-widest uppercase mb-6">
            {t("sust_commitment")}
          </span>
          <h1 className="hero-reveal font-medium text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.95] tracking-[-0.04em] mb-8 max-w-[900px]">
            {t("sust_hero_title_1")}{" "}
            <em className="font-accent font-normal tracking-normal italic">{t("sust_hero_title_italic")}</em>
            <br className="hidden md:block" />
            {t("sust_hero_title_2")}
          </h1>
          <p className="hero-reveal text-black/60 text-[clamp(15px,1.2vw,18px)] leading-[1.7] max-w-[60ch] mb-10">
            {t("sust_hero_desc")}
          </p>
          <button 
            onClick={() => { onViewChange?.("order"); window.scrollTo(0, 0); }}
            className="group hero-reveal inline-flex items-center gap-3 bg-black text-white rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl hover:bg-neutral-800"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black transition-all duration-500 ease-out group-hover:scale-110">
              <PlusIcon />
            </span>
            {t("sust_hero_btn")}
          </button>
        </div>
        {/* Hero image */}
        <div className="hero-reveal max-w-[1100px] mx-auto md:pl-16 mt-12 md:mt-16">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden h-[300px] md:h-[460px] relative">
            <img
              src="/assets/images/sustainability/hero.png"
              alt="Sustainable industrial facility with green vegetation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* ═══ GREEN SCHEME BANNER ═══ */}
      <section className="md:ml-[max(1.5rem,min(5vw,4rem))] border-t border-b border-black">
        <div className="max-w-[1100px] mx-auto px-6 md:px-16 py-14 md:py-20 text-center">
          <h2 className="text-black font-semibold text-[15px] tracking-widest uppercase mb-4">{t("sust_green_scheme_title")}</h2>
          <p className="text-black/70 text-[clamp(14px,1.1vw,17px)] leading-[1.7] max-w-[70ch] mx-auto">
            {t("sust_green_scheme_desc")}
          </p>
        </div>
      </section>

      {/* ═══ GREEN INITIATIVES CARDS ═══ */}
      <section className="py-20 md:py-28 px-6 md:px-[max(1.5rem,min(5vw,4rem))]">
        <div className="max-w-[1100px] mx-auto md:pl-16">
          <h2 className="font-medium text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.03em] mb-4">
            {t("sust_green_init_title")} <em className="font-accent font-normal tracking-normal italic">{t("sust_green_init_italic")}</em> {t("sust_green_init_title_2")}
          </h2>
          <p className="text-black/50 text-[15px] mb-12 max-w-[50ch]">
            {t("sust_green_init_desc")}
          </p>

          {/* Image banner */}
          <div className="rounded-2xl overflow-hidden mb-12 h-[220px] md:h-[320px]">
            <img
              src="/assets/images/sustainability/green-initiatives.png"
              alt="Solar panels, water treatment, and emissions control"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {greenCards.map((card, i) => (
              <div
                key={i}
                className="green-card group bg-white rounded-2xl border border-black/8 p-7 md:p-8 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <h3 className="font-semibold text-[18px] tracking-tight leading-snug">{card.title}</h3>
                </div>
                <p className="text-[14px] text-black/60 leading-[1.65]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ENVIRONMENT PROTECTION ═══ */}
      <section ref={envRef} className="md:ml-[max(1.5rem,min(5vw,4rem))] border-t border-black py-20 md:py-28 px-6 md:px-16">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-start">
          {/* Image */}
          <div className="w-full md:w-[45%] shrink-0 rounded-2xl overflow-hidden h-[350px] md:h-[480px] relative group">
            <img
              src="/assets/images/sustainability/environment.png"
              alt="Pollution control equipment"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="font-medium text-[clamp(2rem,3.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] mb-8">
              {t("sust_env_title_1")}{" "}
              <em className="font-accent font-normal tracking-normal italic">{t("sust_env_title_italic")}</em>
              <br />{t("sust_env_title_2")}
            </h2>
            <ul className="flex flex-col gap-4">
              {envInitiatives.map((item, i) => (
                <li key={i} className="env-item flex items-start gap-3 text-[14px] md:text-[15px] text-black/75 leading-[1.6]">
                  <LeafIcon className="text-black shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="relative bg-[#F5F5F0] pb-20">
        {/* Vertical separator line matching the page theme */}
        <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black/20 z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

        <div className="md:ml-[max(1.5rem,min(5vw,4rem))] px-6 md:px-16 relative z-10">
          <div className="max-w-[1100px] mx-auto bg-black text-white rounded-3xl p-8 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full filter blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-[520px]">
              <h3 className="font-semibold text-2xl md:text-3xl mb-3 tracking-tight">
                {t("sust_cta_title")}
              </h3>
              <p className="text-white/50 text-[14px] leading-[1.6]">
                {t("sust_cta_desc")}
              </p>
            </div>

            <button 
              onClick={() => { onViewChange?.("order"); window.scrollTo(0, 0); }}
              className="group relative z-10 inline-flex items-center gap-3 bg-white text-black rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl hover:bg-neutral-200 shrink-0"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white transition-all duration-500 ease-out group-hover:scale-110">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-180">
                  <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="white"/>
                </svg>
              </span>
              {t("sust_cta_btn")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
