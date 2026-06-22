import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../providers/LanguageContext";

const panels = [
  {
    id: "shell-tube",
    dot: null,
    heading: <>Shell & Tube <em className="font-accent font-normal tracking-normal">Exchangers</em></>,
    body: "Engineered for high-pressure and high-temperature processes. We design shell and tube exchangers that deliver optimal thermal performance and maximum durability under extreme industrial conditions.",
  },
  {
    id: "graphite",
    dot: null,
    heading: <>Graphite <em className="font-accent font-normal tracking-normal">Technology</em></>,
    body: "Unmatched corrosion resistance for aggressive chemical processing. Our graphite heat exchangers provide exceptional thermal conductivity, making them ideal for handling highly corrosive acids.",
  },
  {
    id: "thermal-design",
    dot: null,
    heading: <>Precision <em className="font-accent font-normal tracking-normal">Thermal</em> Design</>,
    body: "Optimized heat transfer using advanced HTRI calculations and CFD flow simulations. We customize tube configurations and baffle spacing to minimize pressure drop and prevent fouling.",
  },
  {
    id: "performance",
    dot: null,
    heading: <>Lifecycle <em className="font-accent font-normal tracking-normal">Performance</em></>,
    body: "Complete maintenance, refurbishing, and re-tubing services. We ensure your heat transfer systems run continuously at peak performance, minimizing downtime and extending operational life.",
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

// Decorative + marks scattered in the black bg

const FRAME_COUNT = 132;

export default function Services() {
  const { language, t } = useTranslation();
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imagesRef   = useRef<HTMLImageElement[]>([]);

  const localizedPanels = [
    {
      id: "shell-tube",
      heading: language === "en" ? (
        <>Shell & Tube <em className="font-accent font-normal tracking-normal">Exchangers</em></>
      ) : language === "gu" ? (
        <>શેલ અને ટ્યુબ <em className="font-accent font-normal tracking-normal">હીટ એક્સચેન્જર્સ</em></>
      ) : (
        <>షెల్ & ట్యూబ్ <em className="font-accent font-normal tracking-normal">హీట్ ఎక్స్ఛేంజర్స్</em></>
      ),
      body: t("services_1_body")
    },
    {
      id: "graphite",
      heading: language === "en" ? (
        <>Graphite <em className="font-accent font-normal tracking-normal">Technology</em></>
      ) : language === "gu" ? (
        <>ગ્રેફાઇટ <em className="font-accent font-normal tracking-normal">ટેકનોલોજી</em></>
      ) : (
        <>గ్రాఫైట్ <em className="font-accent font-normal tracking-normal">టెక్నాలజీ</em></>
      ),
      body: t("services_2_body")
    },
    {
      id: "thermal-design",
      heading: language === "en" ? (
        <>Precision <em className="font-accent font-normal tracking-normal">Thermal</em> Design</>
      ) : language === "gu" ? (
        <>ચોક્કસ <em className="font-accent font-normal tracking-normal">થર્મલ</em> ડિઝાઇન</>
      ) : (
        <>ఖచ్చితమైన <em className="font-accent font-normal tracking-normal">థర్మల్</em> డిజైన్</>
      ),
      body: t("services_3_body")
    },
    {
      id: "performance",
      heading: language === "en" ? (
        <>Lifecycle <em className="font-accent font-normal tracking-normal">Performance</em></>
      ) : language === "gu" ? (
        <>લાઇફસાયકલ <em className="font-accent font-normal tracking-normal">પર્ફોર્મન્સ</em></>
      ) : (
        <>లైఫ్‌సైకిల్ <em className="font-accent font-normal tracking-normal">పెర్ఫార్మెన్స్</em></>
      ),
      body: t("services_4_body")
    }
  ];

  // --- Scroll-driven frame animation ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sectionRef.current) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    // Build frame paths & preload images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let dimensionsSet = false;

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;
      if (!dimensionsSet) {
        // Set canvas internal resolution once from first loaded image
        canvas.width = img.width;
        canvas.height = img.height;
        dimensionsSet = true;
      }
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      ctx2d.drawImage(img, 0, 0);
      currentFrame = index;
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Show first frame as soon as it loads
        if (loadedCount === 1 && currentFrame === 0) {
          renderFrame(0);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // GSAP context for ScrollTrigger
    const gsapCtx = gsap.context(() => {
      // Frame scrubber — covers the entire black section
      const obj = { frame: 0 };
      gsap.to(obj, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        onUpdate: () => {
          renderFrame(Math.round(obj.frame));
        },
      });
    }, sectionRef);

    return () => gsapCtx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black text-white section-dark">
      {/* Decorative plus marks */}
      {plusMarks.map((p, i) => (
        <span
          key={i}
          className="absolute text-white/5 text-xl select-none pointer-events-none"
          style={p}
        >+</span>
      ))}

      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-white/40 z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Mobile: stacked layout */}
      <div className="md:hidden px-6 py-24 flex flex-col gap-16">
        {localizedPanels.map((p) => (
          <div key={p.id} className="flex flex-col gap-5">
            <h3 className="font-display font-medium text-[clamp(1.8rem,5vw,3rem)] leading-[1.05] tracking-[-0.03em]">
              {p.heading}
            </h3>
            <p className="font-display text-[15px] text-white/70 leading-[1.7]">{p.body}</p>
            <button className="self-start inline-flex items-center gap-2.5 border border-white/20 text-white rounded-full font-display font-medium text-[14px] pl-1.5 pr-5 py-1.5 hover:bg-white hover:text-black transition-colors duration-300">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
                <PlusIcon />
              </span>
              {t("services_discover_btn")}
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: sticky video on right, scroll panels on left */}
      <div className="hidden md:block relative min-h-screen">
        {/* Left — scroll panels */}
        <div className="w-[55%] flex flex-col px-[max(1.5rem,min(5vw,4rem))] pl-[calc(max(1.5rem,min(5vw,4rem))+2rem)]">
          {localizedPanels.map((p) => (
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
                {t("services_discover_btn")}
              </button>
            </div>
          ))}
        </div>

        {/* Right — sticky scroll-driven video frames (absolutely positioned, sticky inside) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '45%',
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            {/* Ambient backlight glow container */}
            <div className="relative w-full max-w-[420px] aspect-[9/16] flex items-center justify-center">
              {/* Soft radial blue glow */}
              <div 
                className="absolute w-[120%] h-[120%] bg-blue-600/20 rounded-full filter blur-[80px] -z-10 animate-pulse pointer-events-none"
                style={{ animationDuration: '4s' }}
              />
              
              <canvas
                ref={canvasRef}
                width={800}
                height={1422}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '1.5rem',
                  display: 'block',
                  boxShadow: '0 25px 50px -12px rgba(0, 40, 255, 0.35), 0 0 50px rgba(0, 40, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  zIndex: 10,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
