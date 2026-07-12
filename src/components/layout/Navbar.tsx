import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation, Language } from "../providers/LanguageContext";



const navLinks = [
  { label: "Manifesto", href: "#" },
  { label: "Services", href: "#" },
  { label: "Cases", href: "#" },
  { label: "About", href: "#" },
];

export default function Navbar({ 
  isLoaded = true,
  currentView,
  onViewChange
}: { 
  isLoaded?: boolean;
  currentView: "home" | "order" | "about" | "blog" | "resources" | "sustainability";
  onViewChange: (view: "home" | "order" | "about" | "blog" | "resources" | "sustainability") => void;
}) {
  const { language, setLanguage, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [othersOpen, setOthersOpen]         = useState(false);
  const [mobileOthersOpen, setMobileOthersOpen] = useState(false);
  const [langOpen, setLangOpen]             = useState(false);
  const [isDark, setIsDark]                 = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const currentViewRef = useRef(currentView);

  // Keep ref in sync with prop
  useEffect(() => {
    currentViewRef.current = currentView;
    // Force light mode on any non-home page
    if (currentView !== "home") {
      setIsDark(false);
    }
  }, [currentView]);

  const navItems = [
    { label: t("home"), view: "home" as const },
    { label: t("order"), view: "order" as const },
    { label: t("products"), view: "products" as const },
    { label: t("about_us"), view: "about" as const },
  ];

  const handleItemClick = (view: "home" | "order" | "about" | "products" | "blog" | "resources" | "sustainability") => {
    if (view === "products") {
      onViewChange("home");
      setTimeout(() => {
        const el = document.getElementById("cases-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else if (view === "home") {
      if (currentView !== "home") {
        onViewChange("home");
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (currentView === view) return;
      onViewChange(view);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    
    // Initial fade in
    gsap.fromTo(navRef.current,
      { yPercent: -200, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.7, delay: 2.5, ease: "power3.out" }
    );

    // Hide/Show on scroll logic using GSAP for perfect sync with Lenis
    const showAnim = gsap.to(navRef.current, {
      yPercent: -200,
      opacity: 0,
      paused: true,
      duration: 0.3,
      ease: "power2.inOut"
    });

    const hideShowTrigger = ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.direction === 1 && self.scroll() > 80) {
          showAnim.play(); // scrolling down: hide
        } else {
          showAnim.reverse(); // scrolling up: show
        }
      }
    });

    // Detect when overlapping a dark section
    const darkSections = document.querySelectorAll('.section-dark');
    const darkTriggers: globalThis.ScrollTrigger[] = [];
    
    darkSections.forEach(section => {
      darkTriggers.push(ScrollTrigger.create({
        trigger: section,
        start: "top 64px", // When top of section hits bottom of navbar (approx 64px)
        end: "bottom 64px",
        onEnter: () => { if (currentViewRef.current === "home") setIsDark(true); },
        onLeave: () => setIsDark(false),
        onEnterBack: () => { if (currentViewRef.current === "home") setIsDark(true); },
        onLeaveBack: () => setIsDark(false),
      }));
    });

    return () => {
      hideShowTrigger.kill();
      darkTriggers.forEach(t => t.kill());
    };
  }, [isLoaded]);

  // Dynamic colors based on isDark
  const bgColor = isDark ? "#000000" : "#F5F5F0";
  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "bg-white/40" : "bg-black";
  const borderRightColor = isDark ? "border-white/40" : "border-black";

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ease-in-out ${textColor} overflow-visible`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Horizontal bottom border — Left segment */}
        <div
          className={`absolute bottom-0 left-0 h-px transition-colors duration-300 ${borderColor}`}
          style={{
            width: "calc(max(1.5rem, min(5vw, 4rem)) - 24px)",
          }}
        />

        {/* Horizontal bottom border — Right segment */}
        <div
          className={`absolute bottom-0 right-0 h-px transition-colors duration-300 ${borderColor}`}
          style={{
            left: "calc(max(1.5rem, min(5vw, 4rem)) + 24px)",
          }}
        />

        {/* Top vertical border segment above the logo */}
        <div
          className={`hidden md:block absolute top-0 w-px transition-colors duration-300 ${borderColor}`}
          style={{
            left: "max(1.5rem, min(5vw, 4rem))",
            height: "40px",
          }}
        />

        {/* Jupiter logo — centered exactly at line intersection, no background color, cut to cut */}
        <div
          className="hidden md:block absolute pointer-events-none z-30"
          style={{
            bottom: 0,
            left: "max(1.5rem, min(5vw, 4rem))",
            transform: "translate(-50%, 50%)",
            width: "48px",
            height: "48px",
            backgroundColor: "transparent",
          }}
        >
          <img
            src="/jupiter-logo.png"
            alt="Jupiter"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        <div className="flex items-stretch h-14 md:h-16 relative">
          {/* Left spacer with NO vertical border (border removed so it doesn't cross the logo) */}
          <div
            className="hidden md:block shrink-0"
            style={{ width: "max(1.5rem, min(5vw, 4rem))" }}
          />

          {/* Inner nav */}
          <div className="flex-1 relative flex items-center px-5 md:px-6">
            {/* Jupiter wordmark — left side, offset right to clear the gear logo */}
            <span
              className="hidden md:block font-friz font-medium tracking-[0.12em] select-none relative z-20"
              style={{
                marginLeft: "44px",
                fontSize: "clamp(16px, 1.6vw, 22px)"
              }}
            >
              Jupiter Engineering Solutions
            </span>

            {/* Desktop CTA & Language Selection */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/25 hover:bg-current/10 transition-colors text-[13px] font-medium"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "en" ? "EN" : language === "gu" ? "GU" : "TE"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                </button>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                    <div className={`absolute right-0 top-full mt-2 w-32 rounded-xl shadow-xl p-1.5 z-50 border ${isDark ? 'bg-zinc-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}>
                      {(["en", "gu", "te"] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setLangOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-[13px] rounded-lg transition-colors hover:bg-current/10 ${
                            language === lang ? "font-semibold bg-current/5" : "font-normal"
                          }`}
                        >
                          {lang === "en" ? "English" : lang === "gu" ? "ગુજરાતી" : "తెలుగు"}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => { onViewChange("order"); window.scrollTo(0, 0); }}
                className="group inline-flex items-center gap-2 bg-black text-white rounded-full font-display font-medium text-[13px] pl-1.5 pr-4 py-1 hover:bg-neutral-800 transition-colors duration-300"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white transition-all duration-500 ease-out group-hover:scale-110">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-180">
                    <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="black"/>
                  </svg>
                </span>
                {t("talk_to_us")}
              </button>
            </div>
          </div>

          {/* Desktop links — absolutely centered in the nav */}
          <ul
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center font-display font-medium z-50"
            style={{
              gap: "clamp(12px, 1.5vw, 24px)",
              fontSize: "clamp(13px, 1vw, 15px)"
            }}
          >
            {navItems.map((item) => (
              <li key={item.view}>
                <button
                  onClick={() => { handleItemClick(item.view); }}
                  className={`relative hover:opacity-60 transition-opacity py-1 cursor-pointer ${
                    currentView === item.view ? "text-black font-semibold border-b border-black pb-0.5" : ""
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            {/* Others dropdown */}
            <li 
              className="relative text-current py-1 cursor-pointer"
              onMouseEnter={() => setOthersOpen(true)}
              onMouseLeave={() => setOthersOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:opacity-60 transition-opacity cursor-pointer"
              >
                {t("others")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7.41 8.58L12 13.17L16.59 8.58L18 10L12 16L6 10L7.41 8.58Z" fill="currentColor"/>
                </svg>
              </button>
              {othersOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white border border-black/10 rounded-xl shadow-lg p-2 text-black"
                >
                  {[
                    { key: "blog", label: t("blog") },
                    { key: "resources", label: t("resources") },
                    { key: "sustainability", label: t("sustainability") }
                  ].map(sub => (
                    <button
                      key={sub.key}
                      onClick={() => {
                        handleItemClick(sub.key as any);
                        setOthersOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-1.5 px-5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-current transition-transform duration-300 ${mobileMenuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block w-5 h-px bg-current transition-transform duration-300 ${mobileMenuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-black text-white flex flex-col pt-20 px-6 font-display overflow-y-auto">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-around border-b border-white/10 pb-4 mb-2">
            {(["en", "gu", "te"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-full border text-[14px] font-medium transition-all ${
                  language === lang 
                    ? "bg-black border-black text-white" 
                    : "border-white/20 text-white/60 hover:text-white"
                }`}
              >
                {lang === "en" ? "English" : lang === "gu" ? "ગુજરાતી" : "తెలుగు"}
              </button>
            ))}
          </div>

          <ul className="flex flex-col gap-0 text-2xl font-medium">
            {[
              { label: t("home"), view: "home" as const },
              { label: t("order"), view: "order" as const },
              { label: t("products"), view: "products" as const },
              { label: t("about_us"), view: "about" as const }
            ].map(item => (
              <li key={item.view}>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleItemClick(item.view); }}
                  className="w-full text-left py-5 border-b border-white/10 hover:opacity-60 transition-opacity"
                >
                  {item.label}
                </button>
              </li>
            ))}
            {/* Others mobile toggle */}
            <li>
              <button
                onClick={() => setMobileOthersOpen(!mobileOthersOpen)}
                className="w-full text-left py-5 border-b border-white/10 flex items-center justify-between hover:opacity-60 transition-opacity"
              >
                <span>{t("others")}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform duration-200 ${mobileOthersOpen ? "rotate-180" : ""}`}>
                  <path d="M7.41 8.58L12 13.17L16.59 8.58L18 10L12 16L6 10L7.41 8.58Z" fill="currentColor"/>
                </svg>
              </button>
              {mobileOthersOpen && (
                <div className="pl-6 bg-white/5 py-2 flex flex-col gap-4 border-b border-white/10">
                  {[
                    { key: "blog", label: t("blog") },
                    { key: "resources", label: t("resources") },
                    { key: "sustainability", label: t("sustainability") }
                  ].map(sub => (
                    <button
                      key={sub.key}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleItemClick(sub.key as any);
                      }}
                      className="w-full text-left py-2 text-lg text-white/75 hover:text-white"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </li>
          </ul>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onViewChange("order");
              window.scrollTo(0, 0);
            }}
            className="mt-8 inline-flex items-center justify-center gap-3 bg-black text-white hover:bg-neutral-800 rounded-full py-4 font-medium text-base w-full shrink-0"
          >
            {t("talk_to_us")}
          </button>
        </div>
      )}
    </>
  );
}
