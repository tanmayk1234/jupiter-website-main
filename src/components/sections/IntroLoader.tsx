import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DotLottiePlayer, PlayerEvents } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";

const IntroLoader = React.memo(function IntroLoader({ onHeroStart, onComplete }: { onHeroStart: () => void, onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  // The artwork stops drawing its own black backdrop at frame 216 of the 245 it
  // plays, and spends its last second drawing black lines meant to be seen over
  // a light page. Until then the overlay has to be opaque or the site shows
  // through around the letterboxed artwork; from then on it has to be see-through
  // or that last second is black on black.
  const [revealed, setRevealed] = useState(false);
  // Read once: the intro is over in under four seconds, so a rotation mid-play
  // is not worth re-rendering the player for.
  const [isPortrait] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
  
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
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${revealed ? "bg-transparent" : "bg-black"} pointer-events-none`}
    >
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        {/* The artwork is 1920x1080. Fitted to a phone that is a 390x219 strip
            and its line of copy renders about five pixels tall, so below md it is
            scaled to 175vw — the widest it goes before that line runs off the
            screen. shrink-0 is what makes the width stick: this is a flex item,
            and without it the box is shrunk back to the viewport. Desktop keeps
            the shrinking it has always had; its framing is not the problem. */}
        <div className={isPortrait ? "w-[175vw] shrink-0 h-full" : "w-[150vw] h-[150vh] flex items-center justify-center"}>
          <DotLottiePlayer
            src="/assets/lottie/intro-comp.lottie"
            autoplay={true}
            loop={false}
            onEvent={(event) => {
              if (event === PlayerEvents.Play) {
                // Frame 216 at 30fps. Switching a shade late is harmless (the
                // artwork is drawing on black either way); switching early would
                // show the page through the backdrop while it is still up.
                setTimeout(() => setRevealed(true), 3000);
                // Hero's headline waits 2.6s after this fires, so this is set so
                // that it starts exactly as the backdrop lifts. Left at 2s the
                // headline began at 4.6s and the intro spent its last second and
                // a half revealing an empty page — the "white screen".
                setTimeout(() => {
                  onHeroStartRef.current();
                }, 400);
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
