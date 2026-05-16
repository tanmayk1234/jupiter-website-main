import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const panels = [
  {
    id: "intro",
    dot: null,
    heading: <>Guiding your <em className="font-accent font-normal tracking-normal">growth</em> beyond the known using our Trust Engine</>,
    body: "The Trust Engine replaces the chaos of isolated marketing tactics with a holistic system of Content, Ads, and Outreach, earning you the trust of your ideal clients long before you ever make the sale.",
  },
  {
    id: "content",
    dot: "content",
    heading: <>Founder&#8209;Led <em className="font-accent font-normal tracking-normal">Content</em></>,
    body: "We tell your unique story and turn your expertise into content that is worth sharing. This engineers trust at scale, positioning you as a liked and respected authority long before the first contact.",
  },
  {
    id: "ads",
    dot: "ads",
    heading: <>Account&#8209;Based Marketing <em className="font-accent font-normal tracking-normal">Ads</em></>,
    body: "Stop leaving your growth to the luck of an algorithm. We use Account-Based Marketing to guarantee your best content actually reaches your dream clients, keeping you top-of-mind.",
  },
  {
    id: "outreach",
    dot: "outreach",
    heading: <><em className="font-accent font-normal tracking-normal">Outreach</em> based on real data signals</>,
    body: "We replace generic cold mails with precise and natural outreach based on real data signals. Because the prospect already knows and trusts your brand, the conversation is warm from the start.",
  },
];

// Decorative + marks scattered in the black bg
const plusMarks = [
  { top: "8%",  left: "5%"  }, { top: "20%", left: "78%" },
  { top: "35%", left: "52%" }, { top: "55%", left: "12%" },
  { top: "68%", left: "88%" }, { top: "80%", left: "35%" },
  { top: "12%", left: "92%" }, { top: "45%", left: "96%" },
];

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

// The Trust Engine orbital SVG — 3 rings with labelled dots
function TrustOrbital({ activeDot }: { activeDot: string | null }) {
  const isActive = (dot: string) => activeDot === dot;

  const ringStroke = (dot: string) =>
    isActive(dot) ? "#0028FF" : "rgba(255,255,255,0.3)";

  const dotFill = (dot: string) =>
    isActive(dot) ? "#0028FF" : "rgba(255,255,255,0.4)";

  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" style={{ overflow: "visible" }}>
      {/* Center star */}
      <path
        d="M200 188 L202 196 L210 198 L202 200 L200 208 L198 200 L190 198 L198 196 Z"
        fill="white"
        opacity={0.9}
      />

      {/* Ring 1 — outermost (Outreach) */}
      <path
        d="M 20 200 a 180 60 0 1 0 360 0 a 180 60 0 1 0 -360 0"
        transform="rotate(-30 200 200)"
        fill="none"
        stroke={ringStroke("outreach")}
        strokeWidth="1"
        style={{ transition: "stroke 0.5s" }}
      />

      {/* Ring 2 — middle (Ads) */}
      <path
        d="M 60 200 a 140 46 0 1 0 280 0 a 140 46 0 1 0 -280 0"
        transform="rotate(20 200 200)"
        fill="none"
        stroke={ringStroke("ads")}
        strokeWidth="1"
        style={{ transition: "stroke 0.5s" }}
      />

      {/* Ring 3 — innermost (Content) */}
      <path
        d="M 90 200 a 110 36 0 1 0 220 0 a 110 36 0 1 0 -220 0"
        transform="rotate(70 200 200)"
        fill="none"
        stroke={ringStroke("content")}
        strokeWidth="1"
        style={{ transition: "stroke 0.5s" }}
      />

      {/* Outreach dot — top of outer ring */}
      <g transform="translate(200, 40)" style={{ transition: "all 0.5s" }}>
        <circle r={isActive("outreach") ? 7 : 4} fill={dotFill("outreach")} style={{ transition: "all 0.5s" }} />
        {isActive("outreach") && (
          <circle r="12" fill="none" stroke="#0028FF" strokeWidth="1" opacity="0.5" />
        )}
        <text x="14" y="5" fill="white" fontSize="12" fontFamily="Switzer, sans-serif" opacity="0.7">Outreach</text>
      </g>

      {/* Ads dot — right of middle ring */}
      <g transform="translate(338, 215)" style={{ transition: "all 0.5s" }}>
        <circle r={isActive("ads") ? 7 : 4} fill={dotFill("ads")} style={{ transition: "all 0.5s" }} />
        {isActive("ads") && (
          <circle r="12" fill="none" stroke="#0028FF" strokeWidth="1" opacity="0.5" />
        )}
        <text x="14" y="5" fill="white" fontSize="12" fontFamily="Switzer, sans-serif" opacity="0.7">Ads</text>
      </g>

      {/* Content dot — bottom-left of inner ring */}
      <g transform="translate(90, 310)" style={{ transition: "all 0.5s" }}>
        <circle r={isActive("content") ? 7 : 4} fill={dotFill("content")} style={{ transition: "all 0.5s" }} />
        {isActive("content") && (
          <circle r="12" fill="none" stroke="#0028FF" strokeWidth="1" opacity="0.5" />
        )}
        <text x="14" y="5" fill="white" fontSize="12" fontFamily="Switzer, sans-serif" opacity="0.7">Content</text>
      </g>
    </svg>
  );
}

export default function Services() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [activeDot, setActiveDot] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const triggers = [
        { id: "content",  dot: "content"  },
        { id: "ads",      dot: "ads"      },
        { id: "outreach", dot: "outreach" },
      ];
      triggers.forEach(({ id, dot }) => {
        const el = document.getElementById(`te-panel-${id}`);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onEnter:     () => setActiveDot(dot),
          onLeave:     () => setActiveDot(null),
          onEnterBack: () => setActiveDot(dot),
          onLeaveBack: () => setActiveDot(null),
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black text-white overflow-hidden section-dark">
      {/* Decorative plus marks */}
      {plusMarks.map((p, i) => (
        <span
          key={i}
          className="absolute text-white/5 text-xl select-none pointer-events-none"
          style={p}
        >+</span>
      ))}

      <div className="hidden md:block absolute top-0 bottom-0 left-[max(1.5rem,min(5vw,4rem))] w-px bg-white/40 z-20 pointer-events-none" />

      {/* Mobile: stacked layout */}
      <div className="md:hidden px-6 py-24 flex flex-col gap-16">
        {panels.map((p) => (
          <div key={p.id} className="flex flex-col gap-5">
            <h3 className="font-display font-medium text-[clamp(1.8rem,5vw,3rem)] leading-[1.05] tracking-[-0.03em]">
              {p.heading}
            </h3>
            <p className="font-display text-[15px] text-white/70 leading-[1.7]">{p.body}</p>
            <button className="self-start inline-flex items-center gap-2.5 border border-white/20 text-white rounded-full font-display font-medium text-[14px] pl-1.5 pr-5 py-1.5 hover:bg-white hover:text-black transition-colors duration-300">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
                <PlusIcon />
              </span>
              Discover our solutions
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: sticky orbital on right, scroll panels on left */}
      <div className="hidden md:flex min-h-screen">
        {/* Left — scroll panels */}
        <div className="flex-1 flex flex-col px-[max(1.5rem,min(5vw,4rem))] pl-[calc(max(1.5rem,min(5vw,4rem))+2rem)]">
          {panels.map((p) => (
            <div
              key={p.id}
              id={`te-panel-${p.id}`}
              className="min-h-screen flex flex-col justify-center py-24 max-w-[520px]"
            >
              <h3 className="font-display font-medium text-[clamp(2rem,3.5vw,4rem)] leading-[1.05] tracking-[-0.03em] mb-6">
                {p.heading}
              </h3>
              <p className="font-display text-[16px] text-white/70 leading-[1.7] mb-8 max-w-[48ch]">
                {p.body}
              </p>
              <button className="self-start inline-flex items-center gap-2.5 border border-white/20 text-white rounded-full font-display font-medium text-[14px] pl-1.5 pr-5 py-1.5 hover:bg-white hover:text-black transition-colors duration-300">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
                  <PlusIcon />
                </span>
                Discover our solutions
              </button>
            </div>
          ))}
        </div>

        {/* Right — sticky orbital */}
        <div className="w-[45%] shrink-0 sticky top-0 h-screen flex items-center justify-center p-12">
          <div className="w-full max-w-[420px] aspect-square">
            <TrustOrbital activeDot={activeDot} />
          </div>
        </div>
      </div>
    </section>
  );
}
