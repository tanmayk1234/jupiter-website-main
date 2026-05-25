import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftCardRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(leftCardRef.current,
        { x: -40, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      gsap.fromTo(rightCardRef.current,
        { x: 40, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      gsap.fromTo(dividerRef.current,
        { opacity: 0, scaleY: 0 },
        { 
          opacity: 1, 
          scaleY: 1, 
          duration: 0.6, 
          delay: 0.4,
          ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-cream py-[128px] px-6 md:px-[max(1.5rem,min(5vw,4rem))]">
      {/* Vertical line left side */}
      <div className="hidden md:block absolute top-[0px] bottom-0 w-px bg-black/10 z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="max-w-[1200px] mx-auto flex flex-col items-center relative z-10">
        <span className="font-display font-medium text-[13px] text-grey uppercase tracking-[0.1em] mb-8">
          Why it works differently
        </span>
        <h2 className="font-display font-bold text-[clamp(2rem,4vw,4rem)] text-black mb-16 text-center">
          Tactics vs. The Trust Engine
        </h2>

        <div className="flex flex-col md:flex-row w-full items-stretch gap-6 md:gap-0">
          
          {/* Left Card */}
          <div ref={leftCardRef} className="flex-1 bg-pale-orange rounded-2xl p-8 md:p-10 z-10 md:-mr-6">
            <h3 className="font-display font-bold text-2xl text-black mb-8">Tactics</h3>
            <ul className="flex flex-col gap-4">
              {[
                "Random content posts with no strategy",
                "Ads running without audience context",
                "Cold outreach with no signal",
                "Each tactic working in isolation"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 pb-4 border-b border-black/5 last:border-0 font-display text-[16px] text-grey">
                  <span className="text-orange mt-0.5 opacity-80">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Center Divider Arrow */}
          <div ref={dividerRef} className="hidden md:block w-32 flex-shrink-0 bg-blue z-20 origin-top" style={{ clipPath: 'polygon(0 20%, 100% 0%, 100% 80%, 0% 100%)' }} />

          {/* Right Card */}
          <div ref={rightCardRef} className="flex-1 bg-pale-blue rounded-2xl p-8 md:p-10 z-10 md:-ml-6 pr-8 md:pl-20">
            <h3 className="font-display font-bold text-2xl text-blue mb-8">Trust Engine</h3>
            <ul className="flex flex-col gap-4">
              {[
                "Founder-led content that builds authority",
                "Ads retargeting warm LinkedIn audiences",
                "Outreach triggered by real buying signals",
                "All three working as a unified system"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 pb-4 border-b border-[#0028ff14] last:border-0 font-display text-[16px] text-black">
                  <span className="text-blue mt-0.5">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
