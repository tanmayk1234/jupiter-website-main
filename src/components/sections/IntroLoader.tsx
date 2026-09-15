import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

const IntroLoader = React.memo(function IntroLoader({ onHeroStart, onComplete }: { onHeroStart: () => void, onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lottieReady, setLottieReady] = useState(false);
  
  // Keep stable references
  const onHeroStartRef = useRef(onHeroStart);
  useEffect(() => {
    onHeroStartRef.current = onHeroStart;
  }, [onHeroStart]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Lock scroll immediately on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Tearing down the overlay is idempotent — the lottie's Complete event, a
  // playback error and the safety timeout below can all reach it, and only the
  // first one should run.
  const finishedRef = useRef(false);
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.body.style.overflow = '';
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none';
        onCompleteRef.current();
      }
    });
  }, []);

  // Without this the overlay is a trap: it sits at z-[9999] over the entire site
  // and only ever unmounts when the lottie reports Complete. If that event never
  // arrives — a stalled download on mobile data, a decode failure, a blocked
  // autoplay — the visitor is left staring at a covered page with no way out.
  // The animation runs 3.9s, so in any normal load it finishes long before this.
  useEffect(() => {
    const bail = setTimeout(finish, 12000);
    return () => clearTimeout(bail);
  }, [finish]);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-colors duration-500 ${lottieReady ? 'bg-[#050505] md:bg-transparent' : 'bg-[#050505]'} pointer-events-none`}
    >
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        {/* We use 150vw to ensure the lottie animation drawing covers the screen just like the main website */}
        <div className="w-[150vw] h-[150vh] flex items-center justify-center">
          <DotLottiePlayer
            src="/assets/lottie/intro-comp.lottie"
            autoplay={true}
            loop={false}
            onEvent={(event) => {
              if (event === PlayerEvents.Ready) {
                setLottieReady(true);
              }
              if (event === PlayerEvents.Play) {
                setTimeout(() => {
                  onHeroStartRef.current();
                }, 2000); // 2s after start
              }
              if (event === PlayerEvents.Complete) {
                finish();
              }
              // A lottie that fails to load or decode never plays and never
              // completes, so let the site through rather than holding it behind
              // an animation that is not coming.
              if (event === PlayerEvents.Error || event === PlayerEvents.DataFail) {
                finish();
              }
            }}
            className="w-full h-full"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
});

export default IntroLoader;
