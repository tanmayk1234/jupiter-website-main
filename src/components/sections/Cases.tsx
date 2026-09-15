import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "../providers/LanguageContext";
import { PlusIcon, CloseIcon } from "../ui/icons";
import GridLine from "../ui/GridLine";

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

const partnerLogos: { src: string; alt: string; name?: string; sizeClass?: string }[] = [
  { src: "/assets/images/logos/clients/cb9db2da-ed44-4476-a29d-9660ab73c7b8-removebg-preview.png", alt: "Chem Process Systems" },
  { src: "/assets/images/logos/clients/cropped-terratech-logo-2.png", alt: "Terratech" },
  { src: "/assets/images/logos/clients/download.png", alt: "SRF" },
  { src: "/assets/images/logos/clients/gsp-logo-website-updated-3.png", alt: "GSP Chem" },
  { src: "/assets/images/logos/clients/keva-golden-1.png", alt: "Keva" },
  { src: "/assets/images/logos/clients/logo (2).png", alt: "Catapharma", sizeClass: "max-h-[75%] max-w-[95%] scale-[1.15] md:scale-[1.25] origin-center" },
  { src: "/assets/images/logos/clients/logo (3).png", alt: "Kilburn Engineering", sizeClass: "max-h-[75%] max-w-[95%] scale-[1.15] md:scale-[1.25] origin-center" },
  { src: "/assets/images/logos/clients/logo (4).png", alt: "Laxmi Organic Industries", name: "Laxmi Organic Industries Limited" },
  { src: "/assets/images/logos/clients/logo (5).png", alt: "Rhythm Chemicals" },
  { src: "/assets/images/logos/clients/logo-icon-1.png", alt: "Hari Orgochem", name: "Hari Orgochem Pvt. Ltd." },
  { src: "/assets/images/logos/clients/logo.png", alt: "Bhabani" },
  { src: "/assets/images/logos/clients/prgana-group-logo-new.png", alt: "Pragna Group" },
];

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_RATE = 0.0015;   // per normalised px of wheel delta — ~1.16x per notch
const PINCH_RATE = 0.01;    // trackpad pinch reports much smaller deltas
const MAX_WHEEL_PX = 300;   // cap one event so a momentum fling can't cross the range
const LINE_PX = 33;         // Firefox sends ~3 lines per notch; 3 x 33 ≈ one Chrome notch
const PAGE_PX = 300;        // page-mode wheels, capped above anyway
const RESET_MS = 180;
const DRAG_SLOP = 4;        // px of travel before a drag stops counting as a click
const DBLTAP_MS = 300;      // touch has no dblclick once touch-action is none
const DBLTAP_PX = 30;

type View = { s: number; x: number; y: number };
const RESET_VIEW: View = { s: 1, x: 0, y: 0 };

const clamp = (n: number, lo: number, hi: number) => (n < lo ? lo : n > hi ? hi : n);

// deltaY arrives in px, lines or pages depending on the device and browser.
// Without this Firefox zooms at a fraction of Chrome's rate off the same gesture.
const wheelPx = (e: WheelEvent) => {
  const unit = e.deltaMode === 1 ? LINE_PX : e.deltaMode === 2 ? PAGE_PX : 1;
  return clamp(e.deltaY * unit, -MAX_WHEEL_PX, MAX_WHEEL_PX);
};

// A trackpad pinch arrives as a wheel event with ctrlKey and a small delta. Ctrl
// held during a real mouse wheel looks identical apart from the magnitude (100+),
// so gate on the delta too — gating on ctrlKey alone makes Ctrl+wheel, the standard
// Windows page-zoom habit, slam from 100% to the 500% ceiling in two notches.
const isPinch = (e: WheelEvent) => e.ctrlKey && Math.abs(e.deltaY) < 50;

const touchDist = (t: TouchList) =>
  Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

function ProductZoomModal({ product, onClose }: { product: { img: string; name: string }; onClose: () => void }) {
  const { t } = useTranslation();

  // Scale and translate are ONE piece of state. The anchored zoom reads both and
  // writes both in the same step — the new translate is a function of the old AND
  // the new scale — and two separate functional updaters cannot see each other's
  // pending value, so split across two useStates the pan is computed against a
  // scale one render out of date and the image tears during a fast wheel burst.
  const [view, setView] = useState<View>(RESET_VIEW);
  const [animate, setAnimate] = useState(false); // true only while the reset eases

  // Drives the hint copy only. Read once: a device does not grow a mouse mid-session.
  const [coarse] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  const overlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);      // static, never transformed
  const layerRef = useRef<HTMLDivElement>(null);    // the transformed layer
  const animRef = useRef(false);                    // synchronous mirror of `animate`
  const dragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const downAt = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const pinchRef = useRef<{ dist: number; cx: number; cy: number } | null>(null);
  const panRef = useRef<{ x: number; y: number } | null>(null);
  const lastTap = useRef({ at: 0, x: 0, y: 0 });

  // While the reset transition is in flight `view` is already the target, so the
  // pixels on screen are something else entirely and anchoring against state
  // would snap. Adopt what is actually painted instead, and kill the transition
  // in the same commit so the gesture continues from what the user sees.
  // Returns null when there is nothing to adopt.
  //
  // The animRef guard is synchronous on purpose: a second wheel event in the same
  // tick must NOT re-adopt the pre-commit matrix and throw away the first event's
  // zoom — it falls through to the functional updater and chains normally.
  const adoptPaintedView = useCallback((): View | null => {
    if (!animRef.current) return null;
    animRef.current = false;
    setAnimate(false);
    const el = layerRef.current;
    if (!el) return null;
    const css = getComputedStyle(el).transform;
    if (!css || css === "none") return null;
    try {
      // Computed transforms resolve the function list without folding in
      // transform-origin, so with origin 0 0 and a uniform scale this is exactly
      // matrix(s, 0, 0, s, x, y) — m.a/m.e/m.f are the live scale and translate.
      const m = new DOMMatrixReadOnly(css);
      if (!Number.isFinite(m.a) || m.a <= 0) return null;
      return { s: clamp(m.a, MIN_SCALE, MAX_SCALE), x: m.e, y: m.f };
    } catch {
      return null; // unparseable: keep state, worst case the reset finishes instantly
    }
  }, []);

  const resetView = useCallback(() => {
    animRef.current = true;
    setAnimate(true);
    setView(RESET_VIEW);
  }, []);

  // Wheel has to be bound natively with passive:false. React registers onWheel
  // as a passive listener, so preventDefault() inside it is ignored and the
  // page keeps scrolling behind the modal — stopPropagation() never addressed
  // that, it only stops React's own bubbling.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const box = boxRef.current;
      if (!box) return;

      const dy = wheelPx(e);
      if (dy === 0) return; // horizontal or shift+wheel: no zoom, no state churn

      // The static box is never transformed, so its rect is the untransformed
      // geometry at all times — no cached measurement to invalidate on resize or
      // when the image finally decodes, and nothing to un-transform. With
      // transform-origin 0 0 the layer pivots on this same top-left, so this is
      // the cursor in the image's own coordinates.
      const rect = box.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      // Read the DOM out here, not inside the updater: the updater has to stay
      // pure because StrictMode invokes it twice in dev.
      const adopted = adoptPaintedView();

      setView(v => {
        const prev = adopted || v;
        // Multiplicative, so one notch is the same proportional change at 0.6x as
        // at 4x, and zoom in then out lands back on the same view.
        const s = clamp(prev.s * Math.exp(-dy * (isPinch(e) ? PINCH_RATE : ZOOM_RATE)), MIN_SCALE, MAX_SCALE);
        if (s === prev.s) return prev; // at a rail: unchanged, so no drift and no render

        // Keep the point under the cursor under the cursor. With origin 0 0 a
        // local point p paints at box + t + s*p, so the point currently under the
        // cursor is (c - t)/s, and holding it there across s -> s' gives
        //     t' = (1 - k) * c + k * t,   k = s'/s
        // k is built from the CLAMPED scale, never the requested one: at 0.5x and
        // 5x that makes k exactly 1 and the image stops dead, instead of sliding
        // further from the cursor on every event under a zoom that never happens.
        const k = s / prev.s;
        return { s, x: (1 - k) * cx + k * prev.x, y: (1 - k) * cy + k * prev.y };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [adoptPaintedView]);

  // Touch, bound natively for the same passive-listener reason as the wheel.
  // Two fingers zoom about their midpoint and pan with it; one finger pans.
  // Same anchor law as the wheel, with c = the midpoint: the image point under
  // the old midpoint has to end up under the new one, which is
  //     t' = m' - k * m + k * t
  // and that degenerates to a pure pan when k is 1, so a pinch held at a rail
  // still tracks the fingers instead of freezing or sliding.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const mid = (tl: TouchList, rect: DOMRect) => ({
      cx: (tl[0].clientX + tl[1].clientX) / 2 - rect.left,
      cy: (tl[0].clientY + tl[1].clientY) / 2 - rect.top,
    });

    const onStart = (e: TouchEvent) => {
      const box = boxRef.current;
      if (!box) return;
      const adopted = adoptPaintedView();
      if (adopted) setView(adopted);
      if (e.touches.length >= 2) {
        const rect = box.getBoundingClientRect();
        const { cx, cy } = mid(e.touches, rect);
        pinchRef.current = { dist: touchDist(e.touches), cx, cy };
        panRef.current = null;
        moved.current = true; // a pinch is never a tap
      } else {
        pinchRef.current = null;
        panRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onMove = (e: TouchEvent) => {
      const box = boxRef.current;
      if (!box) return;
      if (e.touches.length >= 2 && pinchRef.current) {
        e.preventDefault();
        const rect = box.getBoundingClientRect();
        const { cx, cy } = mid(e.touches, rect);
        const d = touchDist(e.touches);
        const p = pinchRef.current;
        const ratio = p.dist > 0 ? d / p.dist : 1;
        pinchRef.current = { dist: d, cx, cy };
        moved.current = true;
        setView(v => {
          const s = clamp(v.s * ratio, MIN_SCALE, MAX_SCALE);
          const k = s / v.s;
          return { s, x: cx - k * p.cx + k * v.x, y: cy - k * p.cy + k * v.y };
        });
      } else if (e.touches.length === 1 && panRef.current) {
        e.preventDefault();
        const tp = e.touches[0];
        const dx = tp.clientX - panRef.current.x;
        const dy = tp.clientY - panRef.current.y;
        panRef.current = { x: tp.clientX, y: tp.clientY };
        if (Math.abs(dx) + Math.abs(dy) > 0) moved.current = true;
        setView(v => ({ s: v.s, x: v.x + dx, y: v.y + dy }));
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
      panRef.current = e.touches.length === 1
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : null;

      // touch-action: none suppresses the synthesised dblclick, so the reset
      // gesture has to be recognised here or it is unreachable on a phone.
      if (e.touches.length === 0 && !moved.current && e.changedTouches.length) {
        const ct = e.changedTouches[0];
        const now = e.timeStamp;
        const prev = lastTap.current;
        const near = Math.abs(ct.clientX - prev.x) + Math.abs(ct.clientY - prev.y) < DBLTAP_PX;
        if (now - prev.at < DBLTAP_MS && near) {
          resetView();
          lastTap.current = { at: 0, x: 0, y: 0 };
        } else {
          lastTap.current = { at: now, x: ct.clientX, y: ct.clientY };
        }
      }
    };

    el.addEventListener("touchstart", onStart, { passive: false });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: false });
    el.addEventListener("touchcancel", onEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [adoptPaintedView, resetView]);

  // Lenis drives scrolling from its own window listener, which preventDefault
  // on our element does not reach. Locking the body is what actually stops it,
  // and it covers keyboard scrolling too. data-lenis-prevent on the overlay
  // below is Lenis's own opt-out for the wheel path.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  // Every click is preceded by a mousedown here, whether the press landed on the
  // backdrop or bubbled up from the image, so this is the one place the drag flag
  // needs clearing — clear it at click time instead and a pan that ends on the
  // image never clears it, and the next backdrop click is silently swallowed.
  const handleOverlayMouseDown = useCallback(() => {
    moved.current = false;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    downAt.current = { x: e.clientX, y: e.clientY };
    // Grabbing mid-reset should continue from the painted frame, not the target.
    const adopted = adoptPaintedView();
    if (adopted) setView(adopted);
  }, [adoptPaintedView]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    // Measured from the press point rather than accumulated, so a long shaky
    // press can't creep past the slop and eat the click.
    if (Math.abs(e.clientX - downAt.current.x) + Math.abs(e.clientY - downAt.current.y) > DRAG_SLOP) {
      moved.current = true;
    }
    // `translate` precedes `scale` in the transform list, so the translate is not
    // multiplied by the scale and the screen delta goes in raw — no dividing by s.
    setView(v => ({ s: v.s, x: v.x + dx, y: v.y + dy }));
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // A pan that starts on the image and ends over the backdrop still fires `click`
  // on the overlay — click dispatches to the nearest common ancestor of the
  // mousedown and mouseup targets, so the image's stopPropagation never sees it
  // and the modal used to vanish at the end of the gesture. Anchored zoom makes
  // panning a primary gesture, so this fires constantly now.
  const handleOverlayClick = useCallback(() => {
    if (moved.current) return;
    onClose();
  }, [onClose]);

  // Reset on double click — the one gesture worth animating, since its target is
  // fixed geometry with no cursor to stay anchored to.
  const handleDoubleClick = useCallback(() => {
    if (view.s === 1 && view.x === 0 && view.y === 0) return; // nothing would move, so no transition would fire
    resetView();
  }, [view, resetView]);

  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.propertyName !== "transform") return;
    animRef.current = false;
    setAnimate(false);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      data-lenis-prevent
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[99999] flex items-center justify-center cursor-grab active:cursor-grabbing"
      // The browser's own pinch and pan would otherwise consume the gesture
      // before these handlers see it. We implement both, anchored, so this is a
      // replacement rather than a removal.
      style={{ touchAction: "none" }}
      onClick={handleOverlayClick}
      onMouseDown={handleOverlayMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <CloseIcon />
      </button>

      {/* Hint and zoom level share one bottom bar. As two separately positioned
          absolute elements the centred hint ran underneath the right-aligned
          percentage at phone widths. */}
      <div className="absolute bottom-4 md:bottom-6 left-0 right-0 px-5 md:px-6 flex items-end justify-between gap-3 text-[12px] md:text-[13px] font-display select-none pointer-events-none">
        <span className="text-white/40 min-w-0">{t(coarse ? "zoom_hint_touch" : "zoom_hint")}</span>
        <span className="text-white/50 shrink-0">{Math.round(view.s * 100)}%</span>
      </div>

      {/* Product name */}
      <div className="absolute top-5 left-5 md:top-6 md:left-6 pr-16 text-white font-display font-semibold text-[15px] md:text-[16px] select-none pointer-events-none">
        {product.name}
      </div>

      {/* Image.
          Two nodes on purpose. The outer one carries the layout and is never
          transformed, so its rect is the untransformed geometry the anchor math
          needs and can never go stale — not on resize, not when the image decodes
          late. The inner one is the only thing that moves. pointer-events-none /
          -auto keeps hit testing exactly as it was: only the image layer is
          grabbable, so clicks beside it still reach the overlay and close. */}
      <div ref={boxRef} className="max-w-[85vw] max-h-[85vh] pointer-events-none">
        <div
          ref={layerRef}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          onTransitionEnd={handleTransitionEnd}
          className="select-none pointer-events-auto"
          style={{
            // translate MUST stay before scale: that keeps it in unscaled viewport
            // px, which is what both the drag deltas and the anchor law assume.
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            // Constant, and pinned to the box's top-left so the static outer rect
            // above is exactly the coordinate frame the scale pivots in.
            transformOrigin: "0 0",
            // Never during wheel, drag or pinch. The anchor is exact for the
            // COMMITTED transform, so an ease guarantees the screen shows
            // something else for its whole duration and the point visibly slides
            // out from under the cursor. Only the reset animates.
            transition: animate ? `transform ${RESET_MS}ms ease-out` : "none",
          }}
        >
          <img
            src={product.img}
            alt={product.name}
            className="max-w-[85vw] max-h-[85vh] object-contain drop-shadow-2xl pointer-events-none"
            draggable={false}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Cases() {
  const { t } = useTranslation();
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
      <GridLine />

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
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] overflow-x-auto md:overflow-hidden overflow-y-hidden my-6 md:my-8">
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
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 md:bg-black/0 md:group-hover:bg-black/80 flex items-center justify-center transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-75 md:group-hover:scale-100">
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
                        <PlusIcon size={10} />
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
      <div className="md:ml-[max(1.5rem,min(5vw,4rem))] overflow-x-auto md:overflow-hidden overflow-y-hidden border-t border-b border-black">
        <div className="flex animate-marquee-right" style={{ width: "max-content" }}>
          {loopLogos.map((logo, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center w-[200px] md:w-[250px] h-[110px] md:h-[130px] border-r border-black px-6">
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.sizeClass || "max-h-[55%] max-w-[80%]"} object-contain hover:scale-105 transition-all duration-300 mix-blend-multiply`}
              />
              {logo.name && (
                <span className="mt-2 font-display text-[11px] md:text-[12px] font-bold text-black/60 tracking-wide text-center leading-tight whitespace-nowrap">
                  {logo.name}
                </span>
              )}
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
