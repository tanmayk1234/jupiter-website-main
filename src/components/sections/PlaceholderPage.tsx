import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "../providers/LanguageContext";

interface PlaceholderPageProps {
  type: "blog" | "resources";
}

export default function PlaceholderPage({ type }: PlaceholderPageProps) {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, [type]);

  const getContent = () => {
    switch (type) {
      case "blog":
        return {
          titleMain: "Insights & ",
          titleItalic: "Engineering",
          sub: "Technical articles, industry standards, and guides on heat transfer efficiency.",
          items: [
            {
              tag: "Case Study",
              title: "Optimizing Thermal Performance in Tube & Shell Exchangers",
              desc: "How HTRI calculations and baffle design spacing minimized pressure drops in critical process plants.",
              date: "June 2026"
            },
            {
              tag: "Materials",
              title: "Corrosion Resistance: Graphite vs. Hastelloy Alloys",
              desc: "A comparative review of materials under highly acidic conditions, including HCl and sulfuric acid processing.",
              date: "May 2026"
            },
            {
              tag: "Compliance",
              title: "Understanding ASME & TEMA Standards",
              desc: "Key considerations for thermal design engineers when manufacturing pressure vessels for global chemical plants.",
              date: "April 2026"
            }
          ]
        };
      case "resources":
        return {
          titleMain: "Knowledge & ",
          titleItalic: "Resources",
          sub: "Download calculators, engineering catalogs, and design guides for your processing systems.",
          items: [
            {
              tag: "PDF Guide",
              title: "HTRI Calculation Parameters Checklist",
              desc: "A comprehensive reference sheet for defining hot and cold side temperatures, flow rates, and material limits.",
              date: "Download (2.4 MB)"
            },
            {
              tag: "Chemical Chart",
              title: "Graphite Chemical Compatibility Catalog",
              desc: "Detailed chart listing acid concentrations and operating temperature bounds for graphite exchangers.",
              date: "Download (1.8 MB)"
            },
            {
              tag: "Manual",
              title: "Operations & Maintenance Handbook",
              desc: "Standard operating procedures for commissioning, re-tubing, and cleaning heat transfer systems.",
              date: "Download (4.1 MB)"
            }
          ]
        };
    }
  };

  const content = getContent();

  return (
    <div ref={pageRef} className="bg-[#F5F5F0] text-black min-h-screen pt-32 pb-24 px-6 md:px-[max(1.5rem,min(5vw,4rem))] font-display">
      {/* Global vertical border line on desktop */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="max-w-[1100px] mx-auto md:pl-16 relative z-10">
        {/* Header */}
        <div className="mb-16 max-w-[800px]">
          <h1 className="font-medium text-[clamp(2.5rem,5.5vw,6rem)] leading-[0.98] tracking-[-0.04em] mb-8">
            {content.titleMain}
            <br />
            <em className="font-accent font-normal tracking-normal italic">{content.titleItalic}</em>
          </h1>
          <p className="text-black/60 text-[clamp(15px,1.2vw,18px)] leading-[1.6]">
            {content.sub}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px]">
          {content.items.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/10 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <span className="self-start text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 bg-black/5 rounded-md text-black/60">
                  {item.tag}
                </span>
                <h3 className="font-semibold text-lg leading-snug tracking-tight text-black">
                  {item.title}
                </h3>
                <p className="text-[14px] text-black/60 leading-[1.6]">
                  {item.desc}
                </p>
              </div>
              <div className="border-t border-black/5 pt-4 mt-6 flex justify-between items-center">
                <span className="text-[12px] font-semibold text-[#0028FF]">{item.date}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#0028FF]">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
