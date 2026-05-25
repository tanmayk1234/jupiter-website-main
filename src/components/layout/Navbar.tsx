import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



const navLinks = [
  { label: "Manifesto", href: "#" },
  { label: "Services", href: "#" },
  { label: "Cases", href: "#" },
  { label: "About", href: "#" },
];

export default function Navbar({ onNavigate, isLoaded = true }: { onNavigate: () => void; isLoaded?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen]   = useState(false);
  const [isDark, setIsDark]                 = useState(false);
  const navRef = useRef<HTMLElement>(null);

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
        onEnter: () => setIsDark(true),
        onLeave: () => setIsDark(false),
        onEnterBack: () => setIsDark(true),
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

        <div className="flex items-stretch h-14 md:h-16">
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

            {/* Desktop links — absolutely centered in the nav */}
            <ul
              className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center font-display font-medium"
              style={{
                gap: "clamp(12px, 1.5vw, 24px)",
                fontSize: "clamp(13px, 1vw, 15px)"
              }}
            >
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={onNavigate}
                    className="relative hover:opacity-60 transition-opacity py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {/* Resources dropdown */}
              <li className="relative">
                <button
                  className="flex items-center gap-1 hover:opacity-60 transition-opacity"
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  Resources
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7.41 8.58L12 13.17L16.59 8.58L18 10L12 16L6 10L7.41 8.58Z" fill="currentColor"/>
                  </svg>
                </button>
                {resourcesOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-44 bg-white border border-black/10 rounded-xl shadow-lg p-2"
                    onMouseEnter={() => setResourcesOpen(true)}
                    onMouseLeave={() => setResourcesOpen(false)}
                  >
                    {["Blog", "Growth Assets"].map(item => (
                      <button
                        key={item}
                        onClick={onNavigate}
                        className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-black/5 rounded-lg transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            </ul>

            {/* Desktop CTA */}
            <div className="hidden md:block ml-auto">
              <button
                onClick={onNavigate}
                className="group inline-flex items-center gap-2.5 bg-[#0028FF] text-white rounded-full font-display font-medium text-[14px] px-5 py-2 hover:bg-black transition-colors duration-300"
              >
                Talk to us
              </button>
            </div>
          </div>

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
        <div className="fixed inset-0 z-[99] bg-black text-white flex flex-col pt-20 px-6 font-display">
          <ul className="flex flex-col gap-0 text-2xl font-medium">
            {[...navLinks, { label: "Resources", href: "#" }].map(link => (
              <li key={link.label}>
                <button
                  onClick={() => { setMobileMenuOpen(false); onNavigate(); }}
                  className="w-full text-left py-5 border-b border-white/10 hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate(); }}
            className="mt-8 inline-flex items-center justify-center gap-3 bg-[#0028FF] text-white rounded-full py-4 font-medium text-base w-full"
          >
            Talk to us
          </button>
        </div>
      )}
    </>
  );
}
