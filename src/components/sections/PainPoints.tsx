import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../providers/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

// WGB-style X / cross icon (used per problem card)
function CrossIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 34 40" fill="none">
      <path
        d="M11.2204 15.1658L5.39275 9.33808L2.68086 12.05L8.50855 17.8777C11.182 20.5511 11.182 24.8786 8.50855 27.552L2.68086 33.3797L5.39274 36.0916L11.2204 30.2639C13.8939 27.5905 18.2214 27.5905 20.8948 30.2639L26.7225 36.0916L29.4344 33.3797L23.6067 27.552C20.9333 24.8786 20.9333 20.5511 23.6067 17.8777L29.4344 12.05L26.7225 9.33808L20.8948 15.1658C18.2214 17.8392 13.8939 17.8392 11.2204 15.1658Z"
        fill="currentColor"
      />
    </svg>
  );
}

const problems = [
  {
    title: "Your sales pipeline depends on luck",
    body: "You rely entirely on referrals and sporadic inbound. When they dry up, you have no engineered mechanism to generate demand on your own terms.",
  },
  {
    title: "Your own marketing is the first thing you cut",
    body: "Client delivery consumes all your oxygen. Your company's growth strategy becomes a \"side project\" that lacks the consistency to generate real results.",
  },
  {
    title: "Your distinct value is lost in the noise",
    body: "You're visible, but not memorable. You haven't built the thought leadership or positioning needed to become the only choice for your dream client.",
  },
  {
    title: "You've tried content, ads, and outreach — but never in sync",
    body: "You tried these tactics in silos, and they failed to convert. Without a holistic system to integrate them, your efforts feel busy rather than strategic.",
  },
  {
    title: "You're unable to book the client meetings you actually want",
    body: "You know who your dream clients are, but you can't reach them. You lack the intent data and trust required to break through and start the conversation.",
  },
];

export default function PainPoints() {
  const { language, t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const localizedProblems = [
    {
      title: t("problem_1_title"),
      body: t("problem_1_body"),
    },
    {
      title: t("problem_2_title"),
      body: t("problem_2_body"),
    },
    {
      title: t("problem_3_title"),
      body: t("problem_3_body"),
    },
    {
      title: t("problem_4_title"),
      body: t("problem_4_body"),
    },
    {
      title: t("problem_5_title"),
      body: t("problem_5_body"),
    },
  ];

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      Array.from(gridRef.current!.children).forEach((item) => {
        gsap.fromTo(item as HTMLElement,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: item as HTMLElement, start: "top 88%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-[128px] px-6 md:px-[max(1.5rem,min(5vw,4rem))]" style={{ backgroundColor: "#F5F5F0" }}>
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="max-w-[1100px] mx-auto">
        {/* Headline */}
        <h2 className="font-display font-medium text-[clamp(2rem,4.5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-black max-w-[760px] mb-16">
          {language === "en" ? (
            <>
              Your processes are world&#8209;class. Your{" "}
              <em className="font-accent font-normal tracking-normal">thermal equipment</em>{" "}
              shouldn't hold you back.
            </>
          ) : language === "gu" ? (
            <>
              તમારી પ્રક્રિયાઓ વર્લ્ડ-ક્લાસ છે. તમારા{" "}
              <em className="font-accent font-normal tracking-normal">થર્મલ સાધનો</em>{" "}
              તેમાં અવરોધ ન બનવા જોઈએ.
            </>
          ) : (
            <>
              మీ ప్రక్రియలు ప్రపంచ స్థాయిలో ఉన్నాయి. మీ{" "}
              <em className="font-accent font-normal tracking-normal">థర్మల్ పరికరాలు</em>{" "}
              అవరోధం కాకూడదు.
            </>
          )}
        </h2>

        {/* 3-col grid on desktop, 1-col on mobile */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black border border-black rounded-2xl overflow-hidden">
          {localizedProblems.map((p, i) => (
            <div key={i} className="bg-[#F5F5F0] p-8 flex flex-col gap-5">
              <span className="text-[#FF5A00]">
                <CrossIcon />
              </span>
              <h3 className="font-display font-semibold text-[1.05rem] leading-[1.3] text-black">
                {p.title}
              </h3>
              <p className="font-display text-[14px] text-black/60 leading-[1.6]">
                {p.body}
              </p>
            </div>
          ))}

          {/* 6th card — premium dark CTA */}
          <div className="group/card bg-gradient-to-b from-[#141416] to-[#0A0A0B] p-8 flex flex-col justify-between gap-8 rounded-br-2xl border border-white/10 relative overflow-hidden hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out">
            {/* Soft glowing mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none z-0" />
            
            {/* Large elegant orbital paths in the background */}
            <div className="absolute -right-16 -top-16 w-52 h-52 opacity-[0.08] pointer-events-none z-0 group-hover/card:scale-105 group-hover/card:opacity-[0.12] transition-all duration-700 ease-out">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white">
                <ellipse cx="50" cy="50" rx="45" ry="18" stroke="currentColor" strokeWidth="0.8" transform="rotate(-25 50 50)" />
                <ellipse cx="50" cy="50" rx="35" ry="14" stroke="currentColor" strokeWidth="0.8" transform="rotate(20 50 50)" />
                <ellipse cx="50" cy="50" rx="22" ry="10" stroke="currentColor" strokeWidth="0.8" transform="rotate(70 50 50)" />
              </svg>
            </div>

            {/* Glowing brand spark motif */}
            <div className="w-10 h-10 text-white relative z-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl group-hover/card:bg-white/10 group-hover/card:border-white/20 transition-all duration-500 ease-out">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 animate-pulse">
                <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h3 className="font-display font-semibold text-[1.1rem] text-white/90 mb-6 leading-[1.3] max-w-[20ch]">
                {t("painpoints_cta_title")}
              </h3>
              <button className="group inline-flex items-center gap-3 bg-white text-black rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl hover:bg-neutral-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black transition-all duration-500 ease-out group-hover:scale-110">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-180">
                    <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="white"/>
                  </svg>
                </span>
                {t("painpoints_cta_btn")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border removed per user request */}
    </section>
  );
}
