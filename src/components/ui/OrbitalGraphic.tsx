import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export function WGBStar({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill={color}
      />
    </svg>
  );
}

export default function OrbitalGraphic({ glowing = false }: { glowing?: boolean }) {
  const containerRef = useRef<SVGSVGElement>(null);
  
  // Refs for tracking elements
  const dot1Ref = useRef<SVGGElement>(null);
  const dot2Ref = useRef<SVGGElement>(null);
  const dot3Ref = useRef<SVGGElement>(null);
  
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const path3Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Convert ellipses to paths for accurate motionpath rendering.
    // However, gsap MotionPath works with ellipse if we convert them. Wait, better to construct a path string or 
    // simply animate around the ellipse node.
    // MotionPath can use elements directly.
    const ctx = gsap.context(() => {
        if(dot1Ref.current && path1Ref.current) gsap.to(dot1Ref.current, { motionPath: { path: path1Ref.current, align: path1Ref.current, alignOrigin: [0.5, 0.5] }, duration: 6, ease: "none", repeat: -1 });
        if(dot2Ref.current && path2Ref.current) gsap.to(dot2Ref.current, { motionPath: { path: path2Ref.current, align: path2Ref.current, alignOrigin: [0.5, 0.5] }, duration: 8, ease: "none", repeat: -1 });
        if(dot3Ref.current && path3Ref.current) gsap.to(dot3Ref.current, { motionPath: { path: path3Ref.current, align: path3Ref.current, alignOrigin: [0.5, 0.5] }, duration: 10, ease: "none", repeat: -1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const strokeColor = glowing ? "#0028FF" : "#000000";
  const filter = glowing ? "drop-shadow(0 0 8px #0028FF)" : "none";

  return (
    <svg 
      ref={containerRef}
      viewBox="0 0 200 200" 
      className="w-full h-full max-w-[400px] max-h-[400px] md:max-w-full md:max-h-full transition-all duration-700 ease-in-out"
      style={{ overflow: 'visible', filter }}
    >
      <path
        d="M100 88 L101.5 96.5 L110 98 L101.5 99.5 L100 108 L98.5 99.5 L90 98 L98.5 96.5 Z"
        fill={strokeColor}
        className="transition-colors duration-700"
      />
      
      {/* Manual path strings equivalent to the requested ellipses to guarantee GSAP motion path plugin works perfectly */}
      <path ref={path1Ref} d="M 10 100 a 90 30 0 1 0 180 0 a 90 30 0 1 0 -180 0" transform="rotate(-30 100 100)" fill="none" stroke={strokeColor} strokeWidth="0.8" className="transition-colors duration-700" />
      <path ref={path2Ref} d="M 30 100 a 70 25 0 1 0 140 0 a 70 25 0 1 0 -140 0" transform="rotate(20 100 100)" fill="none" stroke={strokeColor} strokeWidth="0.8" className="transition-colors duration-700" />
      <path ref={path3Ref} d="M 45 100 a 55 20 0 1 0 110 0 a 55 20 0 1 0 -110 0" transform="rotate(70 100 100)" fill="none" stroke={strokeColor} strokeWidth="0.8" className="transition-colors duration-700" />
      
      <g ref={dot1Ref}>
        <circle r="3" fill={strokeColor} className="transition-colors duration-700" />
      </g>
      
      <g ref={dot2Ref}>
        <circle r="3" fill={strokeColor} className="transition-colors duration-700" />
      </g>
      
      <g ref={dot3Ref}>
        <circle r="3" fill={strokeColor} className="transition-colors duration-700" />
      </g>
    </svg>
  );
}
