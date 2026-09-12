import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current) return;
    
    const move = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    // One handler for both: the hit test was duplicated verbatim and only the
    // target scale differed.
    const handleHover = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("button, a")) return;
      gsap.to(cursorRef.current, { scale: e.type === "mouseover" ? 2 : 1, duration: 0.2 });
    };

    const handleMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 0.8, duration: 0.1 });
    };

    const handleMouseUp = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.1 });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleHover);
    window.addEventListener("mouseout", handleHover);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleHover);
      window.removeEventListener("mouseout", handleHover);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-black pointer-events-none mix-blend-difference z-[9998]"
      style={{ transform: "translate(-50%, -50%)" }}
    />
  );
}
