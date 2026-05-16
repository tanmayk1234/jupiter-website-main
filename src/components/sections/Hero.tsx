import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "../ui/SplitText";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import type { DotLottieCommonPlayer } from "@dotlottie/react-player";

// WGB icon-button component
function WGBButton({ label, variant, onClick }: { label: string; variant: "dark" | "blue" | "mono"; onClick?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={btnRef}
      onClick={onClick}
      className={`group inline-flex items-center gap-3 rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl ${
        variant === "dark"
          ? "bg-black text-white hover:bg-[#0028FF]"
          : variant === "blue"
          ? "bg-[#0028FF] text-white hover:bg-black"
          : "bg-black text-white hover:bg-neutral-800"
      }`}
    >
      <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ease-out ${
        variant === "dark" ? "bg-[#0028FF] group-hover:bg-black" 
        : variant === "blue" ? "bg-black group-hover:bg-[#0028FF]"
        : "bg-white group-hover:scale-110"
      }`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-180">
          <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill={variant === "mono" ? "black" : "white"}/>
        </svg>
      </span>
      {label}
    </button>
  );
}

export default function Hero({ isLoaded }: { isLoaded: boolean }) {
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
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen pt-20 px-6 md:px-[max(1.5rem,min(5vw,4rem))] flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      {/* Left vertical border — runs full height, solid gear pixels cover the line at intersection */}
      <div ref={vLineRef} className="hidden md:block absolute top-0 bottom-0 left-[max(1.5rem,min(5vw,4rem))] w-px bg-black z-20 pointer-events-none opacity-0" />

      {/* Background Lottie */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 scale-[1.1] md:scale-[1.15] translate-x-0 md:translate-x-[5%] translate-y-[-5%] md:translate-y-[-2%]">
        <div className="hidden md:block w-full h-full">
          <div ref={introLottieRef} className="absolute inset-0 w-full h-full">
            <DotLottiePlayer
              ref={preloaderPlayerRef}
              src="https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b0fa481c63dd41c659b_WGB_Preloader_Orbit_Blueflow.lottie"
              autoplay={false}
              loop={false}
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
              src="https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/6996eb2c7a740eb6e1debd8b_69b8f67476355b80033ea66492e38130_cirkels%202.lottie"
              autoplay={false}
              loop
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div ref={mobileLottieRef} className="block md:hidden w-full h-full opacity-0">
          <DotLottiePlayer
            ref={mobilePlayerRef}
            src="https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b6ade2cd438e9b11a95_WGB_Loop_Zwart_Transparant_1000x1000.lottie"
            autoplay={false}
            loop
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1100px]">
        {/* Headline */}
        <div>
          <SplitText
            startTrigger={isLoaded}
            delay={2.6}
            className="font-display font-medium text-[clamp(3rem,5.8vw,8rem)] leading-[0.98] tracking-[-0.04em] m-0 text-black mb-8"
            text={
              <>
                The Future Leader<br /> In All Things<br /> <em className="font-accent font-normal tracking-normal">Graphite</em>
              </>
            }
          />
        </div>

        {/* Subtext + buttons — indented ~88px on desktop to match WGB layout */}
        <div className="flex items-start gap-0">
          <div className="hidden md:block shrink-0" style={{ width: "clamp(0px, 5.5vw, 88px)" }} />
          <div className="flex flex-col gap-6">
            <p ref={subtextRef} className="opacity-0 font-display text-black/60 text-[clamp(13px,1vw,16px)] max-w-[55ch]">
              Fabrication, engineering, and manufacturing of process equipment for critical industrial applications. We rely on expertise to optimize your processes for the best possible outcomes.
            </p>
            <div ref={btnsRef} className="flex flex-wrap items-center gap-3">
              <span className="opacity-0">
                <WGBButton label="Request a Technical Consultation" variant="mono" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border removed per user request */}
    </section>
  );
}
