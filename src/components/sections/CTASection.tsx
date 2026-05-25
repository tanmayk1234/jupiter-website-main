import { useRef } from "react";

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="currentColor"/>
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#0028FF]">
      <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" fill="currentColor"/>
    </svg>
  );
}

export default function CTASection({ onNavigate }: { onNavigate: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  const comparisons = [
    {
      bad: "You post content, but the right people never see it — or never reach out.",
      good: "Strategic content is amplified and targeted directly at your ICP."
    },
    {
      bad: "You run ads, but without trust, people scroll past or ignore them.",
      good: "Thought Leader Ads build authority and awareness, not just clicks."
    },
    {
      bad: "You do cold outreach, but you're unknown — and untrusted.",
      good: "Outreach is powered by brand visibility and warm signals."
    },
    {
      bad: "You treat content, ads, and outreach as separate efforts.",
      good: "The Trust Engine combines all three into a single flywheel system."
    }
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#F5F5F0] pt-8 md:pt-12 pb-6 md:pb-8">
      {/* Global Vertical line */}
      <div className="hidden md:block absolute top-[0px] bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Top horizontal border to seamlessly connect with Testimonials */}
      <div className="hidden md:block absolute top-0 right-0 h-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] px-6 md:px-12 relative z-10 h-full mt-4 md:mt-8">
        
        {/* The Peach Box */}
        <div className="bg-[#FFF3ED] rounded-[2rem] p-8 md:p-12 lg:p-16 relative overflow-hidden">
          
          {/* Blue Swoosh Background Graphic */}
          <div className="absolute top-[15%] right-[-15%] w-[800px] h-[1000px] border-[1px] border-[#0028FF]/40 rounded-[50%] -rotate-[15deg] pointer-events-none z-0" />

          {/* Header */}
          <div className="text-center relative z-10 max-w-[800px] mx-auto mb-16">
            <h2 className="font-display font-medium text-[clamp(2rem,4vw,3.75rem)] text-black leading-[1.05] tracking-tight mb-5">
              Stop relying <br />
              on <em className="font-accent font-normal tracking-normal italic">isolated tactics</em>
            </h2>
            <p className="font-display text-[15px] md:text-[16px] text-black/80 max-w-[560px] mx-auto leading-[1.6] font-medium">
              You cannot engineer predictable growth with random acts of marketing. To fill your pipeline consistently, you need to replace isolated efforts with a holistic system.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="relative z-10 max-w-[1000px] mx-auto">
            {/* Table Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-6 relative">
              
              {/* Left Header */}
              <div className="flex flex-col items-center md:items-center text-center">
                <h3 className="font-display font-semibold text-[20px] md:text-[22px] text-black">Isolated tactics</h3>
                <p className="font-display text-[13px] md:text-[14px] text-black/50 mt-1">Personal Branding vs. Lead Gen Ads vs. Cold Outreach</p>
              </div>
              
              {/* Right Header */}
              <div className="flex flex-col items-center md:items-center text-center relative">
                {/* Spark Icon */}
                <div className="hidden md:block absolute -left-10 lg:-left-12 top-0 w-10 h-10 text-[#0028FF]">
                  <SparkIcon />
                </div>
                <h3 className="font-display font-semibold text-[20px] md:text-[22px] text-black">WGB Trust Engine</h3>
                <p className="font-display text-[13px] md:text-[14px] text-black/50 mt-1">A holistic system for real growth</p>
              </div>
              
            </div>

            {/* Table Rows */}
            <div className="flex flex-col gap-3.5">
              {comparisons.map((item, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-12">
                  {/* Bad Card */}
                  <div className="bg-white rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="w-8 h-8 rounded-xl bg-[#FFE9E0] text-[#FF5A00] flex items-center justify-center shrink-0">
                      <CloseIcon />
                    </div>
                    <p className="font-display text-[14px] md:text-[15px] text-black/90 leading-[1.5] mt-1 font-medium">
                      {item.bad}
                    </p>
                  </div>

                  {/* Good Card */}
                  <div className="bg-white rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    <div className="w-8 h-8 rounded-xl bg-[#E5E9FF] text-[#0028FF] flex items-center justify-center shrink-0">
                      <PlusIcon />
                    </div>
                    <p className="font-display text-[14px] md:text-[15px] text-black/90 leading-[1.5] mt-1 font-medium">
                      {item.good}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom CTA Button inside the peach box */}
          <div className="mt-16 flex justify-center relative z-10">
            <button 
              onClick={onNavigate}
              className="bg-[#0028FF] text-white rounded-full px-8 py-3.5 font-display font-medium text-[15px] hover:bg-black transition-colors duration-300 shadow-lg shadow-[#0028FF]/20"
            >
              Talk to an expert
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
