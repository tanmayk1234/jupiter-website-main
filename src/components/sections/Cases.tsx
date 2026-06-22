// Partners / Cases section — horizontal marquee of case cards + partner logo strip
import { useTranslation } from "../providers/LanguageContext";

const caseCards = [
  {
    img: "/assets/images/cases/case1.avif",
    logo: "/assets/images/logos/sf-white.avif",
    metric: "400K+",
    metricLabel: "Impressions generated",
    href: "#",
  },
  {
    img: "/assets/images/cases/case2.avif",
    logo: "/assets/images/logos/adspecialist.svg",
    metric: "3.74M+",
    metricLabel: "Impressions generated",
    href: "#",
  },
  {
    img: "/assets/images/cases/case3.avif",
    logo: "/assets/images/logos/adsventure-white.svg",
    metric: "90%",
    metricLabel: "LinkedIn revenue",
    href: "#",
  },
];

const partnerLogos = [
  { src: "/assets/images/logos/clients/cb9db2da-ed44-4476-a29d-9660ab73c7b8-removebg-preview.png", alt: "Client Logo 1" },
  { src: "/assets/images/logos/clients/cropped-terratech-logo-2.jpg", alt: "Terratech" },
  { src: "/assets/images/logos/clients/download.png", alt: "Client Logo 3" },
  { src: "/assets/images/logos/clients/gsp-logo-website-updated-3.png", alt: "GSP" },
  { src: "/assets/images/logos/clients/keva-golden-1.png", alt: "Keva" },
  { src: "/assets/images/logos/clients/logo (2).png", alt: "Client Logo 6" },
  { src: "/assets/images/logos/clients/logo (3).png", alt: "Client Logo 7" },
  { src: "/assets/images/logos/clients/logo (4).png", alt: "Client Logo 8" },
  { src: "/assets/images/logos/clients/logo (5).png", alt: "Client Logo 9" },
  { src: "/assets/images/logos/clients/logo-icon-1.png", alt: "Client Logo 10" },
  { src: "/assets/images/logos/clients/logo.png", alt: "Client Logo 11" },
  { src: "/assets/images/logos/clients/prgana-group-logo-new.png", alt: "Prgana Group" },
];

function PlusIconSm() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

export default function Cases() {
  const { language, t } = useTranslation();
  // Duplicate cards for seamless marquee loop
  // Duplicate cards for seamless marquee loop
  const loopCards = [...caseCards, ...caseCards, ...caseCards];
  const loopLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section id="cases-section" className="relative overflow-hidden" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Global Vertical Line */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Header with horizontal borders */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] border-t border-b border-black">
        <div className="px-6 md:px-12 py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h2 className="font-display font-medium text-[clamp(2.2rem,4vw,4.5rem)] leading-[1.05] tracking-[-0.03em] text-black max-w-[800px]">
            {language === "en" ? (
              <>
                Proven with 30+ <br className="hidden md:block" />
                founders that trusted us <br className="hidden md:block" />
                in <em className="font-accent font-normal tracking-normal">guiding</em> their growth
              </>
            ) : language === "gu" ? (
              <>
                30+ સ્થાપકો સાથે સાબિત, <br className="hidden md:block" />
                જેમણે તેમના ગ્રોથના <em className="font-accent font-normal tracking-normal">માર્ગદર્શન</em> માટે <br className="hidden md:block" />
                અમારા પર વિશ્વાસ મૂક્યો છે
              </>
            ) : (
              <>
                30+ వ్యవస్థాపకులతో రుజువైంది, <br className="hidden md:block" />
                వారు తమ గ్రోత్ <em className="font-accent font-normal tracking-normal">మార్గదర్శకత్వం</em> కోసం <br className="hidden md:block" />
                మమ్మల్ని నమ్మారు
              </>
            )}
          </h2>
          <button className="self-start md:self-auto inline-flex items-center gap-2.5 bg-black text-white rounded-full font-display font-medium text-[14px] pl-2 pr-5 py-2 hover:bg-[#0028FF] transition-colors duration-300 shrink-0 md:mr-8">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 transition-colors">
              <PlusIconSm />
            </span>
            {t("cases_explore_btn")}
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
                      {t("cases_explore_hover")}
                   </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Partner logos marquee */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] overflow-hidden border-t border-b border-black">
        <div className="flex animate-marquee-right hover:play-state-paused" style={{ width: "max-content" }}>
          {loopLogos.map((logo, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center w-[200px] md:w-[250px] h-[100px] md:h-[120px] border-r border-black px-6">
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-[50%] max-w-[80%] object-contain hover:scale-105 transition-all duration-300 mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
