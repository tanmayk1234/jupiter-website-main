function WGBLogoLarge() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 51" fill="currentColor" className="w-full h-full">
      <path d="M82.5066 23.3806C82.5066 16.3352 85.906 12.4169 91.2127 12.4169C96.5194 12.4169 95.7279 13.364 97.0384 15.1416V12.7542H102.112V34.9022C102.112 40.637 98.1542 43.5693 92.8865 43.5693C87.6187 43.5693 83.856 41.156 83.1035 36.1218H88.2155C88.5269 38.3794 90.3564 39.5731 92.8086 39.5731C95.2609 39.5731 97.0384 38.3405 97.0384 34.98V31.4119C95.6501 33.3192 93.6779 34.3053 91.2127 34.3053C85.8282 34.3053 82.5066 30.1534 82.5066 23.3806ZM97.0254 23.3806C97.0254 19.06 95.3257 16.6077 92.3545 16.6077C89.3833 16.6077 87.7225 18.9821 87.7225 23.3806C87.7225 27.779 89.3444 30.1145 92.3545 30.1145C95.3646 30.1145 97.0254 27.7401 97.0254 23.3806Z" />
      <path d="M115.294 12.4169C112.764 12.4169 110.779 13.364 109.468 15.1416V5.72188H104.395V33.968H109.468V31.4119C110.857 33.3192 112.829 34.3053 115.294 34.3053C120.678 34.3053 124 30.1534 124 23.3806C124 16.6077 120.601 12.4169 115.294 12.4169ZM114.152 30.1145C111.103 30.1145 109.481 27.7401 109.481 23.3806C109.481 19.021 111.181 16.6077 114.152 16.6077C117.123 16.6077 118.784 18.9821 118.784 23.3806C118.784 27.779 117.162 30.1145 114.152 30.1145Z" />
      <path d="M69.1426 12.7542L73.7357 28.9078L77.6541 12.7542H82.7142L77.1481 33.981H70.5699L66.3271 17.8273L62.0973 33.981H55.5191L49.9399 12.7542H55.0131L58.9315 28.9078L63.5245 12.7542H69.1426Z" />
      <path d="M43.2969 0.583858C26.754 13.5197 9.65325 15.9979 9.65325 15.9979C9.65325 15.9979 8.45957 16.1795 8.0314 16.6726C7.34374 17.4122 7.64216 18.2425 7.64216 18.2555C7.81083 18.8005 11.314 30.7891 0.454131 48.1883C-0.246507 49.3042 -0.0389108 49.9789 0.48008 50.4978C1.05097 50.952 1.73863 51.0817 2.77662 50.2773C19.3195 37.3414 36.4202 34.8632 36.4202 34.8632C36.4202 34.8632 37.6009 34.7335 38.0031 34.2664C38.6908 33.462 38.4313 32.6056C38.2886 32.1515 34.7076 20.1369 45.6193 2.65982C46.32 1.54399 46.1124 0.869303 45.5934 0.350312C45.0225 -0.103805 44.3348 -0.233553 43.2969 0.570883V0.583858Z" />
    </svg>
  );
}

// 4-point star mark
function SmallStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
    </svg>
  );
}

export default function Footer({ onNavigate }: { onNavigate: () => void }) {
  return (
    <footer className="relative bg-[#020202] text-white overflow-hidden section-dark pt-0 pb-6 border-t border-white/20">
      {/* Global Vertical line */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-white/20 z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Main Content Area */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] relative z-10 pb-16 md:pb-24 border-b border-white/20">
         
         {/* Background Graphics Container (Strictly contained right of the vertical line) */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Sharp diagonal blue beam with feathered edges (glowing slash effect) */}
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-[150%]">
              <defs>
                 <linearGradient id="blueBeam" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0a1aff" />
                    <stop offset="100%" stopColor="#1a3fff" />
                 </linearGradient>
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="60" />
                 </filter>
              </defs>
              <path 
                d="M -100,1100 L 700,-200" 
                fill="none"
                stroke="url(#blueBeam)" 
                strokeWidth="120" 
                filter="url(#glow)"
              />
            </svg>
         </div>

         {/* Content Wrapper */}
         <div className="px-6 md:px-12 relative z-10 flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 h-full">
             {/* Left Side: Brand Graphics */}
             <div className="w-full lg:w-[45%] relative min-h-[250px] lg:min-h-[300px]">
                {/* Small floating star */}
                <div className="absolute top-[5%] left-[50%] lg:left-[45%] text-white w-4 h-4 opacity-80 z-10">
                   <SmallStar />
                </div>

                {/* Logo and text */}
                <div className="absolute bottom-[10%] left-0 lg:left-8 z-10">
                   <div className="w-[280px] lg:w-[380px] text-white">
                      <WGBLogoLarge />
                   </div>
                   <p className="font-display text-[22px] lg:text-[24px] font-medium mt-3 ml-[100px] lg:ml-[140px] tracking-wide text-white/90">
                     we go <br /> beyond
                   </p>
                </div>
             </div>

             {/* Right Side: Contact, Images, Links */}
             <div className="w-full lg:w-[50%] flex flex-col justify-start gap-10 lg:gap-8 max-w-[600px] xl:max-w-[700px] z-10">
            
            {/* The Big Container holding Images + Headline */}
            <div className="rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col w-full relative overflow-hidden bg-[#0A0A0A]/30 backdrop-blur-sm">
                
                {/* Image Cards Row */}
                <div className="flex gap-4 md:gap-6 mb-8">
                    {/* Niklas Card */}
                    <div className="relative rounded-[12px] overflow-hidden border border-white/10 w-[160px] h-[220px] md:w-[180px] md:h-[260px] bg-[#111] shrink-0">
                       <img src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=400" alt="Niklas Götz" className="w-full h-full object-cover opacity-90" />
                       <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] p-3 md:p-4 border-t border-white/10">
                         <p className="font-display font-medium text-white text-[13px] md:text-[14px] leading-tight">Niklas Götz</p>
                         <p className="font-display text-white/50 text-[11px] md:text-[12px] leading-tight mt-1">Co-Founder WGB</p>
                       </div>
                    </div>
                    
                    {/* Joshua Card (Staggered slightly down) */}
                    <div className="relative mt-12 rounded-[12px] overflow-hidden border border-white/10 w-[160px] h-[220px] md:w-[180px] md:h-[260px] bg-[#111] shrink-0">
                       <img src="https://images.unsplash.com/photo-1541577141970-eebc83ebe30e?auto=format&fit=crop&q=80&w=400" alt="Joshua Frosch" className="w-full h-full object-cover opacity-90" />
                       <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] p-3 md:p-4 border-t border-white/10">
                         <p className="font-display font-medium text-white text-[13px] md:text-[14px] leading-tight">Joshua Frosch</p>
                         <p className="font-display text-white/50 text-[11px] md:text-[12px] leading-tight mt-1">Co-Founder WGB</p>
                       </div>
                    </div>
                </div>

                {/* Headline */}
                <h2 className="font-display font-medium text-[clamp(2.5rem,4vw,3.8rem)] leading-[1.05] tracking-tight text-white">
                   Talk to an <em className="font-accent font-normal tracking-normal italic">expert,</em><br />
                   not sales
                </h2>
            </div>
            
            {/* Links & Button row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-6 ml-2">
               <nav className="flex flex-wrap items-center gap-5 md:gap-6">
                 {["Manifesto", "Services", "Cases", "Blog", "Growth Assets", "About"].map(link => (
                    <a key={link} href="#" onClick={(e) => { e.preventDefault(); onNavigate(); }} className="font-display font-bold text-[14px] text-white hover:text-white/70 transition-colors">
                      {link}
                    </a>
                 ))}
               </nav>
               
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 border border-white/20 rounded-[6px] px-4 py-2 hover:bg-white/10 transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="font-display text-[14px] font-bold">Follow us</span>
               </a>
            </div>
         </div>
      </div>
      </div>

      {/* Bottom Legal / Credits Bar */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] px-6 md:px-12 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-6 font-display text-[12px] text-white/50 font-medium">
          <p>© 2026 WGB. All rights reserved.</p>
          <div className="flex items-center gap-6 md:gap-8 ml-0 md:-ml-20">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Imprint</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1"><span className="text-[10px]">©</span>Branding by Ali</p>
            <p className="flex items-center gap-1"><span className="text-[10px]">©</span>Design by Dylan</p>
          </div>
      </div>
    </footer>
  );
}
