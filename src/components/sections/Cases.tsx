import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "../providers/LanguageContext";

const productCardImages = [
  "/assets/images/products/product-1.png",
  "/assets/images/products/product-2.png",
  "/assets/images/products/product-3.png",
  "/assets/images/products/product-4.png",
  "/assets/images/products/product-5.png",
];

const productNameKeys = [
  "product_1_name",
  "product_2_name",
  "product_3_name",
  "product_4_name",
  "product_5_name",
] as const;

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

function ProductZoomModal({ product, onClose }: { product: { img: string; name: string }; onClose: () => void }) {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    setScale(s => Math.min(5, Math.max(0.5, s - e.deltaY * 0.002)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    setPos(p => ({
      x: p.x + e.clientX - lastMouse.current.x,
      y: p.y + e.clientY - lastMouse.current.y,
    }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Reset on double click
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center cursor-grab active:cursor-grabbing"
      onClick={onClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
        </svg>
      </button>

      {/* Zoom hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[13px] font-display select-none pointer-events-none">
        {t("zoom_hint")}
      </div>

      {/* Product name */}
      <div className="absolute top-6 left-6 text-white font-display font-semibold text-[16px] select-none pointer-events-none">
        {product.name}
      </div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-6 right-6 text-white/50 text-[13px] font-display select-none pointer-events-none">
        {Math.round(scale * 100)}%
      </div>

      {/* Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className="max-w-[85vw] max-h-[85vh] select-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transition: dragging.current ? "none" : "transform 0.15s ease-out",
        }}
      >
        <img
          src={product.img}
          alt={product.name}
          className="max-w-[85vw] max-h-[85vh] object-contain drop-shadow-2xl pointer-events-none"
          draggable={false}
        />
      </div>
    </div>,
    document.body
  );
}

export default function Cases() {
  const { language, t } = useTranslation();
  const [activeProduct, setActiveProduct] = useState<{ img: string; name: string } | null>(null);

  const productCards = productCardImages.map((img, i) => ({
    img,
    name: t(productNameKeys[i]),
  }));

  // Duplicate for seamless marquee loop
  const loopCards = [...productCards, ...productCards, ...productCards];
  const loopLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section id="cases-section" className="relative overflow-hidden" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Global Vertical Line */}
      <div className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none" style={{ left: "max(1.5rem, min(5vw, 4rem))" }} />

      {/* Our Products Header */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] border-t border-b border-black">
        <div className="px-6 md:px-12 py-10 md:py-14">
          <span className="text-black font-semibold text-[13px] tracking-widest uppercase mb-4 block">
            {t("our_products_label")}
          </span>
          <h3 className="font-display font-medium text-[clamp(1.8rem,3vw,3rem)] leading-[1.1] tracking-[-0.02em] text-black max-w-[700px]">
            {t("our_products_heading")} <em className="font-accent font-normal tracking-normal">{t("our_products_heading_italic")}</em> {t("our_products_heading_2")}
          </h3>
          <p className="font-display text-[14px] text-black/50 mt-4 max-w-[55ch] leading-relaxed">
            {t("our_products_desc")}
          </p>
        </div>
      </div>

      {/* Product cards marquee (left) */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] overflow-hidden my-6 md:my-8">
        <div className="flex gap-5 md:gap-8 animate-marquee-left" style={{ width: "max-content" }}>
          {loopCards.map((p, i) => (
            <button
              key={i}
              onClick={() => setActiveProduct(p)}
              className="group relative flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] h-[400px] md:h-[460px] rounded-xl md:rounded-2xl overflow-hidden flex flex-col cursor-pointer text-left"
            >
              {/* Product image — transparent bg on gradient card */}
              <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-white to-[#EEEEE8] flex items-center justify-center p-8">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                {/* Zoom icon on hover */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/0 group-hover:bg-black/80 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <path d="M11 8v6M8 11h6" />
                  </svg>
                </div>
              </div>
              {/* Bottom black label bar */}
              <div className="h-[60px] md:h-[70px] bg-black flex items-center justify-center relative overflow-hidden shrink-0 px-4">
                <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                  <span className="font-display font-semibold text-white text-[14px] md:text-[15px] text-center leading-tight">{p.name}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                   <div className="flex items-center justify-center gap-2 w-[calc(100%-12px)] h-[calc(100%-12px)] bg-white text-black rounded-lg font-display font-semibold text-[14px]">
                      <span className="flex items-center justify-center w-4 h-4 text-black shrink-0">
                        <PlusIconSm />
                      </span>
                      {t("view_product")}
                   </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Our Clients Divider & Header */}
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] border-t border-black">
        <div className="px-6 md:px-12 py-10 md:py-14">
          <span className="text-black font-semibold text-[13px] tracking-widest uppercase mb-4 block">
            {t("our_clients_label")}
          </span>
          <h3 className="font-display font-medium text-[clamp(1.8rem,3vw,3rem)] leading-[1.1] tracking-[-0.02em] text-black max-w-[700px]">
            {t("our_clients_heading")} <em className="font-accent font-normal tracking-normal">{t("our_clients_heading_italic")}</em> {t("our_clients_heading_2")}
          </h3>
          <p className="font-display text-[14px] text-black/50 mt-4 max-w-[55ch] leading-relaxed">
            {t("our_clients_desc")}
          </p>
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

      {/* Zoom popup */}
      {activeProduct && (
        <ProductZoomModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </section>
  );
}
