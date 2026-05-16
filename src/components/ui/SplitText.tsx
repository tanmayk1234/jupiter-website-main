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
}) {
  const textRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!textRef.current || !startTrigger) return;
    
    // Split text into words (and optionally lines) before it is painted
    const split = new SplitType(textRef.current, { types: types });
    
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
  }, [startTrigger, delay]);

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
