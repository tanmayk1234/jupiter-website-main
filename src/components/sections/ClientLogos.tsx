import { useTranslation } from "../providers/LanguageContext";

const clientLogos = [
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

export default function ClientLogos() {
  const { language } = useTranslation();
  // Exactly 2 copies for seamless infinite loop (translateX(-50%) wraps perfectly)
  const loopLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="relative overflow-hidden py-12 md:py-16 border-b border-black" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Global Vertical Line */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] flex flex-col md:flex-row items-center gap-8 px-6 md:px-12">
        {/* Label on the left */}
        <div className="shrink-0 font-display font-semibold text-[14px] md:text-[15px] uppercase tracking-widest text-black/50 md:w-[180px] text-center md:text-left mb-2 md:mb-0">
          {language === "en" ? "Trusted Partners" : language === "gu" ? "વિશ્વસનીય ભાગીદારો" : "నమ్మకమైన భాగస్వాములు"}
        </div>
        
        {/* Scrolling Marquee */}
        <div className="flex-1 overflow-hidden w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex items-center animate-marquee-left" style={{ width: "max-content" }}>
            {loopLogos.map((logo, i) => (
              <div key={i} className="flex-shrink-0 flex items-center justify-center h-[56px] md:h-[68px] w-[150px] md:w-[180px] mx-6 md:mx-8">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-all duration-300 mix-blend-multiply"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
