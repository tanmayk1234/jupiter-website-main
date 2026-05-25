// Partners / Cases section — horizontal marquee of case cards + partner logo strip

const caseCards = [
  {
    img: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69cface4420dae1aa9844f88_IMG_0767_wgb_web.avif",
    logo: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69ddeae1d6bef13837de08ca_sf-white.avif",
    metric: "400K+",
    metricLabel: "Impressions generated",
    href: "#",
  },
  {
    img: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69d62b1e379c356eb8efb9a8_JRM(36von126)_wgb_portrait_2x.avif",
    logo: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69dde907e03bb3c4657e3117_adspecialist.svg",
    metric: "3.74M+",
    metricLabel: "Impressions generated",
    href: "#",
  },
  {
    img: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69cfad8a94f937dc796d76ba_Florian3690_wgb_web.avif",
    logo: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69ddea94250e7fc8b68ddd8b_adsventure-white.svg",
    metric: "90%",
    metricLabel: "LinkedIn revenue",
    href: "#",
  },
];

const partnerLogos = [
  { src: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69971f904e9e0efb0b6bbee0_logo-audiencly.avif", alt: "Audiencly" },
  { src: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69971f6cd8cd83078cf6c4b5_logo-beilmann.avif", alt: "Beilmann" },
  { src: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69971c011ee323422d41492a_logo-optimized.avif", alt: "Optimized" },
  { src: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69971bf4f45ccc776b17725b_logo-ecomhouse.avif", alt: "Ecom House" },
  { src: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69971be5a17168375dfd2c5c_logo-adsventure.avif", alt: "Adsventure" },
  { src: "https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9be/69971bd7db895486d9ae1993_logo-adspecialist.avif", alt: "Adspecialist" },
];

function PlusIconSm() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

export default function Cases() {
  // Duplicate cards for seamless marquee loop
  const loopCards = [...caseCards, ...caseCards, ...caseCards];
  const loopLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Global Vertical Line */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Header with horizontal borders */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] border-t border-b border-black">
        <div className="px-6 md:px-12 py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="font-display font-medium text-[clamp(2.2rem,4vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-black max-w-[800px]">
            Proven with 30+ <br className="hidden md:block" />
            founders that trusted us <br className="hidden md:block" />
            in <em className="font-accent font-normal tracking-normal">guiding</em> their growth
          </h2>
          <button className="self-start md:self-auto inline-flex items-center gap-2.5 bg-black text-white rounded-full font-display font-medium text-[14px] pl-2 pr-5 py-2 hover:bg-[#0028FF] transition-colors duration-300 shrink-0 md:mr-8">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 transition-colors">
              <PlusIconSm />
            </span>
            Explore our cases
          </button>
        </div>
      </div>

      {/* Case cards marquee (left) */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] overflow-hidden my-6 md:my-8">
        <div className="flex gap-5 md:gap-8 animate-marquee-left" style={{ width: "max-content" }}>
          {loopCards.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="group relative flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] h-[400px] md:h-[460px] rounded-xl md:rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="flex-1 overflow-hidden relative bg-black/5">
                <img
                  src={c.img}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="h-[60px] md:h-[70px] bg-[#0028FF] flex items-center justify-center relative overflow-hidden shrink-0">
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                  <img src={c.logo} alt="" className="h-4 md:h-5 object-contain brightness-0 invert" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                   <div className="flex items-center justify-center gap-2 w-[calc(100%-12px)] h-[calc(100%-12px)] bg-white text-[#0028FF] rounded-lg font-display font-semibold text-[14px]">
                      <span className="flex items-center justify-center w-4 h-4 text-[#0028FF] shrink-0">
                        <PlusIconSm />
                      </span>
                      Explore case
                   </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Partner logos / Coming Soon marquee */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] overflow-hidden border-t border-b border-black">
        <div className="flex animate-marquee-right" style={{ width: "max-content" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center w-[200px] md:w-[250px] h-[100px] md:h-[120px] border-r border-black">
              <span className="font-display font-medium text-black/40 text-[13px] uppercase tracking-widest">Coming Soon</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
