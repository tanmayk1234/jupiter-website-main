import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "../ui/SplitText";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import type { DotLottieCommonPlayer } from "@dotlottie/react-player";
import { useTranslation } from "../providers/LanguageContext";

// WGB icon-button component
function WGBButton({ label, variant, onClick }: { label: string; variant: "dark" | "blue" | "mono"; onClick?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl bg-black text-white hover:bg-neutral-800"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-out bg-white group-hover:scale-110">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-180">
          <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="black"/>
        </svg>
      </span>
      {label}
    </button>
  );
}

export default function Hero({ isLoaded, onViewChange }: { isLoaded: boolean; onViewChange?: (view: "home" | "order" | "about" | "blog" | "resources" | "sustainability") => void }) {
  const { language, t } = useTranslation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef  = useRef<HTMLElement>(null);
  const subtextRef    = useRef<HTMLParagraphElement>(null);
  const btnsRef       = useRef<HTMLDivElement>(null);
  const introLottieRef = useRef<HTMLDivElement>(null);
  const loopLottieRef  = useRef<HTMLDivElement>(null);
  const mobileLottieRef = useRef<HTMLDivElement>(null);

  const preloaderPlayerRef = useRef<DotLottieCommonPlayer>(null);
  const loopPlayerRef      = useRef<DotLottieCommonPlayer>(null);
  const mobilePlayerRef    = useRef<DotLottieCommonPlayer>(null);

  const vLineRef      = useRef<HTMLDivElement>(null);
  const hLineRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    setTimeout(() => {
      preloaderPlayerRef.current?.play();
      mobilePlayerRef.current?.play();
      // loop player is intentionally NOT started here —
      // it starts from frame 0 only when the preloader completes (see onEvent below)
    }, 1200);

    gsap.fromTo(subtextRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 3.0, ease: "power3.out" });
    if (btnsRef.current) {
      gsap.fromTo(btnsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 3.4, stagger: 0.1, ease: "power3.out" }
      );
    }
    if (mobileLottieRef.current) {
      gsap.fromTo(mobileLottieRef.current, { opacity: 0 }, { opacity: 1, duration: 2, delay: 1.5, ease: "power2.inOut" });
    }
    // Fade in the grid lines after the circle finishes drawing
    if (vLineRef.current) {
      gsap.fromTo(vLineRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5, delay: 3.2, ease: "power2.out" }
      );
    }

    // Set hasAnimated to true after the entrance animations complete so subsequent language switches render text immediately
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 3800);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-20 px-6 md:px-[max(1.5rem,min(5vw,4rem))] flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      {/* Left vertical border — starts exactly below the logo and runs full height */}
      <div ref={vLineRef} className="hidden md:block absolute bottom-0 w-px bg-black z-20 pointer-events-none opacity-0" style={{ left: "max(1.5rem, min(5vw, 4rem))", top: "88px" }} />

      {/* Background Lottie */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 scale-[1.1] md:scale-[1.15] translate-x-0 md:translate-x-[5%] translate-y-[-5%] md:translate-y-[-2%]">
        <div className="hidden md:block w-full h-full">
          <div ref={introLottieRef} className="absolute inset-0 w-full h-full">
            <DotLottiePlayer
              ref={preloaderPlayerRef}
              src="/assets/lottie/preloader-orbit.lottie"
              autoplay={false}
              loop={false}
              rendererSettings={{ glyphs: false }}
              onEvent={(event) => {
                if (event === PlayerEvents.Complete) {
                  // Reset loop to frame 0 and start it just as crossfade begins
                  loopPlayerRef.current?.stop();
                  loopPlayerRef.current?.play();
                  gsap.to(loopLottieRef.current, {
                    opacity: 1,
                    duration: 1.8,
                    ease: "power2.inOut",
                  });
                  gsap.to(introLottieRef.current, {
                    opacity: 0,
                    duration: 1.6,
                    delay: 0.4,
                    ease: "power2.inOut",
                  });
                }
              }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div ref={loopLottieRef} className="absolute inset-0 w-full h-full opacity-0">
            <DotLottiePlayer
              ref={loopPlayerRef}
              src="/assets/lottie/loop-circles.lottie"
              autoplay={false}
              loop
              rendererSettings={{ glyphs: false }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div ref={mobileLottieRef} className="block md:hidden w-full h-full opacity-0">
          <DotLottiePlayer
            ref={mobilePlayerRef}
            src="/assets/lottie/mobile-loop.lottie"
            autoplay={false}
            loop
            rendererSettings={{ glyphs: false }}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1100px] md:pl-10">
        {/* Headline */}
        <div>
          <SplitText
            key={language}
            startTrigger={isLoaded}
            delay={hasAnimated ? 0.05 : 2.6}
            className="hero-headline font-display font-medium text-[clamp(3rem,5.8vw,8rem)] leading-[0.92] tracking-[-0.04em] m-0 text-black mb-8"
            text={
              <>
                {t("hero_headline_1")}<br />{t("hero_headline_2")}<br /><em className="font-accent font-normal tracking-normal">{t("hero_headline_3")}</em>
              </>
            }
          />
        </div>

        {/* Subtext + buttons */}
        <div className="flex flex-col gap-6">
          <p ref={subtextRef} className="opacity-0 font-display text-black/60 text-[clamp(13px,1vw,16px)] max-w-[55ch]">
            {t("hero_subtext")}
          </p>
          <div ref={btnsRef} className="flex flex-wrap items-center gap-3">
            <span className="opacity-0">
              <WGBButton label={t("hero_cta")} variant="mono" onClick={() => { onViewChange?.("order"); window.scrollTo(0, 0); }} />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom border removed per user request */}
    </section>
  );
}
