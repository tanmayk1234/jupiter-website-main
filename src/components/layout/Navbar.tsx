import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation, Language } from "../providers/LanguageContext";
import { PlusIcon } from "../ui/icons";
import GridLine from "../ui/GridLine";



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

  // The menu is a fixed full-screen overlay; without this the page scrolls
  // underneath it and the visitor returns to a different position than they left.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [mobileMenuOpen]);

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

  // Dynamic colors based on isDark. The mobile menu is a black full-screen
  // panel that starts below the bar, so while it is open the bar has to read as
  // dark too or it sits as a cream band across the top of the overlay.
  const onDark = isDark || mobileMenuOpen;
  const bgColor = onDark ? "#000000" : "#F5F5F0";
  const textColor = onDark ? "text-white" : "text-black";
  const borderColor = mobileMenuOpen ? "bg-transparent" : (isDark ? "bg-white" : "bg-black");

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ease-in-out ${textColor} overflow-visible`}
        style={{ backgroundColor: bgColor }}
      >
        {/* Horizontal bottom border — Left segment */}
        <div className={`md:hidden absolute bottom-0 left-0 right-0 h-[1.5px] transition-colors duration-300 ${borderColor}`} />

        <div
          className={`hidden md:block absolute bottom-0 left-0 h-[1.5px] transition-colors duration-300 ${borderColor}`}
          style={{
            width: "calc(max(1.5rem, min(5vw, 4rem)) - 24px)",
          }}
        />

        {/* Horizontal bottom border — Right segment */}
        <div
          className={`hidden md:block absolute bottom-0 right-0 h-[1.5px] transition-colors duration-300 ${borderColor}`}
          style={{
            left: "calc(max(1.5rem, min(5vw, 4rem)) + 24px)",
          }}
        />

        {/* Top vertical border segment above the logo */}
        <div
          className={`hidden md:block absolute top-0 w-[1.5px] transition-colors duration-300 ${borderColor}`}
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
              filter: isDark ? "invert(1)" : "none",
              transition: "filter 300ms",
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
          <div className="flex-1 relative flex items-center px-6">
            {/* Mobile brand. The gear mark below and the wordmark beside it are
                both hidden md:block, so the phone navbar carried no branding at
                all — an empty bar with a burger in it. Tapping returns home,
                which is what people expect of a masthead. */}
            <button
              onClick={() => handleItemClick("home")}
              aria-label="Jupiter Engineering Solutions, go to home"
              className="md:hidden flex items-center gap-2 min-w-0 mr-2"
            >
              <img
                src="/jupiter-logo.png"
                alt=""
                className="w-7 h-7 object-contain shrink-0 transition-[filter] duration-300"
                style={{ filter: onDark ? "invert(1)" : "none" }}
              />
              <span className="font-friz font-medium tracking-[0.06em] text-[13px] leading-tight text-left truncate">
                Jupiter Engineering Solutions
              </span>
            </button>

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
                  <PlusIcon size={10} className="text-black transition-transform duration-500 ease-out group-hover:rotate-180" />
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
            className="md:hidden flex flex-col items-center justify-center gap-1.5 px-6"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {/* One transform rather than Tailwind's separate translate/rotate
                utilities: those compile to the standalone `translate` and
                `rotate` properties, which transition-transform does not drive,
                and the open state came out as a shallow chevron instead of an X.
                gap-1.5 puts the bars 3.5px either side of centre. */}
            <span
              className="block w-5 h-px bg-current transition-transform duration-300"
              style={{ transform: mobileMenuOpen ? "translateY(3.5px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-px bg-current transition-transform duration-300"
              style={{ transform: mobileMenuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-black text-white flex flex-col pt-20 px-6 pb-10 font-display overflow-y-auto">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-around max-md:justify-between border-b border-white/10 pb-4 mb-2">
            {(["en", "gu", "te"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 min-h-[44px] inline-flex items-center justify-center rounded-full border text-[14px] font-medium transition-all ${
                  language === lang 
                    ? "bg-white border-white text-black" 
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
            className="mt-8 inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 rounded-full py-4 font-medium text-base w-full shrink-0"
          >
            {t("talk_to_us")}
          </button>
        </div>
      )}
    </>
  );
}
