import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslation } from "../providers/LanguageContext";

export default function OrderPage() {
  const { t } = useTranslation();
  const pageRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    material: "graphite",
    type: "shell-tube"
  });

  useEffect(() => {
    gsap.fromTo(pageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Smooth reset success notification
    setTimeout(() => {
      setSubmitted(false);
    }, 8000);
  };

  return (
    <div ref={pageRef} className="bg-[#F5F5F0] text-black min-h-screen pt-32 pb-24 px-6 md:px-[max(1.5rem,min(5vw,4rem))] font-display">
      {/* Global vertical border line on desktop */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      <div className="max-w-[1100px] mx-auto md:pl-16 relative z-10">
        
        {/* Header */}
        <div className="mb-16 max-w-[800px]">
          <h1 className="font-medium text-[clamp(2.5rem,5.5vw,6rem)] leading-[0.98] tracking-[-0.04em] mb-8">
            {t("order_hero_title_main")}
            <em className="font-accent font-normal tracking-normal italic">{t("order_hero_title_italic")}</em>
          </h1>
          <p className="text-black/60 text-[clamp(15px,1.2vw,18px)] leading-[1.6]">
            {t("order_hero_sub")}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-black/10 shadow-sm p-6 md:p-10 max-w-[900px] relative">
          {submitted ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center animate-bounce">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-semibold text-2xl tracking-tight">{t("order_form_success")}</h2>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-black/60">{t("order_form_name")}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border border-black/10 hover:border-black/30 focus:border-black rounded-xl px-4 py-3 text-[14px] bg-transparent outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-black/60">{t("order_form_email")}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border border-black/10 hover:border-black/30 focus:border-black rounded-xl px-4 py-3 text-[14px] bg-transparent outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-black/60">{t("order_form_message")}</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="border border-black/10 hover:border-black/30 focus:border-black rounded-xl px-4 py-3 text-[14px] bg-transparent outline-none transition-colors resize-none font-sans"
                />
              </div>

              {/* Selection Grids: Material & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-black/5 pt-8">
                {/* Material */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-base tracking-tight">{t("order_form_material")}</h3>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { id: "graphite", label: "Graphite (Corrosion-Proof)" },
                      { id: "hastelloy", label: "Hastelloy Alloys" },
                      { id: "ss316l", label: "Stainless Steel 316L" }
                    ].map(mat => (
                      <label key={mat.id} className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer transition-all ${
                        formData.material === mat.id ? "border-black bg-black/[0.03]" : "border-black/10 hover:border-black/20"
                      }`}>
                        <input
                          type="radio"
                          name="material"
                          value={mat.id}
                          checked={formData.material === mat.id}
                          onChange={() => setFormData({ ...formData, material: mat.id })}
                          className="w-4.5 h-4.5 accent-black"
                        />
                        <span className="text-[14px] font-medium">{mat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Exchanger Type */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold text-base tracking-tight">{t("order_form_type")}</h3>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { id: "shell-tube", label: "Shell & Tube Exchanger" },
                      { id: "block", label: "Block Type Graphite Exchanger" },
                      { id: "plate", label: "Plate & Frame Exchanger" }
                    ].map(type => (
                      <label key={type.id} className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer transition-all ${
                        formData.type === type.id ? "border-black bg-black/[0.03]" : "border-black/10 hover:border-black/20"
                      }`}>
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={formData.type === type.id}
                          onChange={() => setFormData({ ...formData, type: type.id })}
                          className="w-4.5 h-4.5 accent-black"
                        />
                        <span className="text-[14px] font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="group inline-flex items-center gap-3 bg-black text-white rounded-full font-display font-medium text-[15px] pr-5 pl-1.5 py-1.5 transition-all duration-500 ease-out hover:scale-[1.04] active:scale-[0.97] hover:shadow-xl hover:bg-neutral-800 self-start"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black transition-all duration-500 ease-out group-hover:scale-110">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-500 ease-out group-hover:rotate-180">
                    <path d="M7.7896 3.3936V0H6.2104V3.3936C6.2104 4.9504 4.9504 6.2104 3.3936 6.2104H0V7.78959H3.3936C4.9504 7.78959 6.2104 9.0496 6.2104 10.6064V14H7.7896V10.6064C7.7896 9.0496 9.0496 7.78959 10.6064 7.78959H14V6.2104H10.6064C9.0496 6.2104 7.7896 4.9504 7.7896 3.3936Z" fill="black"/>
                  </svg>
                </span>
                {t("order_form_submit")}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
