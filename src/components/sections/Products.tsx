import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "../providers/LanguageContext";

const productImages = [
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

const productSpecKeys = [
  "product_1_spec",
  "product_2_spec",
  "product_3_spec",
  "product_4_spec",
  "product_5_spec",
] as const;

export default function Products() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const products = productImages.map((img, i) => ({
    img,
    name: t(productNameKeys[i]),
    spec: t(productSpecKeys[i]),
  }));

  useEffect(() => {
    if (!cardsRef.current) return;
    const ctx = gsap.context(() => {
      Array.from(cardsRef.current!.children).forEach((item) => {
        gsap.fromTo(
          item as HTMLElement,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item as HTMLElement, start: "top 88%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="products-section"
      className="relative py-20 md:py-28 px-6 md:px-[max(1.5rem,min(5vw,4rem))]"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      {/* Global vertical line */}
      <div
        className="hidden md:block absolute top-0 bottom-0 w-px bg-black z-20 pointer-events-none"
        style={{ left: "max(1.5rem, min(5vw, 4rem))" }}
      />

      {/* Top border */}
      <div
        className="hidden md:block absolute top-0 right-0 h-px bg-black z-20 pointer-events-none"
        style={{ left: "max(1.5rem, min(5vw, 4rem))" }}
      />

      <div className="max-w-[1200px] mx-auto md:pl-10">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <h2 className="font-display font-medium text-[clamp(2rem,4.5vw,5rem)] leading-[1.05] tracking-[-0.03em] text-black max-w-[700px]">
            {t("products_header")}{" "}
            <em className="font-accent font-normal tracking-normal">
              {t("products_header_italic")}
            </em>{" "}
            {t("products_header_2")}
          </h2>
          <p className="font-display text-[15px] text-black/60 leading-[1.6] mt-5 max-w-[55ch]">
            {t("products_desc")}
          </p>
        </div>

        {/* Product cards — horizontal scroll on mobile, grid on desktop */}
        <div
          ref={cardsRef}
          className="flex md:grid md:grid-cols-5 gap-6 md:gap-5 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p, i) => (
            <div
              key={i}
              className="group flex-shrink-0 w-[220px] md:w-auto snap-center flex flex-col"
            >
              {/* Image container — transparent bg product shot with subtle gradient */}
              <div className="relative bg-gradient-to-b from-white to-[#EEEEE8] rounded-2xl border border-black/5 p-4 md:p-5 aspect-[3/4] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:shadow-xl group-hover:border-black/10 group-hover:-translate-y-1">
                {/* Subtle blue glow on hover */}
                <div className="absolute inset-0 bg-[#0028FF]/0 group-hover:bg-[#0028FF]/[0.03] transition-colors duration-500 rounded-2xl" />
                <img
                  src={p.img}
                  alt={p.name}
                  className="relative z-10 w-full h-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Label */}
              <div className="mt-4 px-1">
                <h3 className="font-display font-semibold text-[14px] md:text-[15px] text-black leading-snug tracking-tight">
                  {p.name}
                </h3>
                <p className="font-display text-[12px] md:text-[13px] text-black/50 mt-1 leading-[1.4]">
                  {p.spec}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
