import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "../providers/LanguageContext";

// 4-point star mark
function SmallStar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" />
    </svg>
  );
}

interface FooterProps {
  onViewChange?: (view: "home" | "order" | "about" | "blog" | "resources" | "sustainability") => void;
}

export default function Footer({ onViewChange }: FooterProps) {
  const { language, t } = useTranslation();
  const [activeModal, setActiveModal] = useState<"privacy" | "imprint" | "cookies" | null>(null);

  const footerLinks = [
    { label: t("home"), view: "home" as const },
    { label: t("order"), view: "order" as const },
    { label: t("sustainability"), view: "sustainability" as const },
    { label: t("about"), view: "about" as const }
  ];

  // Helper to get modal titles based on current language
  const getModalTitle = (type: "privacy" | "imprint" | "cookies") => {
    if (type === "privacy") {
      return language === "en" ? "Privacy Policy" : language === "gu" ? "ગોપનીયતા નીતિ" : "గోప్యతా విధానం";
    }
    if (type === "imprint") {
      return language === "en" ? "Imprint & Legal Notice" : language === "gu" ? "ઇમ્પ્રિન્ટ / કાનૂની નોટિસ" : "ఇంప్రింట్ / లీగల్ నోటీసు";
    }
    return language === "en" ? "Cookie Policy" : language === "gu" ? "કૂકી નીતિ" : "కుకీల విధానం";
  };

  // Helper to get modal body copy based on current language
  const getModalContent = (type: "privacy" | "imprint" | "cookies") => {
    if (type === "privacy") {
      return language === "en" ? (
        <>
          <p className="font-semibold">At Jupiter Engineering Solutions, we prioritize the confidentiality and security of our clients' data.</p>
          <p><strong>1. Information Collection:</strong> We collect contact information and technical design requirements (such as engineering specifications, CAD drawings, thermal parameters) to provide customized engineering services.</p>
          <p><strong>2. Data Protection:</strong> All drawings and industrial designs are kept on secure servers. Access is strictly limited to authorized engineering personnel. We implement industrial-grade encryption for all intellectual property.</p>
          <p><strong>3. ASME Compliance:</strong> Design compliance and structural verification documents are stored securely in accordance with ISO 9001 and ASME Section VIII directives. We do not sell or share your information with third-party marketing companies.</p>
        </>
      ) : language === "gu" ? (
        <>
          <p className="font-semibold">જ્યુપિટર એન્જિનિયરિંગ સોલ્યુશન્સ પર, અમે અમારા ક્લાયન્ટ્સના ડેટાની ગુપ્તતા અને સુરક્ષાને અગ્રતા આપીએ છીએ.</p>
          <p><strong>૧. માહિતી સંગ્રહ:</strong> કસ્ટમાઇઝ્ડ એન્જિનિયરિંગ સેવાઓ પ્રદાન કરવા માટે અમે સંપર્ક માહિતી અને તકનીકી ડિઝાઇન આવશ્યકતાઓ (જેમ કે એન્જિનિયરિંગ સ્પષ્ટીકરણો, CAD રેખાંકનો) એકત્રિત કરીએ છીએ.</p>
          <p><strong>૨. ડેટા સુરક્ષા:</strong> તમામ રેખાંકનો અને ઔદ્યોગિક ડિઝાઇન સુરક્ષિત સર્વર્સ પર રાખવામાં આવે છે. ઔદ્યોગિક હીટ એક્સચેન્જર્સ અને પ્રેશર વેસલ્સની ડિઝાઇન ફાઇલોનો ઉપયોગ ગુપ્ત રીતે થાય છે.</p>
          <p><strong>૩. ASME પાલન:</strong> ISO 9001 અને ASME સેક્શન VIII નિર્દેશો અનુસાર ડિઝાઇન પાલન અને માળખાકીય ચકાસણી દસ્તાવેજો સુરક્ષિત રીતે સંગ્રહિત થાય છે.</p>
        </>
      ) : (
        <>
          <p className="font-semibold">జూపిటర్ ఇంజనీరింగ్ సొల్యూషన్స్ వద్ద, మేము మా క్లయింట్ల డేటా యొక్క గోప్యత మరియు భద్రతకు ప్రాధాన్యత ఇస్తాము.</p>
          <p><strong>1. సమాచార సేకరణ:</strong> మేము అనుకూలీకరించిన ఇంజనీరింగ్ సేవలను అందించడానికి సంప్రదింపు సమాచారం మరియు సాంకేతిక రూపకల్పన వివరాలను (CAD డ్రాయింగ్‌లు, ఉష్ణ పారామితులు వంటివి) సేకరిస్తాము.</p>
          <p><strong>2. డేటా రక్షణ:</strong> అన్ని డ్రాయింగ్‌లు మరియు పారిశ్రామిక నమూనాలు సురక్షితమైన సర్వర్‌లలో ఉంచబడతాయి. అనుమతి పొందిన ఇంజనీరింగ్ సిబ్బందికి మాత్రమే వీటికి యాక్సెస్ ఉంటుంది.</p>
          <p><strong>3. ASME నిబంధనల అమలు:</strong> ISO 9001 మరియు ASME సెక్షన్ VIII ఆదేశాలకు అనుగుణంగా డిజైన్ పత్రాలు సురక్షితంగా నిల్వ చేయబడతాయి.</p>
        </>
      );
    }

    if (type === "imprint") {
      return language === "en" ? (
        <>
          <p className="font-semibold text-lg text-[#0028FF]">Jupiter Engineering Solutions</p>
          <p><strong>Registered Office & Factory:</strong> Gat No. 20/5, Besides Caves County Resorts, Mumbai Agra Highway, Villholi, Nashik - 422010, Maharashtra, India.</p>
          <p><strong>Partners:</strong> Ravindra Mundada, Viraj Mundada</p>
          <p><strong>Contact Info:</strong> jupiterengg18@gmail.com | +91 8600031275 / +91 9766963331</p>
          <p><strong>Certifications:</strong> Design & fabrication facility.</p>
        </>
      ) : language === "gu" ? (
        <>
          <p className="font-semibold text-lg text-[#0028FF]">જ્યુપિટર એન્જિનિયરિંગ સોલ્યુશન્સ</p>
          <p><strong>રજિસ્ટર્ડ ઓફિસ અને ફેક્ટરી:</strong> ગેટ નં. ૨૦/૫, કેવ્ઝ કાઉન્ટી રિસોર્ટ્સ પાસે, મુંબઈ આગ્રા હાઇવે, વિલ્હોળી, નાશિક - ૪૨૨૦૧૦, મહારાષ્ટ્ર, ભારત.</p>
          <p><strong>ભાગીદારો:</strong> રવિન્દ્ર મુંદડા, વિરાજ મુંદડા</p>
          <p><strong>સંપર્ક:</strong> jupiterengg18@gmail.com | +91 8600031275 / +91 9766963331</p>
          <p><strong>પ્રમાણપત્ર:</strong> ડિઝાઇન અને ફેબ્રિકેશન સુવિધા.</p>
        </>
      ) : (
        <>
          <p className="font-semibold text-lg text-[#0028FF]">జూపిటర్ ఇంజనీరింగ్ సొల్యూషన్స్</p>
          <p><strong>రిజిస్టర్డ్ ఆఫీస్ & ఫ్యాక్టరీ:</strong> గేట్ నం. 20/5, కేవ్స్ కౌంటీ రిసార్ట్స్ పక్కన, ముంబై ఆగ్రా హైవే, విల్హోళీ, నాశిక్ - 422010, మహారాష్ట్ర, భారతదేశం.</p>
          <p><strong>భాగస్వాములు:</strong> రవీంద్ర ముందాడ, విరాజ్ ముందాడ</p>
          <p><strong>సంప్రదించండి:</strong> jupiterengg18@gmail.com | +91 8600031275 / +91 9766963331</p>
          <p><strong>ధృవీకరణలు:</strong> డిజైన్ & ఫ్యాబ్రికేషన్ ప్లాంట్.</p>
        </>
      );
    }

    return language === "en" ? (
      <>
        <p className="font-semibold">Our website uses necessary cookies to optimize functionality, track selected languages, and enhance user experience.</p>
        <p><strong>1. Essential Cookies:</strong> Required for core site navigation and multi-language preference state. Disabling these may disrupt language toggle capabilities.</p>
        <p><strong>2. Performance:</strong> We utilize minimal, anonymous traffic analysis to speed up page loads and monitor server health. No personal identifying information is stored.</p>
        <p><strong>3. Cookie Control:</strong> You can disable cookies via your browser settings, though some translation services may require cookies to function correctly.</p>
      </>
    ) : language === "gu" ? (
      <>
        <p className="font-semibold">અમારી વેબસાઇટ પ્રદર્શનને ઑપ્ટિમાઇઝ કરવા, પસંદ કરેલી ભાષાઓને ટ્રૅક કરવા અને વપરાશકર્તા અનુભવને વધારવા માટે જરૂરી કૂકીઝનો ઉપયોગ કરે છે.</p>
        <p><strong>૧. આવશ્યક કૂકીઝ:</strong> મુખ્ય સાઇટ નેવિગેશન અને બહુભાષી પસંદગીઓ માટે જરૂરી છે.</p>
        <p><strong>૨. પ્રદર્શન કૂકીઝ:</strong> અમે વેબ ટ્રાફિકનું વિશ્લેષણ કરવા અને લોડિંગ સમય સુધારવા માટે ન્યૂનતમ અનામિક કૂકીઝનો ઉપયોગ કરીએ છીએ.</p>
        <p><strong>૩. નિયંત્રણ:</strong> તમે તમારા બ્રાઉઝર સેટિંગ્સ દ્વારા કૂકીઝને અક્ષમ કરી શકો છો.</p>
      </>
    ) : (
      <>
        <p className="font-semibold">మా వెబ్‌సైట్ పనితీరును ఆప్టిమైజ్ చేయడానికి, ఎంచుకున్న భాషలను ట్రాక్ చేయడానికి మరియు వినియోగదారు అనుభవాన్ని మెరుగుపరచడానికి అవసరమైన కుకీలను ఉపయోగించుకుంటుంది.</p>
        <p><strong>1. అవసరమైన కుకీలు:</strong> సైట్ నావిగేషన్ మరియు భాషా ప్రాధాన్యతల కోసం ఇవి తప్పనిసరి.</p>
        <p><strong>2. నియంత్రణ:</strong> మీరు మీ బ్రౌజర్ సెట్టింగ్‌ల ద్వారా కుకీలను నిలిపివేయవచ్చు.</p>
      </>
    );
  };

  return (
    <footer className="relative bg-[#020202] text-white overflow-hidden section-dark pt-0 pb-6 border-t border-white/20">
      {/* Global Vertical line */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-white/20 z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Main Content Area */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] relative z-10 pb-16 md:pb-24 border-b border-white/20">
         
         {/* Background Graphics Container (Strictly contained right of the vertical line) */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Sharp diagonal silver beam with feathered edges (glowing slash effect) */}
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 w-full h-[150%]">
              <defs>
                 <linearGradient id="silverBeam" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.03" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
                 </linearGradient>
                 {/* Revert to original blue beam by switching stroke="url(#silverBeam)" to stroke="url(#blueBeam)" below:
                 <linearGradient id="blueBeam" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0a1aff" />
                    <stop offset="100%" stopColor="#1a3fff" />
                 </linearGradient>
                 */}
                 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="60" />
                 </filter>
              </defs>
              <path 
                d="M -100,1100 L 700,-200" 
                fill="none"
                stroke="url(#silverBeam)" 
                strokeWidth="120" 
                filter="url(#glow)"
              />
            </svg>
         </div>

         {/* Content Wrapper */}
         <div className="px-6 md:px-12 relative z-10 flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 h-full">
             {/* Left Side: Brand Graphics */}
             <div className="w-full lg:w-[45%] relative min-h-[200px] lg:min-h-[250px] flex items-start">
                {/* Small floating star */}
                <div className="absolute top-[5%] left-[50%] lg:left-[45%] text-white w-4 h-4 opacity-80 z-10">
                   <SmallStar />
                </div>

                {/* Logo and text */}
                <div className="absolute top-[8%] left-0 z-10 flex flex-col gap-2">
                   <span className="font-display font-bold text-[28px] lg:text-[38px] tracking-[-0.02em] leading-[1.1] block text-white">
                     {t("jupiter_title")}
                   </span>
                   <p className="font-display text-[15px] lg:text-[17px] font-medium tracking-wide text-white/60 leading-relaxed max-w-[320px]">
                     {t("footer_eng_excellence")}
                   </p>
                </div>
             </div>

             {/* Right Side: Contact, Images, Links */}
             <div className="w-full lg:w-[50%] flex flex-col justify-start gap-10 lg:gap-8 max-w-[600px] xl:max-w-[700px] z-10">
            
            {/* The Big Container holding Images + Headline */}
            <div className="rounded-2xl border border-white/10 p-6 md:p-8 flex flex-col w-full relative overflow-hidden bg-[#0A0A0A]/30 backdrop-blur-sm">
                
                {/* Image Cards Row */}
                <div className="flex gap-4 md:gap-6 mb-8">
                    {/* Ravindra Card */}
                    <div className="relative rounded-[12px] overflow-hidden border border-white/10 w-[160px] h-[220px] md:w-[180px] md:h-[260px] bg-[#111] shrink-0 flex flex-col justify-end">
                       <div className="absolute inset-0 bg-[#111] flex items-center justify-center">
                         <img 
                           src="/assets/images/team/ravindra.png" 
                           alt="Ravindra Mundada"
                           className="w-full h-full object-cover object-[center_20%]"
                         />
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] p-3 md:p-4 border-t border-white/10 z-10">
                         <p className="font-display font-medium text-white text-[13px] md:text-[14px] leading-tight">Ravindra Mundada</p>
                         <p className="font-display text-white/50 text-[11px] md:text-[12px] leading-tight mt-1">{t("footer_ravindra_title")}</p>
                       </div>
                    </div>
                    
                    {/* Viraj Card (Staggered slightly down) */}
                    <div className="relative mt-12 rounded-[12px] overflow-hidden border border-white/10 w-[160px] h-[220px] md:w-[180px] md:h-[260px] bg-[#111] shrink-0 flex flex-col justify-end">
                       <div className="absolute inset-0 bg-gradient-to-b from-[#181818] to-[#111] flex items-center justify-center">
                         <span className="font-display font-bold text-white/10 text-[64px]">VM</span>
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] p-3 md:p-4 border-t border-white/10 z-10">
                         <p className="font-display font-medium text-white text-[13px] md:text-[14px] leading-tight">Viraj Mundada</p>
                         <p className="font-display text-white/50 text-[11px] md:text-[12px] leading-tight mt-1">{t("footer_viraj_title")}</p>
                       </div>
                    </div>
                </div>

                {/* Headline */}
                <h2 className="font-display font-medium text-[clamp(2.5rem,4vw,3.8rem)] leading-[1.05] tracking-tight text-white">
                   {t("footer_eng_excellence_headline")} <em className="font-accent font-normal tracking-normal italic">{t("footer_eng_excellence_headline_italic")}</em><br />
                   {t("footer_eng_excellence_headline_2")}
                </h2>
            </div>
            
            {/* Links & Button row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-6 ml-2">
               <nav className="flex flex-wrap items-center gap-5 md:gap-6">
                 {footerLinks.map(link => (
                    <a 
                      key={link.label} 
                      href="#" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        if (onViewChange) {
                          onViewChange(link.view);
                          window.scrollTo(0, 0);
                        }
                      }} 
                      className="font-display font-bold text-[14px] text-white hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </a>
                 ))}
               </nav>
               
               <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 border border-white/20 rounded-[6px] px-4 py-2 hover:bg-white/10 transition-colors shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="font-display text-[14px] font-bold">{t("footer_follow")}</span>
               </a>
            </div>
         </div>
      </div>
      </div>

      {/* Bottom Legal / Credits Bar */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] px-6 md:px-12 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-6 font-display text-[12px] text-white/50 font-medium">
          <p>{t("footer_rights")}</p>
          <div className="flex items-center gap-6 md:gap-8 ml-0 md:-ml-20">
            <a 
              id="footer-privacy-link"
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveModal("privacy"); }} 
              className="hover:text-white transition-colors"
            >
              {t("footer_privacy")}
            </a>
            <a 
              id="footer-imprint-link"
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveModal("imprint"); }} 
              className="hover:text-white transition-colors"
            >
              {t("footer_imprint")}
            </a>
            <a 
              id="footer-cookies-link"
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveModal("cookies"); }} 
              className="hover:text-white transition-colors"
            >
              {t("footer_cookies")}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1"><span className="text-[10px]">©</span>{t("footer_developed_by")}</p>
          </div>
      </div>

      {/* Modals Popup */}
      {activeModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-[#121212] border border-white/10 rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="font-display font-bold text-[18px] text-white tracking-wide">
                {getModalTitle(activeModal)}
              </h3>
              <button 
                id="modal-close-btn-top"
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto font-display text-[14px] leading-relaxed text-white/80 flex flex-col gap-4">
              {getModalContent(activeModal)}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button 
                id="modal-close-btn-bottom"
                onClick={() => setActiveModal(null)}
                className="bg-white/10 text-white rounded-lg px-5 py-2.5 font-display font-semibold text-[13px] hover:bg-white/20 transition-colors"
              >
                {t("footer_close")}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </footer>
  );
}
