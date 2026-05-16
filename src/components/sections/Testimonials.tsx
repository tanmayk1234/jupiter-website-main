import { useRef } from "react";

function PlusIconSm() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

const testimonialsLeft = [
  {
    text: "I wanted to position Service Factory as a strategic partner - not just a service provider. LinkedIn has helped me communicate exactly that and generate new business in a targeted way. The response from the industry tells me we are on the right track.",
  },
  {
    name: "Guido Thiemann",
    title: "Managing Director Pushfire",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Niklas and his team have a deep understanding of how communication works. They extract my knowledge and turn it into a system that delivers real business results.",
  },
  {
    name: "Florian Litterst",
    title: "Founder adsventure",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    text: "Our LinkedIn content funnel has already made a massive impact. For one of our biggest deals, we had a 5-month sales cycle - and throughout that entire time, we were consistently putting content in front of them.",
  },
];

const testimonialsRight = [
  {
    text: "Today I make nearly 100% of my revenue with LinkedIn and proven through my posts.",
  },
  {
    name: "Christian",
    title: "CEO",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    text: "They don't just execute, they think strategically about our entire funnel. We saw a 3x increase in qualified meetings in just 90 days.",
  },
  {
    name: "Daniel Bidmon",
    title: "Co-Founder & CEO",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    text: "WGB helped us go from 0 to a pipeline we actually trust. The LinkedIn content built real authority.",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative h-[800px] md:h-[85vh] min-h-[600px] max-h-[1000px] overflow-hidden" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Global Vertical line */}
      <div className="hidden md:block absolute top-0 bottom-0 left-[max(1.5rem,min(5vw,4rem))] w-px bg-black z-20 pointer-events-none" />

      {/* Top horizontal border to seamlessly connect with previous dark section */}
      <div className="hidden md:block absolute top-0 left-[max(1.5rem,min(5vw,4rem))] right-0 h-px bg-black z-20 pointer-events-none" />

      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] px-6 md:px-16 flex flex-col md:flex-row gap-16 md:gap-12 items-center md:items-stretch relative h-full max-w-[1400px] mx-auto py-12 md:py-0">
        
        {/* Left Static Column */}
        <div className="w-full md:w-[45%] shrink-0 relative z-30 flex flex-col justify-center h-full">
          <h2 className="font-display font-medium text-[clamp(2.5rem,4.5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-black mb-6 mt-12 md:mt-0">
            We treat your <em className="font-accent font-normal tracking-normal">sales</em> <br className="hidden md:block" />
            <em className="font-accent font-normal tracking-normal">pipeline</em> like it's our own
          </h2>
          <p className="font-display text-[15px] md:text-[16px] text-black/80 leading-[1.6] max-w-[420px] mb-8 font-medium">
            You don't just hire an agency. We go beyond simple service delivery to engineer your growth with the same obsession we apply to our own business.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-2.5 bg-black text-white rounded-lg font-display font-semibold text-[14px] pl-3 pr-5 py-2.5 hover:opacity-80 transition-opacity duration-300 shrink-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-sm bg-white/20 transition-colors">
                <PlusIconSm />
              </span>
              Explore cases
            </button>
            <button className="inline-flex items-center gap-2.5 bg-[#0028FF] text-white rounded-lg font-display font-semibold text-[14px] pl-3 pr-5 py-2.5 hover:bg-black transition-colors duration-300 shrink-0">
              <span className="flex items-center justify-center w-5 h-5 rounded-sm bg-white/20 transition-colors">
                <PlusIconSm />
              </span>
              Talk to us
            </button>
          </div>
        </div>

        {/* Right Infinite Vertical Scrolling Columns (2 Lanes) */}
        <div className="w-full md:w-[55%] flex flex-row gap-6 h-[500px] md:h-full overflow-hidden relative" style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}>
          
          {/* Lane 1: Scrolling UP */}
          <div className="w-1/2 h-full overflow-hidden">
            <div className="flex flex-col gap-6 animate-marquee-up hover:play-state-paused" style={{ height: "max-content" }}>
              {[...testimonialsLeft, ...testimonialsLeft].map((t, i) => (
                <div key={`l-${i}`} className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-5 shadow-sm">
                  {t.name && (
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover grayscale" />
                      <div>
                        <h4 className="font-display font-semibold text-[14px] text-black leading-tight">{t.name}</h4>
                        <p className="font-display text-[12px] md:text-[13px] text-black/50 leading-tight mt-1">{t.title}</p>
                      </div>
                    </div>
                  )}
                  <p className="font-display text-[15px] md:text-[16px] text-black/90 leading-[1.5] font-medium">
                    {t.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lane 2: Scrolling DOWN */}
          <div className="w-1/2 h-full overflow-hidden">
            <div className="flex flex-col gap-6 animate-marquee-down hover:play-state-paused" style={{ height: "max-content" }}>
              {[...testimonialsRight, ...testimonialsRight].map((t, i) => (
                <div key={`r-${i}`} className="bg-white rounded-xl p-6 md:p-8 flex flex-col gap-5 shadow-sm">
                  {t.name && (
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover grayscale" />
                      <div>
                        <h4 className="font-display font-semibold text-[14px] text-black leading-tight">{t.name}</h4>
                        <p className="font-display text-[12px] md:text-[13px] text-black/50 leading-tight mt-1">{t.title}</p>
                      </div>
                    </div>
                  )}
                  <p className="font-display text-[15px] md:text-[16px] text-black/90 leading-[1.5] font-medium">
                    {t.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
