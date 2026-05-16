import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ triggerKey }: { triggerKey: number }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    
    // Only animate if it's not the initial mount
    if (triggerKey > 0) {
      gsap.fromTo(
        overlayRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.4, ease: "expo.inOut", onComplete: () => {
            gsap.to(overlayRef.current, { yPercent: -100, duration: 0.6, ease: "expo.inOut", delay: 0.2 });
        }}
      );
    }
  }, [triggerKey]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-blue z-[9990] pointer-events-none flex items-center justify-center translate-y-[100%]"
    >
      <div className="text-white text-4xl font-bold font-display">WGB</div>
    </div>
  );
}
