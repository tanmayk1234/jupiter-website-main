import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SplitText from "../ui/SplitText";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import type { DotLottieCommonPlayer } from "@dotlottie/react-player";
import { useTranslation } from "../providers/LanguageContext";
import { PlusIcon } from "../ui/icons";

// WGB icon-button component
function WGBButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-3 rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl bg-black text-white hover:bg-neutral-800"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-out bg-white group-hover:scale-110">
        <PlusIcon className="text-black transition-transform duration-500 ease-out group-hover:rotate-180" />
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
  const mobileFormRef   = useRef<HTMLDivElement>(null);

  const preloaderPlayerRef = useRef<DotLottieCommonPlayer>(null);
  const loopPlayerRef      = useRef<DotLottieCommonPlayer>(null);
  const mobilePlayerRef    = useRef<DotLottieCommonPlayer>(null);
  const mobileFormPlayerRef = useRef<DotLottieCommonPlayer>(null);

  const vLineRef      = useRef<HTMLDivElement>(null);
  const hLineRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    setTimeout(() => {
      preloaderPlayerRef.current?.play();
      mobileFormPlayerRef.current?.play();
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
    if (mobileFormRef.current) {
      gsap.fromTo(mobileFormRef.current, { opacity: 0 }, { opacity: 0.55, duration: 2, delay: 1.5, ease: "power2.inOut" });
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
      className="relative min-h-svh pt-20 px-6 md:px-[max(1.5rem,min(5vw,4rem))] flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      {/* Left vertical border — starts exactly below the logo and runs full height */}
      <div ref={vLineRef} className="hidden md:block absolute bottom-0 w-[1.5px] bg-black z-20 pointer-events-none opacity-0" style={{ left: "max(1.5rem, min(5vw, 4rem))", top: "88px" }} />

      {/* Background Lottie */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 scale-[1.1] md:scale-[1.15] max-md:scale-[1.35] translate-x-0 md:translate-x-[5%] max-md:translate-x-[-5%] translate-y-[-5%] md:translate-y-[-2%] max-md:translate-y-[-22%]">
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
        {/* Mobile runs the same two stages desktop does — the orbit draws
            itself in, then hands over to the loop — from copies of the same two
            files with the previous agency's labels stripped out. Before this the
            phone only ever got the loop, so the orbit was simply there, already
            formed, and the motion that builds it was never seen. */}
        <div className="block md:hidden w-full h-full">
          <div ref={mobileFormRef} className="absolute inset-0 w-full h-full opacity-0">
            <DotLottiePlayer
              ref={mobileFormPlayerRef}
              src="/assets/lottie/mobile-orbit-form.lottie"
              autoplay={false}
              loop={false}
              rendererSettings={{ glyphs: false }}
              onEvent={(event) => {
                if (event === PlayerEvents.Complete) {
                  mobilePlayerRef.current?.stop();
                  mobilePlayerRef.current?.play();
                  gsap.to(mobileLottieRef.current, { opacity: 0.55, duration: 1.8, ease: "power2.inOut" });
                  gsap.to(mobileFormRef.current, { opacity: 0, duration: 1.6, delay: 0.4, ease: "power2.inOut" });
                }
              }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div ref={mobileLottieRef} className="absolute inset-0 w-full h-full opacity-0">
            <DotLottiePlayer
              ref={mobilePlayerRef}
              src="/assets/lottie/mobile-orbit-loop.lottie"
              autoplay={false}
              loop
              rendererSettings={{ glyphs: false }}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }}
            />
          </div>
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
            className="hero-headline font-display font-medium text-[clamp(2.25rem,5.8vw,8rem)] leading-[0.92] tracking-[-0.04em] m-0 text-black mb-8"
            text={
              <>
                {t("hero_headline_1")}<br />{t("hero_headline_2")}<br /><em className="font-accent font-normal tracking-normal">{t("hero_headline_3")}</em>
              </>
            }
          />
        </div>

        {/* Subtext + buttons */}
        <div className="flex flex-col gap-6">
          <p ref={subtextRef} className="opacity-0 font-display text-black/60 text-[clamp(15px,1.2vw,18px)] max-w-[55ch]">
            {t("hero_subtext")}
          </p>
          <div ref={btnsRef} className="flex flex-wrap items-center gap-3">
            <span className="opacity-0">
              <WGBButton label={t("hero_cta")} onClick={() => { onViewChange?.("order"); window.scrollTo(0, 0); }} />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom border removed per user request */}
    </section>
  );
}
