import React, { useEffect, useRef, useState } from "react";
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
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-colors duration-500 ${lottieReady ? 'bg-transparent' : 'bg-[#050505]'} pointer-events-none`}
    >
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        {/* We use 150vw to ensure the lottie animation drawing covers the screen just like the main website */}
        <div className="w-[150vw] h-[150vh] flex items-center justify-center">
          <DotLottiePlayer
            src="https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/6996e894cc60581e3809b70b_5e1623f61e8588ecd8933bab16c4e6c5_Comp%201.lottie"
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
                document.body.style.overflow = '';
                gsap.to(containerRef.current, {
                  opacity: 0,
                  duration: 0.5,
                  onComplete: () => {
                    if(containerRef.current) containerRef.current.style.display = 'none';
                    onCompleteRef.current();
                  }
                });
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
