import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

// Use useLayoutEffect consistently, fallback to useEffect safely for SSR if needed
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function SplitText({
  text,
  className,
  delay = 0,
  startTrigger,
  types = "words",
}: {
  text: React.ReactNode; 
  className?: string;
  delay?: number;
  startTrigger?: boolean;
  types?: string;
  key?: React.Key;
}) {
  const textRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!textRef.current || !startTrigger) return;
    
    // Split text into words (and optionally lines) before it is painted
    const split = new SplitType(textRef.current, { types: types as any });
    
    // SplitType sets inline styles on .word elements that can override CSS line-height.
    // Force tight line-height directly so headline lines stack closely.
    split.words?.forEach(w => { w.style.lineHeight = '0.92'; });

    // Hide all words initially so they don't flash
    gsap.set(split.words, { opacity: 0 });
    
    gsap.fromTo(split.words, 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        delay: delay
      }
    );

    return () => {
      split.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTrigger]);

  return (
    <div 
      ref={textRef} 
      className={className} 
      style={{ opacity: typeof startTrigger !== 'undefined' && !startTrigger ? 0 : 1 }}
    >
      {text}
    </div>
  );
}
